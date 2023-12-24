import NextAuth from "next-auth";
import { ApiAuthCallback } from "@/api/authCallbackApi";
import { DefaultJWT } from "next-auth/jwt";
import { UserRole } from "@/interface/user";
import { Plan, Wallet } from "@/interface/payment";

export interface SessionData {
  user?: {
    id: string;
    email: string;
    name: string;
    role?: UserRole;
    emailVerified?: boolean;
    exp: number;
    iat: number;
    jti: string;
    sub: string;
  };
  role?: UserRole;
  token?: string;
  plan?: Plan;
  wallet?: Wallet;
}

declare module "next-auth" {
  interface Session extends SessionData {}
  interface User extends ApiAuthCallback {}
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT, ApiAuthCallback {}
}
