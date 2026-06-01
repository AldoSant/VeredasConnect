interface WhatsAppUrlInput {
	number: string;
	displayName?: string;
	slug?: string;
	message?: string;
}

export function normalizeWhatsAppNumber(number: string): string {
	return number.replace(/\D/g, "").replace(/^0+/, "");
}

export function buildWhatsAppUrl({
	number,
	displayName,
	slug,
	message,
}: WhatsAppUrlInput): string | null {
	const normalizedNumber = normalizeWhatsAppNumber(number);

	if (!normalizedNumber) {
		return null;
	}

	const profileName = displayName?.trim() || (slug ? `@${slug}` : "");
	const defaultMessage = profileName
		? `Olá, ${profileName}! Vim pelo Veredas Connect e gostaria de mais informações.`
		: "Olá! Vim pelo Veredas Connect e gostaria de mais informações.";

	return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message || defaultMessage)}`;
}
