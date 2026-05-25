import crypto from "node:crypto";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
	basePath: "/api/auth",
	adapter: DrizzleAdapter(db) as unknown as Adapter,
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				mode: { label: "Mode", type: "text" },
				name: { label: "Name", type: "text" },
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				const email = String(credentials.email).trim().toLowerCase();
				const password = String(credentials.password);
				const mode = credentials.mode === "signup" ? "signup" : "signin";
				const name = typeof credentials.name === "string" ? credentials.name.trim() : "";

				if (!email || password.length < 8) return null;

				const existingUser = await db.select().from(users).where(eq(users.email, email)).get();

				if (existingUser) {
					if (mode === "signup") return null;

					const passwordIsValid = await verifyPassword(password, existingUser.passwordHash);
					if (!passwordIsValid) return null;

					return {
						id: existingUser.id,
						email: existingUser.email,
						name: existingUser.name,
						role: existingUser.role as "ADMIN" | "SUPERVISOR" | "MEMBER",
						organizationId: existingUser.organizationId,
						teamId: existingUser.teamId,
					};
				}

				if (mode !== "signup") return null;

				// Register only from the explicit signup flow, then store a password hash.
				const id = crypto.randomUUID();
				const newUser = {
					id,
					email,
					name: name || "New User",
					passwordHash: await hashPassword(password),
					role: "MEMBER" as const,
					organizationId: null,
					teamId: null,
				};
				await db.insert(users).values(newUser);
				return newUser;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
				token.role = user.role;
				token.organizationId = user.organizationId;
				token.teamId = user.teamId;
			}
			return token;
		},
		session({ session, token }) {
			if (token.sub) {
				session.user.id = token.sub;
				session.user.role = token.role;
				session.user.organizationId = token.organizationId;
				session.user.teamId = token.teamId;
			}
			return session;
		},
	},
});
