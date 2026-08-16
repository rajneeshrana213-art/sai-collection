import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

const smtpHost = process.env.EMAIL_SERVER_HOST || process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.EMAIL_SERVER_PORT || process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.EMAIL_SERVER_USER || process.env.SMTP_USER || "";
const smtpPass = process.env.EMAIL_SERVER_PASSWORD || process.env.SMTP_PASS || "";
const fromEmail =
  process.env.FROM_EMAIL ||
  process.env.EMAIL_FROM ||
  (smtpUser ? `"Sai Collection" <${smtpUser}>` : '"Sai Collection" <support@saicollection.com>');

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: smtpUser ? { user: smtpUser, pass: smtpPass } : undefined,
});

const TEMPLATES_DIR = path.join(process.cwd(), "emails", "templates");
const storefrontUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetLink = `${storefrontUrl}/reset-password?token=${token}`;
  
  let htmlContent = "";
  try {
    htmlContent = await ejs.renderFile(path.join(TEMPLATES_DIR, "password-reset-otp.ejs"), {
      subject: "Reset Your Password — Sai Collection",
      userName: name || "Valued Customer",
      otpCode: token.substring(0, 6).toUpperCase(),
      expiresInMinutes: 60,
      storefrontUrl,
    });
  } catch (err) {
    console.warn("EJS render fallback for password reset:", err);
    htmlContent = `<p>Hello ${name || "Customer"}, click <a href="${resetLink}">here</a> to reset your password.</p>`;
  }

  if (!smtpUser && process.env.NODE_ENV !== "production") {
    console.log(`[EMAIL DEV LOG] Sent EJS Password Reset to ${email}. Link: ${resetLink}`);
    return { success: true, devMode: true, resetLink };
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: "Reset Your Password — Sai Collection",
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    throw err;
  }
}

export interface EmailOrderItem {
  id?: string;
  productName?: string;
  variantSize?: string;
  variantColor?: string;
  quantity?: number;
  price?: number;
  productImage?: string;
}

export interface EmailShippingAddress {
  fullName?: string | null;
  phone?: string | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
}

export interface EmailOrderData {
  orderNumber: string;
  createdAt?: string | Date | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  status?: string | null;
  subtotal?: number | null;
  discount?: number | null;
  shippingFee?: number | null;
  total?: number | null;
  courierName?: string | null;
  trackingNumber?: string | null;
  estimatedDelivery?: string | Date | null;
  shippingAddress?: EmailShippingAddress | null;
  shippingFullName?: string | null;
  shippingPhone?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPincode?: string | null;
  items?: EmailOrderItem[] | null;
}

export async function sendOrderConfirmationEmail(email: string, orderData: EmailOrderData) {
  let htmlContent = "";
  try {
    htmlContent = await ejs.renderFile(path.join(TEMPLATES_DIR, "order-placed.ejs"), {
      subject: `Order Confirmation ${orderData.orderNumber}`,
      order: {
        orderNumber: orderData.orderNumber,
        date: new Date(orderData.createdAt || Date.now()).toLocaleDateString("en-IN"),
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus,
        status: orderData.status,
        subtotal: orderData.subtotal,
        discount: orderData.discount || 0,
        shippingFee: orderData.shippingFee || 0,
        total: orderData.total,
        estimatedDelivery: orderData.estimatedDelivery ? new Date(orderData.estimatedDelivery).toLocaleDateString("en-IN") : undefined,
        shippingAddress: orderData.shippingAddress || {
          fullName: orderData.shippingFullName,
          phone: orderData.shippingPhone,
          line1: orderData.shippingLine1,
          line2: orderData.shippingLine2,
          city: orderData.shippingCity,
          state: orderData.shippingState,
          pincode: orderData.shippingPincode,
        },
        items: orderData.items || [],
      },
      storefrontUrl,
    });
  } catch (err) {
    console.warn("EJS render fallback for order placed:", err);
    htmlContent = `<h2>Order Confirmed! ${orderData.orderNumber}</h2><p>Total: ₹${((orderData.total || 0) / 100).toFixed(2)}</p>`;
  }

  if (!smtpUser && process.env.NODE_ENV !== "production") {
    console.log(`[EMAIL DEV LOG] Sent EJS Order Confirmation to ${email} for Order ${orderData.orderNumber}`);
    return { success: true, devMode: true };
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `Order Confirmation ${orderData.orderNumber} — Sai Collection`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
    return { success: false, error: err };
  }
}

export async function sendOrderShippedEmail(email: string, orderData: EmailOrderData) {
  let htmlContent = "";
  try {
    htmlContent = await ejs.renderFile(path.join(TEMPLATES_DIR, "order-shipped.ejs"), {
      subject: `Your Order Has Shipped! ${orderData.orderNumber}`,
      order: {
        orderNumber: orderData.orderNumber,
        courierName: orderData.courierName || "Express Courier",
        trackingNumber: orderData.trackingNumber,
        estimatedDelivery: orderData.estimatedDelivery ? new Date(orderData.estimatedDelivery).toLocaleDateString("en-IN") : "3-5 Business Days",
        shippingAddress: orderData.shippingAddress || {
          fullName: orderData.shippingFullName,
          phone: orderData.shippingPhone,
          line1: orderData.shippingLine1,
          city: orderData.shippingCity,
          state: orderData.shippingState,
          pincode: orderData.shippingPincode,
        },
        items: orderData.items || [],
      },
      storefrontUrl,
    });
  } catch (err) {
    console.warn("EJS render fallback for order shipped:", err);
    htmlContent = `<h2>Order Shipped! ${orderData.orderNumber}</h2>`;
  }

  if (!smtpUser && process.env.NODE_ENV !== "production") {
    console.log(`[EMAIL DEV LOG] Sent EJS Order Shipped Email to ${email} for ${orderData.orderNumber}`);
    return { success: true, devMode: true };
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `Order Shipped ${orderData.orderNumber} — Sai Collection`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send order shipped email:", err);
    return { success: false, error: err };
  }
}

export async function sendOrderDeliveredEmail(email: string, orderData: EmailOrderData) {
  let htmlContent = "";
  try {
    htmlContent = await ejs.renderFile(path.join(TEMPLATES_DIR, "order-delivered.ejs"), {
      subject: `Order Delivered! ${orderData.orderNumber}`,
      order: {
        orderNumber: orderData.orderNumber,
        items: orderData.items || [],
      },
      storefrontUrl,
    });
  } catch (err) {
    console.warn("EJS render fallback for order delivered:", err);
    htmlContent = `<h2>Order Delivered! ${orderData.orderNumber}</h2>`;
  }

  if (!smtpUser && process.env.NODE_ENV !== "production") {
    console.log(`[EMAIL DEV LOG] Sent EJS Order Delivered Email to ${email} for ${orderData.orderNumber}`);
    return { success: true, devMode: true };
  }

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: email,
      subject: `Order Delivered ${orderData.orderNumber} — Sai Collection`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to send order delivered email:", err);
    return { success: false, error: err };
  }
}
