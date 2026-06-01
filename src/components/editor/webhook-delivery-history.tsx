"use client";

import { AlertCircle, CheckCircle2, Clock3, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getDeliveryStatusCopy } from "@/lib/automation-copy";
import { apiPath } from "@/lib/paths";

interface WebhookDeliverySummary {
	id: string;
	event: string;
	status: "success" | "failed";
	isSuccess: boolean;
	httpStatus: number | null;
	error: string | null;
	endpoint: string;
	durationMs: number;
	createdAt: number;
}

interface WebhookDeliveryHistoryProps {
	profileId?: string;
	refreshKey?: number;
}

const relativeFormatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function formatRelativeTime(timestamp: number) {
	const seconds = Math.round((timestamp - Date.now()) / 1000);
	const absSeconds = Math.abs(seconds);

	if (absSeconds < 60) return relativeFormatter.format(seconds, "second");
	const minutes = Math.round(seconds / 60);
	if (Math.abs(minutes) < 60) return relativeFormatter.format(minutes, "minute");
	const hours = Math.round(minutes / 60);
	if (Math.abs(hours) < 24) return relativeFormatter.format(hours, "hour");
	const days = Math.round(hours / 24);
	return relativeFormatter.format(days, "day");
}

export function WebhookDeliveryHistory({ profileId, refreshKey = 0 }: WebhookDeliveryHistoryProps) {
	const [deliveries, setDeliveries] = useState<WebhookDeliverySummary[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadDeliveries = useCallback(async () => {
		if (!profileId) return;
		setIsLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams({ profileId, limit: "6" });
			const res = await fetch(apiPath(`/api/webhook/deliveries?${params.toString()}`));
			const data = await res.json().catch(() => null);
			if (!res.ok) throw new Error(data?.error ?? "Não foi possível carregar o histórico.");
			setDeliveries(data?.deliveries ?? []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Falha ao carregar histórico.");
		} finally {
			setIsLoading(false);
		}
	}, [profileId]);

	useEffect(() => {
		loadDeliveries();
	}, [loadDeliveries]);

	useEffect(() => {
		if (refreshKey > 0) loadDeliveries();
	}, [loadDeliveries, refreshKey]);

	return (
		<div className="rounded-lg border bg-background/70 p-3">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-sm font-medium">Últimos envios</p>
					<p className="text-xs text-muted-foreground">
						Acompanhe se a automação recebeu os testes e eventos recentes.
					</p>
				</div>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="gap-2"
					onClick={loadDeliveries}
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
				<div className="mt-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
					<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{!error && !isLoading && deliveries.length === 0 && (
				<div className="mt-3 flex items-center gap-2 rounded-md border border-dashed p-3 text-xs text-muted-foreground">
					<Clock3 className="h-4 w-4" />
					Nenhum envio registrado ainda. Envie um teste para confirmar a automação.
				</div>
			)}

			{deliveries.length > 0 && (
				<div className="mt-3 space-y-2">
					{deliveries.map((delivery) => {
						const statusCopy = getDeliveryStatusCopy(delivery.isSuccess);

						return (
							<div key={delivery.id} className="rounded-md border p-3 text-xs">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className="flex items-center gap-2">
											{delivery.isSuccess ? (
												<CheckCircle2 className="h-4 w-4 text-emerald-500" />
											) : (
												<AlertCircle className="h-4 w-4 text-destructive" />
											)}
											<span className="font-medium">{delivery.event}</span>
										</div>
										<p className="mt-1 truncate text-muted-foreground">
											Destino configurado: {delivery.endpoint}
										</p>
									</div>
									<span
										className={`rounded-full px-2 py-0.5 font-medium ${
											delivery.isSuccess
												? "bg-emerald-500/10 text-emerald-600"
												: "bg-destructive/10 text-destructive"
										}`}
									>
										{statusCopy.label}
									</span>
								</div>
								<div className="mt-2 flex flex-wrap gap-2 text-muted-foreground">
									<span>{formatRelativeTime(delivery.createdAt)}</span>
								</div>
								{delivery.error && (
									<p className="mt-2 text-destructive">
										Não conseguimos confirmar a entrega. Confira o endereço da automação e teste
										novamente.
									</p>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
