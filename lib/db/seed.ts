import { prisma } from "./client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🧹 Wiping all mock data from database...");

  // Delete dependent records first to satisfy foreign key constraints
  await prisma.wishlistItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.productReview.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productMedia.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.contactSubmission.deleteMany({});
  await prisma.siteSetting.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🌱 Seeding two users (admin & user)...");

  const passwordHash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@demo.com",
      phone: "+919876543210",
      passwordHash: passwordHash,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "user@demo.com",
      phone: "+919876543211",
      passwordHash: passwordHash,
      role: "CUSTOMER",
    },
  });

  console.log("📦 Seeding 12 storefront categories into database...");

  const initialCategories = [
    { name: "New Arrivals", slug: "new-arrivals", badge: "HOT", description: "Explore our latest handcrafted collection direct from Panipat.", imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800" },
    { name: "Trending Cordsets", slug: "trending-cordsets", badge: "POPULAR", description: "Coordinated designer suit & pant sets popular across India.", imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800" },
    { name: "S / M / L Section", slug: "s-m-l-section", description: "Standard size tailored suit sets ready to ship.", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800" },
    { name: "Dresses & Gowns", slug: "dresses", description: "Elegant Indo-Western dresses and partywear floor-length gowns.", imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800" },
    { name: "Plus-Size Collection", slug: "plus-size", description: "Comfortable and stylish plus-size ethnic wear up to 5XL.", imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800" },
    { name: "Partywear Suits", slug: "partywear", description: "Heavy embroidered Anarkalis and party wear suit sets.", imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800" },
    { name: "Denim Wear", slug: "denim-wear", description: "Modern fusion denim kurtas, jackets and bottom wear.", imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800" },
    { name: "Bottom Wear & Salwars", slug: "bottom-wear", description: "Palazzos, salwars, pants and leggings to complement your tops.", imageUrl: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800" },
    { name: "Ethnic Wear", slug: "ethnic-wear", description: "Traditional handcrafted Panipat ethnic wear collection.", imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800" },
    { name: "Night Suits", slug: "night-suits", description: "Ultra-soft breathable cotton night suits and loungewear.", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" },
    { name: "Tops, Tunics & T-Shirts", slug: "tops-tunics", description: "Casual short kurtis, tunics and printed dailywear tops.", imageUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800" },
    { name: "Sale Articles", slug: "sale-articles", badge: "UP TO 40% OFF", description: "Special discounted articles with up to 40% off direct from factory.", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" },
  ];

  for (const cat of initialCategories) {
    await prisma.category.create({
      data: cat,
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`   - Admin: admin@demo.com / 123456 (ID: ${admin.id})`);
  console.log(`   - User:  user@demo.com / 123456 (ID: ${user.id})`);
  console.log(`   - Seeded ${initialCategories.length} categories.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
