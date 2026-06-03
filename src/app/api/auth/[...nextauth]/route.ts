import { handlers } from "@/auth";
import { NextRequest } from "next/server";

function preservePublicBasePath(request: NextRequest): NextRequest {
	const url = new URL(request.url);

	if (!url.pathname.startsWith("/connect/api/auth")) {
		url.pathname = `/connect${url.pathname}`;
	}

	return new NextRequest(url, request);
}

export function GET(request: NextRequest) {
	return handlers.GET(preservePublicBasePath(request));
}

export function POST(request: NextRequest) {
	return handlers.POST(preservePublicBasePath(request));
}
