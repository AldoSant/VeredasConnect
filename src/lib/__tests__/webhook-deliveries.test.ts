import { describe, expect, it } from "vitest";
import { buildWebhookDeliveryRecord, summarizeWebhookDelivery } from "@/lib/webhook-deliveries";

describe("webhook delivery records", () => {
	it("marks successful deliveries and strips query secrets from endpoint labels", () => {
		const record = buildWebhookDeliveryRecord({
			profileId: "profile_1",
			event: "lead.created",
			url: "https://automation.example.com/webhook/veredas?token=secret",
			delivery: { delivered: true, status: 202 },
			durationMs: 126,
		});

		expect(record.status).toBe("success");
		expect(record.httpStatus).toBe(202);
		expect(record.endpointHost).toBe("automation.example.com");
		expect(record.endpointPath).toBe("/webhook/veredas");
		expect(record.error).toBeNull();
	});

	it("normalizes failed deliveries with a compact error summary", () => {
		const record = buildWebhookDeliveryRecord({
			profileId: "profile_1",
			event: "webhook.test",
			url: "not a url",
			delivery: {
				delivered: false,
				status: 500,
				error: "x".repeat(400),
			},
			durationMs: 35,
		});

		expect(record.status).toBe("failed");
		expect(record.httpStatus).toBe(500);
		expect(record.endpointHost).toBe("invalid-url");
		expect(record.endpointPath).toBeNull();
		expect(record.error).toHaveLength(240);
	});

	it("summarizes records for UI without leaking full URLs", () => {
		const summary = summarizeWebhookDelivery({
			id: "delivery_1",
			profileId: "profile_1",
			event: "link.clicked",
			status: "failed",
			httpStatus: 404,
			error: "Webhook returned HTTP 404",
			endpointHost: "automation.example.com",
			endpointPath: "/webhook/veredas",
			durationMs: 45,
			createdAt: 123456,
		});

		expect(summary.endpoint).toBe("automation.example.com/webhook/veredas");
		expect(summary.fullUrl).toBeUndefined();
		expect(summary.isSuccess).toBe(false);
	});
});
