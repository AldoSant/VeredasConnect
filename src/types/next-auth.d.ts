import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: "ADMIN" | "SUPERVISOR" | "MEMBER";
			organizationId?: string | null;
			teamId?: string | null;
		} & DefaultSession["user"];
	}

	interface User {
		role: "ADMIN" | "SUPERVISOR" | "MEMBER";
		organizationId?: string | null;
		teamId?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role: "ADMIN" | "SUPERVISOR" | "MEMBER";
		organizationId?: string | null;
		teamId?: string | null;
	}
}
