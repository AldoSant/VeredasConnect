import { db } from "@/lib/db";
import { webhookDeliveries } from "@/lib/db/schema";
import { dispatchWebhookEvent } from "@/lib/webhook-dispatcher";

type WebhookDeliveryResult = Awaited<ReturnType<typeof dispatchWebhookEvent>>;

export type WebhookDeliveryStatus = "success" | "failed";

interface BuildWebhookDeliveryRecordInput {
	profileId: string;
	event: string;
	url: string;
	delivery: WebhookDeliveryResult;
	durationMs: number;
	createdAt?: number;
}

export interface WebhookDeliveryRecord {
	profileId: string;
	event: string;
	status: WebhookDeliveryStatus;
	httpStatus: number | null;
	error: string | null;
	endpointHost: string;
	endpointPath: string | null;
	durationMs: number;
	createdAt: number;
}

export interface StoredWebhookDelivery extends WebhookDeliveryRecord {
	id: string;
}

export interface WebhookDeliverySummary {
	id: string;
	event: string;
	status: WebhookDeliveryStatus;
	isSuccess: boolean;
	httpStatus: number | null;
	error: string | null;
	endpoint: string;
	durationMs: number;
	createdAt: number;
}

function truncateError(error?: string): string | null {
	if (!error) return null;
	return error.slice(0, 240);
}

function parseEndpoint(url: string): Pick<WebhookDeliveryRecord, "endpointHost" | "endpointPath"> {
	try {
		const parsedUrl = new URL(url.trim());
		return {
			endpointHost: parsedUrl.hostname,
			endpointPath: parsedUrl.pathname || "/",
		};
	} catch (_error) {
		return {
			endpointHost: "invalid-url",
			endpointPath: null,
		};
	}
}

export function buildWebhookDeliveryRecord({
	profileId,
	event,
	url,
	delivery,
	durationMs,
	createdAt = Date.now(),
}: BuildWebhookDeliveryRecordInput): WebhookDeliveryRecord {
	const endpoint = parseEndpoint(url);
	return {
		profileId,
		event,
		status: delivery.delivered ? "success" : "failed",
		httpStatus: delivery.status ?? null,
		error: delivery.delivered ? null : truncateError(delivery.error),
		endpointHost: endpoint.endpointHost,
		endpointPath: endpoint.endpointPath,
		durationMs: Math.max(0, Math.round(durationMs)),
		createdAt,
	};
}

export function summarizeWebhookDelivery(delivery: StoredWebhookDelivery): WebhookDeliverySummary {
	const path = delivery.endpointPath ?? "";
	return {
		id: delivery.id,
		event: delivery.event,
		status: delivery.status,
		isSuccess: delivery.status === "success",
		httpStatus: delivery.httpStatus,
		error: delivery.error,
		endpoint: `${delivery.endpointHost}${path}`,
		durationMs: delivery.durationMs,
		createdAt: delivery.createdAt,
	};
}

export async function recordWebhookDelivery(input: BuildWebhookDeliveryRecordInput) {
	const record = buildWebhookDeliveryRecord(input);
	const [stored] = await db.insert(webhookDeliveries).values(record).returning();
	return stored;
}

export async function dispatchAndRecordWebhook({
	profileId,
	event,
	url,
	payload,
}: Pick<BuildWebhookDeliveryRecordInput, "profileId" | "event" | "url"> & { payload: unknown }) {
	const startedAt = Date.now();
	const delivery = await dispatchWebhookEvent({ url, payload });
	const durationMs = Date.now() - startedAt;

	try {
		await recordWebhookDelivery({ profileId, event, url, delivery, durationMs });
	} catch (error) {
		console.warn("Failed to record webhook delivery", {
			profileId,
			event,
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}

	return delivery;
}
