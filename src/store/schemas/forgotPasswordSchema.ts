import { loginSchema } from "./loginSchema";

export const forgotPasswordSchema = loginSchema.omit({ password: true });
