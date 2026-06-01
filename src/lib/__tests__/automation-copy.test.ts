import { describe, expect, it } from "vitest";
import {
	getAutomationHealthCopy,
	getDeliveryRecoveryCopy,
	getDeliveryStatusCopy,
} from "@/lib/automation-copy";

describe("automation user-facing copy", () => {
	it("maps automation health to simple non-technical labels", () => {
		expect(getAutomationHealthCopy("idle")).toMatchObject({
			label: "Ainda não testado",
			description: "Envie um teste para confirmar se a automação está pronta.",
		});
		expect(getAutomationHealthCopy("healthy")).toMatchObject({
			label: "Funcionando",
			description: "Os últimos envios chegaram normalmente.",
		});
		expect(getAutomationHealthCopy("degraded")).toMatchObject({
			label: "Precisa de atenção",
			description: "Alguns envios não chegaram. Vale conferir a configuração.",
		});
		expect(getAutomationHealthCopy("failing")).toMatchObject({
			label: "Não está entregando",
			description: "Os envios recentes falharam. Verifique o endereço da automação.",
		});
	});

	it("keeps delivery history labels understandable without technical status codes", () => {
		expect(getDeliveryStatusCopy(true)).toMatchObject({ label: "Enviado", tone: "success" });
		expect(getDeliveryStatusCopy(false)).toMatchObject({ label: "Não entregue", tone: "error" });
	});

	it("does not promise manual resend when the original data was not stored", () => {
		expect(getDeliveryRecoveryCopy({ isSuccess: true, canRetry: false })).toBeNull();
		expect(getDeliveryRecoveryCopy({ isSuccess: false, canRetry: false })).toEqual({
			label: "Reenvio indisponível para este registro",
			description:
				"Por segurança, os dados completos desse envio não foram salvos. Envie um novo teste após ajustar a configuração.",
		});
		expect(getDeliveryRecoveryCopy({ isSuccess: false, canRetry: true })).toEqual({
			label: "Tentar enviar de novo",
			description: "Reenvia este evento usando os dados salvos com segurança.",
		});
	});
});
