import { describe, expect, it, vi } from "vitest";
import { dispatchWebhookEvent } from "@/lib/webhook-dispatcher";

describe("dispatchWebhookEvent", () => {
	it("skips empty URLs", async () => {
		const fetchMock = vi.fn();
		const result = await dispatchWebhookEvent({
			url: "",
			payload: { event: "lead.created" },
			fetchFn: fetchMock,
		});

		expect(result).toEqual({ delivered: false, error: "Webhook URL is empty" });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("rejects unsupported protocols before fetch", async () => {
		const fetchMock = vi.fn();
		const result = await dispatchWebhookEvent({
			url: "ftp://example.com/hook",
			payload: { event: "lead.created" },
			fetchFn: fetchMock,
		});

		expect(result.delivered).toBe(false);
		expect(result.error).toContain("Unsupported webhook protocol");
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("posts JSON payloads", async () => {
		const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
		const payload = { event: "lead.created", lead: { id: "lead-1" } };

		const result = await dispatchWebhookEvent({
			url: "https://n8n.example.com/webhook/veredas-lead",
			payload,
			fetchFn: fetchMock,
		});

		expect(result).toEqual({ delivered: true, status: 200 });
		expect(fetchMock).toHaveBeenCalledWith(
			"https://n8n.example.com/webhook/veredas-lead",
			expect.objectContaining({
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			}),
		);
	});

	it("returns a safe error on network failure", async () => {
		const fetchMock = vi.fn().mockRejectedValue(new Error("connection refused"));
		const result = await dispatchWebhookEvent({
			url: "https://n8n.example.com/webhook/veredas-lead",
			payload: { event: "lead.created" },
			fetchFn: fetchMock,
		});

		expect(result).toEqual({ delivered: false, error: "connection refused" });
	});
});
