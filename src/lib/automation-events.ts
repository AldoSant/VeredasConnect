interface LeadCreatedProfileInput {
	id: string;
	slug: string;
	displayName: string;
	company?: string | null;
	organizationId?: string | null;
	teamId?: string | null;
}

interface LeadCreatedLeadInput {
	id: string;
	name: string;
	email: string;
	phone?: string | null;
	company?: string | null;
	message?: string | null;
	createdAt: number | Date;
}

interface BuildLeadCreatedEventInput {
	profile: LeadCreatedProfileInput;
	lead: LeadCreatedLeadInput;
	publicUrl?: string | null;
	now?: Date;
}

const optionalText = (value: string | null | undefined) => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
};

const toIsoString = (value: number | Date) => new Date(value).toISOString();

export function buildLeadCreatedEvent({
	profile,
	lead,
	publicUrl,
	now = new Date(),
}: BuildLeadCreatedEventInput) {
	return {
		event: "lead.created" as const,
		occurredAt: now.toISOString(),
		source: "veredas-connect" as const,
		profile: {
			id: profile.id,
			slug: profile.slug,
			displayName: profile.displayName,
			company: optionalText(profile.company),
			organizationId: profile.organizationId ?? null,
			teamId: profile.teamId ?? null,
			publicUrl: optionalText(publicUrl),
		},
		lead: {
			id: lead.id,
			name: lead.name,
			email: lead.email,
			phone: optionalText(lead.phone),
			company: optionalText(lead.company),
			message: optionalText(lead.message),
			createdAt: toIsoString(lead.createdAt),
		},
	};
}

export type LeadCreatedEvent = ReturnType<typeof buildLeadCreatedEvent>;
export type AutomationEvent = LeadCreatedEvent;
