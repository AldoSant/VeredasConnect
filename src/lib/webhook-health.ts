import type { StoredWebhookDelivery, WebhookDeliveryStatus } from "@/lib/webhook-deliveries";

export type WebhookHealthStatus = "healthy" | "degraded" | "failing" | "idle";

export interface WebhookHealthEventSummary {
	event: string;
	total: number;
	failures: number;
}

export interface WebhookHealthFailureSummary {
	id: string;
	event: string;
	httpStatus: number | null;
	error: string | null;
	createdAt: number;
}

export interface WebhookHealthSummary {
	status: WebhookHealthStatus;
	totalDeliveries: number;
	successfulDeliveries: number;
	failedDeliveries: number;
	successRate: number;
	failureRate: number;
	averageDurationMs: number;
	lastDeliveryAt: number | null;
	lastFailure: WebhookHealthFailureSummary | null;
	events: WebhookHealthEventSummary[];
	recommendation: string;
}

function percentage(part: number, total: number) {
	if (total === 0) return 0;
	return Math.round((part / total) * 100);
}

function average(values: number[]) {
	if (values.length === 0) return 0;
	return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getRecommendation(status: WebhookHealthStatus) {
	switch (status) {
		case "healthy":
			return "Automação saudável. Manter monitoramento preventivo.";
		case "degraded":
			return "Monitorar falhas recentes e validar se o orquestrador está respondendo de forma estável.";
		case "failing":
			return "Revisar o endpoint, credenciais e disponibilidade do orquestrador antes de depender desta automação.";
		case "idle":
			return "Enviar um teste para validar a automação antes de colocá-la em produção.";
	}
}

function statusFromDeliveries(failureRate: number, failedDeliveries: number): WebhookHealthStatus {
	if (failedDeliveries === 0) return "healthy";
	if (failureRate >= 50) return "failing";
	return "degraded";
}

function summarizeEvents(deliveries: StoredWebhookDelivery[]): WebhookHealthEventSummary[] {
	const byEvent = new Map<string, { total: number; failures: number }>();

	for (const delivery of deliveries) {
		const current = byEvent.get(delivery.event) ?? { total: 0, failures: 0 };
		current.total += 1;
		if ((delivery.status as WebhookDeliveryStatus) === "failed") current.failures += 1;
		byEvent.set(delivery.event, current);
	}

	return [...byEvent.entries()]
		.map(([event, summary]) => ({ event, ...summary }))
		.sort((a, b) => a.event.localeCompare(b.event));
}

export function summarizeWebhookHealth(deliveries: StoredWebhookDelivery[]): WebhookHealthSummary {
	const totalDeliveries = deliveries.length;

	if (totalDeliveries === 0) {
		return {
			status: "idle",
			totalDeliveries: 0,
			successfulDeliveries: 0,
			failedDeliveries: 0,
			successRate: 0,
			failureRate: 0,
			averageDurationMs: 0,
			lastDeliveryAt: null,
			lastFailure: null,
			events: [],
			recommendation: getRecommendation("idle"),
		};
	}

	const successfulDeliveries = deliveries.filter(
		(delivery) => delivery.status === "success",
	).length;
	const failedDeliveries = totalDeliveries - successfulDeliveries;
	const failureRate = percentage(failedDeliveries, totalDeliveries);
	const status = statusFromDeliveries(failureRate, failedDeliveries);
	const sortedByDate = [...deliveries].sort((a, b) => b.createdAt - a.createdAt);
	const lastFailure = sortedByDate.find((delivery) => delivery.status === "failed");

	return {
		status,
		totalDeliveries,
		successfulDeliveries,
		failedDeliveries,
		successRate: percentage(successfulDeliveries, totalDeliveries),
		failureRate,
		averageDurationMs: average(deliveries.map((delivery) => delivery.durationMs)),
		lastDeliveryAt: sortedByDate[0]?.createdAt ?? null,
		lastFailure: lastFailure
			? {
					id: lastFailure.id,
					event: lastFailure.event,
					httpStatus: lastFailure.httpStatus,
					error: lastFailure.error,
					createdAt: lastFailure.createdAt,
				}
			: null,
		events: summarizeEvents(deliveries),
		recommendation: getRecommendation(status),
	};
}
