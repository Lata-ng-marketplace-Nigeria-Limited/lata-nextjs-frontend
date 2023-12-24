import CredentialsProvider from "next-auth/providers/credentials";
import { authCallbackApi } from "@/api/auth";
import z from "zod";
import type { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: {},
        publicToken: {},
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            user: z.string().optional(),
            publicToken: z.string().optional(),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { user, publicToken } = parsedCredentials.data;

        if (user) {
          return JSON.parse(user);
        }

        if (publicToken) {
          return await authCallbackApi(publicToken);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      const userData = {
        ...token,
        ...user,
      };
      return {
        ...token,
        id: userData?.id,
        balance: user?.wallet?.balance,
        wallet: userData?.wallet,
        role: userData?.role,
        token: userData?.token,
        emailVerified: userData?.emailVerified,
      } as any;
    },
    async session({ session, token }) {
      // console.log("session", token, user);
      session.user = token as any;
      session.role = (token.role as any) || "";
      session.token = (token.token as string) || undefined;
      session.wallet = (token.wallet as any) || undefined;
      return session;
    },
  },
};
