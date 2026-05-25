export interface ProfileCompletionProfile {
	displayName?: string | null;
	bio?: string | null;
	avatarUrl?: string | null;
	phone?: string | null;
	whatsapp?: string | null;
	leadFormActive?: boolean | null;
}

export interface ProfileCompletionLink {
	isActive?: boolean | null;
}

export interface ProfileCompletionItem {
	id: "display-name" | "bio" | "avatar" | "links" | "contact";
	label: string;
	description: string;
	completed: boolean;
}

export interface ProfileCompletionResult {
	items: ProfileCompletionItem[];
	completedCount: number;
	totalCount: number;
	percentage: number;
	isComplete: boolean;
}

function hasText(value: string | null | undefined) {
	return Boolean(value?.trim());
}

export function getProfileCompletion(
	profile: ProfileCompletionProfile,
	links: ProfileCompletionLink[],
): ProfileCompletionResult {
	const activeLinkCount = links.filter((link) => link.isActive !== false).length;
	const hasContactChannel =
		hasText(profile.whatsapp) || hasText(profile.phone) || profile.leadFormActive === true;

	const items: ProfileCompletionItem[] = [
		{
			id: "display-name",
			label: "Nome público",
			description: "Mostre quem está por trás da página.",
			completed: hasText(profile.displayName),
		},
		{
			id: "bio",
			label: "Bio curta",
			description: "Explique em poucas palavras o que você faz.",
			completed: hasText(profile.bio),
		},
		{
			id: "avatar",
			label: "Foto ou avatar",
			description: "Aumente confiança com uma imagem de perfil.",
			completed: hasText(profile.avatarUrl),
		},
		{
			id: "links",
			label: "3 conexões ativas",
			description: "Adicione ao menos três links para dar opções claras ao visitante.",
			completed: activeLinkCount >= 3,
		},
		{
			id: "contact",
			label: "Canal de contato ou lead",
			description: "Configure WhatsApp, telefone ou formulário para converter visitantes.",
			completed: hasContactChannel,
		},
	];

	const completedCount = items.filter((item) => item.completed).length;
	const totalCount = items.length;
	const percentage = Math.round((completedCount / totalCount) * 100);

	return {
		items,
		completedCount,
		totalCount,
		percentage,
		isComplete: completedCount === totalCount,
	};
}
