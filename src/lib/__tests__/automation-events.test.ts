import { describe, expect, it } from "vitest";
import {
	buildLeadCreatedEvent,
	buildLinkClickedEvent,
	buildVcardDownloadedEvent,
	buildWebhookTestEvent,
} from "@/lib/automation-events";

describe("buildLeadCreatedEvent", () => {
	it("builds a stable n8n-friendly lead.created payload", () => {
		const event = buildLeadCreatedEvent({
			profile: {
				id: "profile-1",
				slug: "ana-costa",
				displayName: "Ana Costa",
				company: "Veredas Imóveis",
				organizationId: "org-1",
				teamId: "team-1",
			},
			lead: {
				id: "lead-1",
				name: "João Silva",
				email: "joao@example.com",
				phone: "+55 77 99999-0000",
				company: "Fazenda Boa Vista",
				message: "Quero uma proposta",
				createdAt: Date.UTC(2026, 0, 1, 0, 0, 0),
			},
			publicUrl: "https://example.com/connect/ana-costa",
			now: new Date("2026-06-01T12:00:00.000Z"),
		});

		expect(event).toEqual({
			event: "lead.created",
			occurredAt: "2026-06-01T12:00:00.000Z",
			source: "veredas-connect",
			profile: {
				id: "profile-1",
				slug: "ana-costa",
				displayName: "Ana Costa",
				company: "Veredas Imóveis",
				organizationId: "org-1",
				teamId: "team-1",
				publicUrl: "https://example.com/connect/ana-costa",
			},
			lead: {
				id: "lead-1",
				name: "João Silva",
				email: "joao@example.com",
				phone: "+55 77 99999-0000",
				company: "Fazenda Boa Vista",
				message: "Quero uma proposta",
				createdAt: "2026-01-01T00:00:00.000Z",
			},
		});
	});

	it("normalizes empty optional lead fields", () => {
		const event = buildLeadCreatedEvent({
			profile: { id: "p", slug: "slug", displayName: "Nome" },
			lead: {
				id: "l",
				name: "Lead",
				email: "lead@example.com",
				createdAt: Date.UTC(2026, 0, 1, 0, 0, 0),
			},
			now: new Date("2026-06-01T12:00:00.000Z"),
		});

		expect(event.profile.company).toBeNull();
		expect(event.profile.publicUrl).toBeNull();
		expect(event.lead.phone).toBeNull();
		expect(event.lead.company).toBeNull();
		expect(event.lead.message).toBeNull();
	});
});

describe("additional automation events", () => {
	it("builds a webhook.test payload for n8n validation", () => {
		const event = buildWebhookTestEvent({
			profile: { id: "profile-1", slug: "ana", displayName: "Ana", company: "Veredas" },
			publicUrl: "https://example.com/connect/ana",
			now: new Date("2026-06-01T12:00:00.000Z"),
		});

		expect(event).toEqual({
			event: "webhook.test",
			occurredAt: "2026-06-01T12:00:00.000Z",
			source: "veredas-connect",
			profile: {
				id: "profile-1",
				slug: "ana",
				displayName: "Ana",
				company: "Veredas",
				organizationId: null,
				teamId: null,
				publicUrl: "https://example.com/connect/ana",
			},
			message: "Evento de teste enviado pelo Veredas Connect.",
		});
	});

	it("builds a link.clicked payload", () => {
		const event = buildLinkClickedEvent({
			profile: { id: "profile-1", slug: "ana", displayName: "Ana" },
			link: { id: "link-1", title: "WhatsApp", url: "https://wa.me/5577999990000" },
			visitor: { ipHash: "hash-1", userAgent: "Mozilla/5.0" },
			now: new Date("2026-06-01T12:00:00.000Z"),
		});

		expect(event.event).toBe("link.clicked");
		expect(event.link).toEqual({
			id: "link-1",
			title: "WhatsApp",
			url: "https://wa.me/5577999990000",
		});
		expect(event.visitor).toEqual({ ipHash: "hash-1", userAgent: "Mozilla/5.0" });
	});

	it("builds a vcard.downloaded payload", () => {
		const event = buildVcardDownloadedEvent({
			profile: { id: "profile-1", slug: "ana", displayName: "Ana" },
			visitor: { ipHash: null, userAgent: "curl/8" },
			now: new Date("2026-06-01T12:00:00.000Z"),
		});

		expect(event.event).toBe("vcard.downloaded");
		expect(event.visitor.ipHash).toBeNull();
		expect(event.visitor.userAgent).toBe("curl/8");
	});
});
