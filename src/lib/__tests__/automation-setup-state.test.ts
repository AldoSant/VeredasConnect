import { describe, expect, it } from "vitest";
import { getAutomationSetupSteps } from "@/lib/automation-setup-state";

describe("automation setup guidance", () => {
	it("guides the user through URL, save, test and status checks", () => {
		expect(getAutomationSetupSteps({ webhookUrl: "", hasUnsavedChanges: false })).toEqual([
			{ label: "Cole o endereço da automação", status: "current" },
			{ label: "Salve as alterações", status: "pending" },
			{ label: "Envie um teste", status: "pending" },
			{ label: "Confira se está funcionando", status: "pending" },
		]);

		expect(
			getAutomationSetupSteps({
				webhookUrl: "https://example.com/automacao",
				hasUnsavedChanges: true,
			}),
		).toEqual([
			{ label: "Cole o endereço da automação", status: "done" },
			{ label: "Salve as alterações", status: "current" },
			{ label: "Envie um teste", status: "pending" },
			{ label: "Confira se está funcionando", status: "pending" },
		]);

		expect(
			getAutomationSetupSteps({
				webhookUrl: "https://example.com/automacao",
				hasUnsavedChanges: false,
				hasRecentDelivery: true,
			}),
		).toEqual([
			{ label: "Cole o endereço da automação", status: "done" },
			{ label: "Salve as alterações", status: "done" },
			{ label: "Envie um teste", status: "done" },
			{ label: "Confira se está funcionando", status: "current" },
		]);
	});
});
