interface AutomationProfileInput {
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

interface AutomationVisitorInput {
	ipHash?: string | null;
	userAgent?: string | null;
}

interface LinkClickedLinkInput {
	id: string;
	title: string;
	url: string;
}

interface BuildLeadCreatedEventInput {
	profile: AutomationProfileInput;
	lead: LeadCreatedLeadInput;
	publicUrl?: string | null;
	now?: Date;
}

interface BuildWebhookTestEventInput {
	profile: AutomationProfileInput;
	publicUrl?: string | null;
	now?: Date;
}

interface BuildLinkClickedEventInput {
	profile: AutomationProfileInput;
	link: LinkClickedLinkInput;
	visitor?: AutomationVisitorInput;
	publicUrl?: string | null;
	now?: Date;
}

interface BuildVcardDownloadedEventInput {
	profile: AutomationProfileInput;
	visitor?: AutomationVisitorInput;
	publicUrl?: string | null;
	now?: Date;
}

const optionalText = (value: string | null | undefined) => {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
};

const toIsoString = (value: number | Date) => new Date(value).toISOString();

function buildBaseEvent(now: Date) {
	return {
		occurredAt: now.toISOString(),
		source: "veredas-connect" as const,
	};
}

function buildProfilePayload(profile: AutomationProfileInput, publicUrl?: string | null) {
	return {
		id: profile.id,
		slug: profile.slug,
		displayName: profile.displayName,
		company: optionalText(profile.company),
		organizationId: profile.organizationId ?? null,
		teamId: profile.teamId ?? null,
		publicUrl: optionalText(publicUrl),
	};
}

function buildVisitorPayload(visitor?: AutomationVisitorInput) {
	return {
		ipHash: optionalText(visitor?.ipHash),
		userAgent: optionalText(visitor?.userAgent),
	};
}

export function buildLeadCreatedEvent({
	profile,
	lead,
	publicUrl,
	now = new Date(),
}: BuildLeadCreatedEventInput) {
	return {
		event: "lead.created" as const,
		...buildBaseEvent(now),
		profile: buildProfilePayload(profile, publicUrl),
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

export function buildWebhookTestEvent({
	profile,
	publicUrl,
	now = new Date(),
}: BuildWebhookTestEventInput) {
	return {
		event: "webhook.test" as const,
		...buildBaseEvent(now),
		profile: buildProfilePayload(profile, publicUrl),
		message: "Evento de teste enviado pelo Veredas Connect.",
	};
}

export function buildLinkClickedEvent({
	profile,
	link,
	visitor,
	publicUrl,
	now = new Date(),
}: BuildLinkClickedEventInput) {
	return {
		event: "link.clicked" as const,
		...buildBaseEvent(now),
		profile: buildProfilePayload(profile, publicUrl),
		link: {
			id: link.id,
			title: link.title,
			url: link.url,
		},
		visitor: buildVisitorPayload(visitor),
	};
}

export function buildVcardDownloadedEvent({
	profile,
	visitor,
	publicUrl,
	now = new Date(),
}: BuildVcardDownloadedEventInput) {
	return {
		event: "vcard.downloaded" as const,
		...buildBaseEvent(now),
		profile: buildProfilePayload(profile, publicUrl),
		visitor: buildVisitorPayload(visitor),
	};
}

export type LeadCreatedEvent = ReturnType<typeof buildLeadCreatedEvent>;
export type WebhookTestEvent = ReturnType<typeof buildWebhookTestEvent>;
export type LinkClickedEvent = ReturnType<typeof buildLinkClickedEvent>;
export type VcardDownloadedEvent = ReturnType<typeof buildVcardDownloadedEvent>;
export type AutomationEvent =
	| LeadCreatedEvent
	| WebhookTestEvent
	| LinkClickedEvent
	| VcardDownloadedEvent;
