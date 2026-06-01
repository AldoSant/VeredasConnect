import { describe, expect, it } from "vitest";
import { getAutomationHealthCopy, getDeliveryStatusCopy } from "@/lib/automation-copy";

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
});
