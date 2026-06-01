import type { WebhookHealthStatus } from "@/lib/webhook-health";

export type AutomationTone = "idle" | "success" | "warning" | "error";

export interface AutomationHealthCopy {
	label: string;
	description: string;
	tone: AutomationTone;
}

export interface DeliveryStatusCopy {
	label: string;
	tone: "success" | "error";
}

export interface DeliveryRecoveryCopy {
	label: string;
	description: string;
}

const healthCopyByStatus: Record<WebhookHealthStatus, AutomationHealthCopy> = {
	idle: {
		label: "Ainda não testado",
		description: "Envie um teste para confirmar se a automação está pronta.",
		tone: "idle",
	},
	healthy: {
		label: "Funcionando",
		description: "Os últimos envios chegaram normalmente.",
		tone: "success",
	},
	degraded: {
		label: "Precisa de atenção",
		description: "Alguns envios não chegaram. Vale conferir a configuração.",
		tone: "warning",
	},
	failing: {
		label: "Não está entregando",
		description: "Os envios recentes falharam. Verifique o endereço da automação.",
		tone: "error",
	},
};

export function getAutomationHealthCopy(status: WebhookHealthStatus): AutomationHealthCopy {
	return healthCopyByStatus[status];
}

export function getDeliveryStatusCopy(isSuccess: boolean): DeliveryStatusCopy {
	return isSuccess
		? { label: "Enviado", tone: "success" }
		: { label: "Não entregue", tone: "error" };
}

export function getDeliveryRecoveryCopy({
	isSuccess,
	canRetry,
}: {
	isSuccess: boolean;
	canRetry: boolean;
}): DeliveryRecoveryCopy | null {
	if (isSuccess) return null;

	if (canRetry) {
		return {
			label: "Tentar enviar de novo",
			description: "Reenvia este evento usando os dados salvos com segurança.",
		};
	}

	return {
		label: "Reenvio indisponível para este registro",
		description:
			"Por segurança, os dados completos desse envio não foram salvos. Envie um novo teste após ajustar a configuração.",
	};
}
