import { renderEmailTemplate } from "../lib/email/render";
import { MOCK_ORDERS } from "../lib/mock-data";

async function testAllEmailTemplates() {
  console.log("🚀 Testing EJS Email Templates Suite Compilation...\n");

  const sampleOrder = {
    ...MOCK_ORDERS[0],
    subtotal: 399800,
    shippingFee: 0,
    discount: 40000,
    total: 359800,
  };

  const sampleCartItems = [
    {
      productName: "Chanderi Silk Anarkali Suit Set",
      variantSize: "M",
      quantity: 1,
      price: 249900,
      productImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
    },
    {
      productName: "Handcrafted Phulkari Dupatta",
      variantSize: "Free Size",
      quantity: 1,
      price: 149900,
      productImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const testCases = [
    {
      name: "account-welcome",
      data: { subject: "Welcome to Sai Collection", userName: "Pooja Sharma" },
    },
    {
      name: "password-reset-otp",
      data: { subject: "Password Reset Verification Code", userName: "Pooja Sharma", otpCode: "8841", expiresInMinutes: 10 },
    },
    {
      name: "order-placed",
      data: { subject: "Order Confirmation - #SAI-ORD-2026-8841", order: sampleOrder },
    },
    {
      name: "payment-failed",
      data: { subject: "Payment Failed - Action Required", order: sampleOrder },
    },
    {
      name: "order-shipped",
      data: { subject: "Your Package Has Been Dispatched!", order: sampleOrder },
    },
    {
      name: "order-delivered",
      data: { subject: "Your Order Has Been Delivered", order: sampleOrder },
    },
    {
      name: "order-cancelled",
      data: { subject: "Order Cancellation Notice", order: sampleOrder },
    },
    {
      name: "refund-processed",
      data: {
        subject: "Refund Processed Successfully",
        userName: "Pooja Sharma",
        order: sampleOrder,
        refund: { amount: 359800, refundId: "rfnd_9a8b7c6d5e" },
      },
    },
    {
      name: "abandoned-cart",
      data: { subject: "Items Saved In Your Cart", cartItems: sampleCartItems },
    },
  ];

  let passed = 0;
  for (const test of testCases) {
    try {
      const html = await renderEmailTemplate(test.name, test.data);
      if (html && html.includes("SAI COLLECTION")) {
        console.log(`✅ [PASS] Template: ${test.name}.ejs (${html.length} bytes rendered)`);
        passed++;
      } else {
        console.error(`❌ [FAIL] Template: ${test.name}.ejs rendered empty or invalid output.`);
      }
    } catch (error) {
      console.error(`❌ [ERROR] Template: ${test.name}.ejs failed rendering:`, error);
    }
  }

  console.log(`\n🎉 Verification Summary: ${passed}/${testCases.length} templates compiled successfully!`);
}

testAllEmailTemplates().catch(console.error);
