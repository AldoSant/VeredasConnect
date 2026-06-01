export type AutomationUrlValidation = { ok: true } | { ok: false; error: string };

export function validateAutomationUrl(value: string | null | undefined): AutomationUrlValidation {
	const trimmed = value?.trim() ?? "";

	if (!trimmed) {
		return { ok: false, error: "Configure o endereço da automação antes de testar." };
	}

	try {
		const url = new URL(trimmed);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return { ok: false, error: "Use um endereço começando com http:// ou https://." };
		}
		return { ok: true };
	} catch (_error) {
		return { ok: false, error: "O endereço informado não parece válido." };
	}
}
