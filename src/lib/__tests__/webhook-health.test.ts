import { describe, expect, it } from "vitest";
import type { StoredWebhookDelivery } from "@/lib/webhook-deliveries";
import { summarizeWebhookHealth } from "@/lib/webhook-health";

function delivery(overrides: Partial<StoredWebhookDelivery>): StoredWebhookDelivery {
	return {
		id: "delivery-id",
		profileId: "profile-id",
		event: "lead.created",
		status: "success",
		httpStatus: 200,
		error: null,
		endpointHost: "hooks.example.com",
		endpointPath: "/webhook/veredas",
		durationMs: 120,
		createdAt: 1_700_000_000_000,
		...overrides,
	};
}

describe("webhook health summary", () => {
	it("reports healthy automation when recent deliveries are mostly successful", () => {
		const summary = summarizeWebhookHealth([
			delivery({ id: "1", event: "lead.created", status: "success", durationMs: 90 }),
			delivery({ id: "2", event: "link.clicked", status: "success", durationMs: 110 }),
			delivery({ id: "3", event: "webhook.test", status: "success", durationMs: 100 }),
		]);

		expect(summary.status).toBe("healthy");
		expect(summary.totalDeliveries).toBe(3);
		expect(summary.successRate).toBe(100);
		expect(summary.failureRate).toBe(0);
		expect(summary.averageDurationMs).toBe(100);
		expect(summary.events).toEqual([
			{ event: "lead.created", total: 1, failures: 0 },
			{ event: "link.clicked", total: 1, failures: 0 },
			{ event: "webhook.test", total: 1, failures: 0 },
		]);
	});

	it("flags degraded automation when failures exist but most deliveries succeed", () => {
		const summary = summarizeWebhookHealth([
			delivery({ id: "1", status: "success" }),
			delivery({ id: "2", status: "success" }),
			delivery({ id: "3", status: "failed", httpStatus: 500, error: "server error" }),
		]);

		expect(summary.status).toBe("degraded");
		expect(summary.successRate).toBe(67);
		expect(summary.lastFailure?.httpStatus).toBe(500);
		expect(summary.recommendation).toContain("Alguns envios não chegaram");
	});

	it("flags failing automation when failure rate is high", () => {
		const summary = summarizeWebhookHealth([
			delivery({ id: "1", status: "failed", error: "timeout" }),
			delivery({ id: "2", status: "failed", error: "timeout" }),
			delivery({ id: "3", status: "success" }),
		]);

		expect(summary.status).toBe("failing");
		expect(summary.failureRate).toBe(67);
		expect(summary.recommendation).toContain("não está entregando");
	});

	it("reports idle when there are no deliveries", () => {
		const summary = summarizeWebhookHealth([]);

		expect(summary.status).toBe("idle");
		expect(summary.totalDeliveries).toBe(0);
		expect(summary.successRate).toBe(0);
		expect(summary.recommendation).toContain("Envie um teste");
	});
});
