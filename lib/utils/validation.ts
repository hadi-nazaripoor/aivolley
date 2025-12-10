import { z } from "zod";

// Phone number validation (Iranian format: 09XXXXXXXXX)
export const phoneNumberSchema = z
  .string()
  .min(1, "شماره تلفن الزامی است")
  .regex(/^09\d{9}$/, "شماره تلفن باید با 09 شروع شود و 11 رقم باشد");

// Password validation
export const passwordSchema = z
  .string()
  .min(1, "رمز عبور الزامی است")
  .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد");

// Login schema
export const loginSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
});

// Register schema
export const registerSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمزهای عبور مطابقت ندارند",
  path: ["confirmPassword"],
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  phoneNumber: phoneNumberSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمزهای عبور مطابقت ندارند",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

