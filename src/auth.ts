import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";
import crypto from "node:crypto";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db) as any,
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email) return null;
				const email = credentials.email as string;

				const existingUser = await db
					.select()
					.from(users)
					.where(eq(users.email, email))
					.get();

				if (existingUser) {
					return {
						id: existingUser.id,
						email: existingUser.email,
						name: existingUser.name,
						role: existingUser.role as "ADMIN" | "SUPERVISOR" | "MEMBER",
						organizationId: existingUser.organizationId,
						teamId: existingUser.teamId,
					};
				}

				// Auto-register on first login (local dev convenience)
				const id = crypto.randomUUID();
				const newUser = {
					id,
					email,
					name: "New User",
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
