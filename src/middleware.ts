import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { stripAppBasePath } from "@/lib/paths";

export async function middleware(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	if (!token) {
		const loginUrl = new URL("/connect/login", request.url);
		loginUrl.searchParams.set("callbackUrl", stripAppBasePath(request.nextUrl.pathname));
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/editor",
		"/editor/:path*",
		"/analytics",
		"/analytics/:path*",
		"/settings",
		"/settings/:path*",
	],
};
