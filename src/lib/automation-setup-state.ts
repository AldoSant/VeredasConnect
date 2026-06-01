export type AutomationSetupStepStatus = "done" | "current" | "pending";

export interface AutomationSetupStep {
	label: string;
	status: AutomationSetupStepStatus;
}

interface AutomationSetupStateInput {
	webhookUrl: string;
	hasUnsavedChanges: boolean;
	hasRecentDelivery?: boolean;
}

const stepLabels = [
	"Cole o endereço da automação",
	"Salve as alterações",
	"Envie um teste",
	"Confira se está funcionando",
] as const;

export function getAutomationSetupSteps({
	webhookUrl,
	hasUnsavedChanges,
	hasRecentDelivery = false,
}: AutomationSetupStateInput): AutomationSetupStep[] {
	const hasUrl = webhookUrl.trim().length > 0;
	const saved = hasUrl && !hasUnsavedChanges;
	const tested = saved && hasRecentDelivery;

	const statuses: AutomationSetupStepStatus[] = [
		hasUrl ? "done" : "current",
		saved ? "done" : hasUrl ? "current" : "pending",
		tested ? "done" : saved ? "current" : "pending",
		tested ? "current" : "pending",
	];

	return stepLabels.map((label, index) => ({ label, status: statuses[index] }));
}
