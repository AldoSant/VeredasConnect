import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { stripAppBasePath } from "@/lib/paths";

const PRODUCTION_ORIGIN = "https://veredasinc.com.br";

function getPublicOrigin(request: NextRequest) {
	const forwardedHost = request.headers.get("x-forwarded-host");
	const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
	const host = forwardedHost ?? request.headers.get("host") ?? request.nextUrl.host;

	if (!host || host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
		return process.env.NODE_ENV === "production" ? PRODUCTION_ORIGIN : request.nextUrl.origin;
	}

	return `${forwardedProto}://${host}`;
}

export async function middleware(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	if (!token) {
		const loginUrl = new URL("/connect/login", getPublicOrigin(request));
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
