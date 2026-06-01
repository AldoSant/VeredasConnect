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

const statusConfig: Record<
	WebhookHealthStatus,
	{ label: string; className: string; icon: typeof Activity }
> = {
	healthy: {
		label: "Saudável",
		className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
		icon: CheckCircle2,
	},
	degraded: {
		label: "Atenção",
		className: "border-amber-500/30 bg-amber-500/10 text-amber-700",
		icon: AlertTriangle,
	},
	failing: {
		label: "Falhando",
		className: "border-destructive/30 bg-destructive/10 text-destructive",
		icon: AlertTriangle,
	},
	idle: {
		label: "Sem dados",
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
	const StatusIcon = config.icon;

	return (
		<div className="rounded-lg border bg-background/70 p-3">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-sm font-medium">Saúde das automações</p>
					<p className="text-xs text-muted-foreground">
						Resumo das últimas entregas para operação e suporte.
					</p>
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
					Atualizar
				</Button>
			</div>

			{error && (
				<div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
					{error}
				</div>
			)}

			<div className={`mt-3 rounded-md border p-3 ${config.className}`}>
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<StatusIcon className="h-4 w-4" />
						<span className="text-sm font-semibold">{config.label}</span>
					</div>
					<span className="text-xs">{health?.totalDeliveries ?? 0} entregas</span>
				</div>
				<p className="mt-2 text-xs">
					{health?.recommendation ??
						"Enviar um teste para validar a automação antes de colocá-la em produção."}
				</p>
			</div>

			<div className="mt-3 grid gap-2 sm:grid-cols-3">
				<div className="rounded-md border p-2">
					<p className="text-[11px] uppercase text-muted-foreground">Sucesso</p>
					<p className="text-lg font-semibold">{health?.successRate ?? 0}%</p>
				</div>
				<div className="rounded-md border p-2">
					<p className="text-[11px] uppercase text-muted-foreground">Falhas</p>
					<p className="text-lg font-semibold">{health?.failureRate ?? 0}%</p>
				</div>
				<div className="rounded-md border p-2">
					<p className="text-[11px] uppercase text-muted-foreground">Latência média</p>
					<p className="text-lg font-semibold">{health?.averageDurationMs ?? 0} ms</p>
				</div>
			</div>

			{health?.lastFailure && (
				<div className="mt-3 rounded-md border border-destructive/20 p-2 text-xs">
					<p className="font-medium text-destructive">Última falha: {health.lastFailure.event}</p>
					<p className="mt-1 text-muted-foreground">
						Status {health.lastFailure.httpStatus ?? "sem resposta"} —{" "}
						{health.lastFailure.error ?? "erro não informado"}
					</p>
				</div>
			)}

			{health?.events && health.events.length > 0 && (
				<div className="mt-3 space-y-1 text-xs">
					{health.events.map((item) => (
						<div
							key={item.event}
							className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1"
						>
							<span className="font-mono">{item.event}</span>
							<span className="text-muted-foreground">
								{item.total} total · {item.failures} falhas
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
