import { handlers } from "@/auth";

function preservePublicBasePath(request: Request): Request {
	const url = new URL(request.url);

	if (!url.pathname.startsWith("/connect/api/auth")) {
		url.pathname = `/connect${url.pathname}`;
	}

	return new Request(url, request);
}

export function GET(request: Request) {
	return handlers.GET(preservePublicBasePath(request) as any);
}

export function POST(request: Request) {
	return handlers.POST(preservePublicBasePath(request) as any);
}
