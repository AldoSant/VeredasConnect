import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

function getClientIp(request: NextRequest) {
	const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	return forwardedFor || request.headers.get("x-real-ip") || null;
}

export function buildVisitorContext(request: NextRequest) {
	const ip = getClientIp(request);
	return {
		ipHash: ip ? createHash("sha256").update(ip).digest("hex") : null,
		userAgent: request.headers.get("user-agent") || null,
	};
}
