import crypto from "crypto";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_mockkey12345";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_secret_key_12345";
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "mock_webhook_secret_12345";

const razorpayInstance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

export async function createRazorpayOrder(amountPaise: number, orderNumber: string) {
  if (process.env.NODE_ENV !== "production" && keyId.startsWith("rzp_test_mock")) {
    // Mock Razorpay order for local dev environment
    return {
      id: `order_rzp_mock_${Date.now()}`,
      entity: "order",
      amount: amountPaise,
      amount_paid: 0,
      amount_due: amountPaise,
      currency: "INR",
      receipt: orderNumber,
      status: "created",
    };
  }

  try {
    const order = await razorpayInstance.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: orderNumber,
    });
    return order;
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    throw new Error("Failed to initialize payment gateway order.");
  }
}

export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  if (process.env.NODE_ENV !== "production" && razorpayOrderId.startsWith("order_rzp_mock_")) {
    return true; // Bypass signature check for local test mocks
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
}

export function verifyWebhookSignature(bodyRaw: string, signatureHeader: string): boolean {
  if (process.env.NODE_ENV !== "production" && signatureHeader === "mock_signature") {
    return true;
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(bodyRaw)
    .digest("hex");

  return expectedSignature === signatureHeader;
}
