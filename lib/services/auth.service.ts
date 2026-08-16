import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/db/client";
import { setSessionCookie, clearSessionCookie } from "@/lib/security/jwt";
import { sendPasswordResetEmail } from "./email.service";
import { RegisterInput, LoginInput, ForgotPasswordInput, ResetPasswordInput, ChangePasswordInput } from "@/lib/validations/auth.schema";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, ...(input.phone ? [{ phone: input.phone }] : [])],
    },
  });

  if (existingUser) {
    throw new Error("A user with this email or phone number already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      passwordHash,
      role: input.role || "CUSTOMER",
    },
  });

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function logoutUser() {
  await clearSessionCookie();
  return { success: true };
}

export async function requestPasswordReset(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    // Return success to avoid email enumeration attacks
    return { success: true, message: "If an account with that email exists, a password reset link has been sent." };
  }

  // Invalidate past unused tokens for this email
  await prisma.passwordResetToken.updateMany({
    where: { email: user.email, used: false },
    data: { used: true },
  });

  // Generate 64-char secure random token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour validity

  await prisma.passwordResetToken.create({
    data: {
      email: user.email,
      token,
      expiresAt,
    },
  });

  await sendPasswordResetEmail(user.email, token, user.name);

  return { success: true, message: "If an account with that email exists, a password reset link has been sent." };
}

export async function resetPasswordWithToken(input: ResetPasswordInput) {
  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { token: input.token },
  });

  if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
    throw new Error("Invalid or expired password reset token.");
  }

  const user = await prisma.user.findUnique({
    where: { email: resetRecord.email },
  });

  if (!user) {
    throw new Error("User account no longer exists.");
  }

  const passwordHash = await bcrypt.hash(input.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetRecord.id },
    data: { used: true },
  });

  return { success: true, message: "Password has been successfully reset." };
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found.");

  const isValidPassword = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!isValidPassword) throw new Error("Incorrect current password.");

  const passwordHash = await bcrypt.hash(input.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { success: true, message: "Password changed successfully." };
}
