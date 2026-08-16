import { prisma } from "@/lib/db/client";
import { CreateOrderInput } from "@/lib/validations/order.schema";
import { createRazorpayOrder } from "./payment.service";
import { sendOrderConfirmationEmail } from "./email.service";

export async function processCheckoutOrder(input: CreateOrderInput, userId?: string) {
  // 1. Fetch products & variants, validate stock
  const variantIds = input.items.map((item) => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds }, isActive: true },
    include: {
      product: {
        include: { media: { where: { isPrimary: true }, take: 1 } },
      },
    },
  });

  if (variants.length !== input.items.length) {
    throw new Error("One or more items in your cart are no longer available.");
  }

  let subtotal = 0;
  const orderItemsData = input.items.map((item) => {
    const v = variants.find((v) => v.id === item.variantId)!;
    if (v.stock < item.quantity) {
      throw new Error(`Stock unavailable for ${v.product.name} (${v.size}/${v.color}). Requested: ${item.quantity}, Available: ${v.stock}`);
    }
    const itemTotal = v.price * item.quantity;
    subtotal += itemTotal;

    const primaryImg = v.product.media[0]?.url || "/placeholder-saree.jpg";

    return {
      productId: v.productId,
      variantId: v.id,
      productName: v.product.name,
      productImage: primaryImg,
      variantSize: v.size,
      variantColor: v.color,
      quantity: item.quantity,
      price: v.price,
    };
  });

  // 2. Validate Coupon Code
  let discount = 0;
  let couponId: string | undefined = undefined;

  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.couponCode.toUpperCase(), isActive: true },
    });

    if (coupon) {
      const now = new Date();
      if (coupon.validUntil && coupon.validUntil < now) {
        throw new Error("Coupon code has expired.");
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new Error("Coupon code usage limit reached.");
      }
      if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        throw new Error(`Coupon requires a minimum order value of ₹${coupon.minOrderValue / 100}.`);
      }

      if (coupon.type === "PERCENT") {
        discount = Math.round((subtotal * coupon.value) / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.value;
      }
      couponId = coupon.id;
    }
  }

  // Free shipping threshold: ₹999 = 99900 paise
  const freeShippingThreshold = 99900;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 9900; // ₹99
  const total = Math.max(0, subtotal - discount + shippingFee);

  // Generate unique order number: SAI-YYYY-XXXX
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `SAI-${new Date().getFullYear()}-${randomSuffix}`;

  // 3. Execute Transaction
  const order = await prisma.$transaction(async (tx) => {
    // Decrement Stock
    for (const item of input.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Increment Coupon Usage
    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Create Order
    const createdOrder = await tx.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        guestEmail: input.guestEmail || null,
        guestPhone: input.guestPhone || null,
        subtotal,
        discount,
        shippingFee,
        total,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "COD" ? "PENDING" : "PENDING",
        status: "CONFIRMED",
        shippingFullName: input.shippingAddress.fullName,
        shippingPhone: input.shippingAddress.phone,
        shippingLine1: input.shippingAddress.line1,
        shippingLine2: input.shippingAddress.line2 || null,
        shippingCity: input.shippingAddress.city,
        shippingState: input.shippingAddress.state,
        shippingPincode: input.shippingAddress.pincode,
        couponId,
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    return createdOrder;
  });

  // 4. Initialize Razorpay Order if paymentMethod is RAZORPAY
  let razorpayOrderData = null;
  if (input.paymentMethod === "RAZORPAY") {
    razorpayOrderData = await createRazorpayOrder(total, order.orderNumber);
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrderData.id },
    });
  }

  // 5. Trigger Confirmation Email asynchronously
  const recipientEmail = input.guestEmail || (userId ? (await prisma.user.findUnique({ where: { id: userId } }))?.email : null);
  if (recipientEmail) {
    sendOrderConfirmationEmail(recipientEmail, order).catch(console.error);
  }

  return {
    order,
    razorpayOrder: razorpayOrderData,
  };
}

export async function getGuestOrderTracking(orderNumber: string, contact: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const matchesEmail = order.guestEmail?.toLowerCase() === contact.toLowerCase();
  const matchesPhone = order.shippingPhone.includes(contact) || order.guestPhone?.includes(contact);

  if (!matchesEmail && !matchesPhone) {
    throw new Error("Contact information does not match order records.");
  }

  return order;
}
