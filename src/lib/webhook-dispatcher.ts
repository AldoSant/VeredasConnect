type FetchLike = (url: string, init: RequestInit) => Promise<Pick<Response, "ok" | "status">>;

interface DispatchWebhookEventInput {
	url?: string | null;
	payload: unknown;
	timeoutMs?: number;
	fetchFn?: FetchLike;
}

interface DispatchWebhookEventResult {
	delivered: boolean;
	status?: number;
	error?: string;
}

function createTimeoutSignal(timeoutMs: number): AbortSignal | undefined {
	if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
		return AbortSignal.timeout(timeoutMs);
	}
	return undefined;
}

export async function dispatchWebhookEvent({
	url,
	payload,
	timeoutMs = 3000,
	fetchFn = fetch,
}: DispatchWebhookEventInput): Promise<DispatchWebhookEventResult> {
	const trimmedUrl = url?.trim();
	if (!trimmedUrl) {
		return { delivered: false, error: "Webhook URL is empty" };
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(trimmedUrl);
	} catch (_error) {
		return { delivered: false, error: "Invalid webhook URL" };
	}

	if (!["http:", "https:"].includes(parsedUrl.protocol)) {
		return { delivered: false, error: `Unsupported webhook protocol: ${parsedUrl.protocol}` };
	}

	try {
		const response = await fetchFn(trimmedUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			signal: createTimeoutSignal(timeoutMs),
		});

		return response.ok
			? { delivered: true, status: response.status }
			: {
					delivered: false,
					status: response.status,
					error: `Webhook returned HTTP ${response.status}`,
				};
	} catch (error) {
		return {
			delivered: false,
			error: error instanceof Error ? error.message : "Webhook dispatch failed",
		};
	}
}
