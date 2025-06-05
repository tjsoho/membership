import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db/prisma";
import bcrypt from "bcrypt";

// Add type declaration for the session user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      isAdmin?: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("👤 Authorizing user...");

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log("🔍 Found user:", user ? "Yes" : "No");

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log("🔐 Password match:", passwordMatch ? "Yes" : "No");

        if (!passwordMatch) {
          return null;
        }

        console.log("✅ Authorization successful");
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("🎫 Creating JWT token");
      if (user) {
        // Fetch isAdmin from the database if not present
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        token.id = user.id;
        token.email = user.email;
        token.isAdmin = dbUser?.isAdmin ?? false;
      }
      console.log("📝 Token created:", token);
      return token;
    },
    session: async ({ session, token }) => {
      console.log("🔑 Creating session");
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      console.log("📍 Session created:", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};
export const getAuthSession = () => getServerSession(authOptions);
