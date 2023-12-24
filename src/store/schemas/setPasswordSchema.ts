import { loginSchema } from "./loginSchema";

export const setPasswordSchema = loginSchema.omit({ email: true })
