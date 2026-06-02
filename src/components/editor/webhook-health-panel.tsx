"use client";

import {
	type Activity,
	AlertTriangle,
	CheckCircle2,
	Clock3,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAutomationHealthCopy } from "@/lib/automation-copy";
import { apiPath } from "@/lib/paths";

type WebhookHealthStatus = "healthy" | "degraded" | "failing" | "idle";

interface WebhookHealthSummary {
	status: WebhookHealthStatus;
	totalDeliveries: number;
	successfulDeliveries: number;
	failedDeliveries: number;
	successRate: number;
	failureRate: number;
	averageDurationMs: number;
	lastDeliveryAt: number | null;
	lastFailure: {
		id: string;
		event: string;
		httpStatus: number | null;
		error: string | null;
		createdAt: number;
	} | null;
	events: Array<{ event: string; total: number; failures: number }>;
	recommendation: string;
}

interface WebhookHealthPanelProps {
	profileId?: string;
	refreshKey?: number;
}

const statusConfig: Record<WebhookHealthStatus, { className: string; icon: typeof Activity }> = {
	healthy: {
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
		icon: CheckCircle2,
	},
	degraded: {
		className: "border-amber-500/30 bg-amber-500/10 text-amber-700",
		icon: AlertTriangle,
	},
	failing: {
		className: "border-destructive/30 bg-destructive/10 text-destructive",
		icon: AlertTriangle,
	},
	idle: {
		className: "border-muted bg-muted/40 text-muted-foreground",
		icon: Clock3,
	},
};

export function WebhookHealthPanel({ profileId, refreshKey = 0 }: WebhookHealthPanelProps) {
	const [health, setHealth] = useState<WebhookHealthSummary | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadHealth = useCallback(async () => {
		if (!profileId) return;
		setIsLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams({ profileId, limit: "50" });
			const res = await fetch(apiPath(`/api/webhook/health?${params.toString()}`));
			const data = await res.json().catch(() => null);
			if (!res.ok)
				throw new Error(data?.error ?? "Não foi possível carregar a saúde das automações.");
			setHealth(data?.health ?? null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Falha ao carregar saúde das automações.");
		} finally {
			setIsLoading(false);
		}
	}, [profileId]);

	useEffect(() => {
		loadHealth();
	}, [loadHealth]);

	useEffect(() => {
		if (refreshKey > 0) loadHealth();
	}, [loadHealth, refreshKey]);

	const config = statusConfig[health?.status ?? "idle"];
	const copy = getAutomationHealthCopy(health?.status ?? "idle");
	const StatusIcon = config.icon;

	return (
		<div className="rounded-lg border bg-background/60 p-3">
			<div className="flex items-center justify-between gap-3">
				<div className="space-y-0.5">
					<p className="text-sm font-medium">Status da automação</p>
					<p className="text-xs text-muted-foreground">{copy.description}</p>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="gap-2"
					onClick={loadHealth}
					disabled={isLoading || !profileId}
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<RefreshCw className="h-4 w-4" />
					)}
					Atualizar status
				</Button>
			</div>

			{error && (
				<div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
					{error}
				</div>
			)}

			<div className={`mt-3 rounded-md border px-3 py-2 ${config.className}`}>
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<StatusIcon className="h-4 w-4" />
						<span className="text-sm font-semibold">{copy.label}</span>
					</div>
					<span className="text-xs">{health?.totalDeliveries ?? 0} envios recentes</span>
				</div>
				<p className="mt-2 text-xs">{health?.recommendation ?? copy.description}</p>
			</div>

			<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
				<span>{health?.successRate ?? 0}% funcionaram</span>
				<span>{health?.failureRate ?? 0}% não entregues</span>
				<span>
					Último envio:{" "}
					{health?.lastDeliveryAt
						? new Date(health.lastDeliveryAt).toLocaleTimeString("pt-BR", {
								hour: "2-digit",
								minute: "2-digit",
							})
						: "—"}
				</span>
			</div>

			{health?.lastFailure && (
				<div className="mt-3 rounded-md border border-destructive/20 p-2 text-xs">
					<p className="font-medium text-destructive">
						Último problema: {health.lastFailure.event}
					</p>
					<p className="mt-1 text-muted-foreground">
						Não conseguimos confirmar a entrega. Confira a configuração e envie um novo teste.
					</p>
				</div>
			)}
		</div>
	);
}
