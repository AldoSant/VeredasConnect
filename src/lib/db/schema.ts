import crypto from "node:crypto";
import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Organization (Empresa)
// biome-ignore lint/suspicious/noExplicitAny: Drizzle circular table references need a type escape for mutually-referencing auth/org tables.
export const organizations: any = sqliteTable("organizations", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	logoUrl: text("logo_url").notNull().default(""),
	ownerId: text("owner_id")
		.notNull()
		// biome-ignore lint/suspicious/noExplicitAny: Deferred callback breaks a circular schema reference.
		.references(() => (users as any).id),
	createdAt: integer("created_at")
		.$defaultFn(() => Date.now())
		.notNull(),
	updatedAt: integer("updated_at")
		.$defaultFn(() => Date.now())
		.notNull(),
});

// Teams (Equipes)
// biome-ignore lint/suspicious/noExplicitAny: Drizzle circular table references need a type escape for mutually-referencing auth/org tables.
export const teams: any = sqliteTable(
	"teams",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		organizationId: text("organization_id")
			.notNull()
			// biome-ignore lint/suspicious/noExplicitAny: Deferred callback breaks a circular schema reference.
			.references(() => (organizations as any).id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		// biome-ignore lint/suspicious/noExplicitAny: Deferred callback breaks a circular schema reference.
		supervisorId: text("supervisor_id").references(() => (users as any).id),
		createdAt: integer("created_at")
			.$defaultFn(() => Date.now())
			.notNull(),
	},
	(table) => ({
		orgIdx: index("team_org_idx").on(table.organizationId),
	}),
);

// Auth.js tables
// biome-ignore lint/suspicious/noExplicitAny: Drizzle circular table references need a type escape for mutually-referencing auth/org tables.
export const users: any = sqliteTable(
	"user",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text("name"),
		email: text("email").unique(),
		emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
		image: text("image"),
		passwordHash: text("password_hash"),
		// Hierarchical fields
		role: text("role").notNull().default("MEMBER"), // 'ADMIN' | 'SUPERVISOR' | 'MEMBER'
		// biome-ignore lint/suspicious/noExplicitAny: Deferred callback breaks a circular schema reference.
		organizationId: text("organization_id").references(() => (organizations as any).id),
		// biome-ignore lint/suspicious/noExplicitAny: Deferred callback breaks a circular schema reference.
		teamId: text("team_id").references(() => (teams as any).id),
	},
	(table) => ({
		orgIdx: index("user_org_idx").on(table.organizationId),
		teamIdx: index("user_team_idx").on(table.teamId),
	}),
);

export const accounts = sqliteTable("account", {
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refresh_token: text("refresh_token"),
	access_token: text("access_token"),
	expires_at: integer("expires_at"),
	token_type: text("token_type"),
	scope: text("scope"),
	id_token: text("id_token"),
	session_state: text("session_state"),
});

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

// Profiles (App Specific)
export const profiles = sqliteTable(
	"profiles",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text("user_id").notNull(),
		slug: text("slug").notNull().unique(),
		displayName: text("display_name").notNull().default(""),
		bio: text("bio").notNull().default(""),
		avatarUrl: text("avatar_url").notNull().default(""),
		theme: text("theme").notNull().default("minimal"),
		jobTitle: text("job_title").notNull().default(""),
		company: text("company").notNull().default(""),
		phone: text("phone").notNull().default(""),
		whatsapp: text("whatsapp").notNull().default(""),
		leadFormActive: integer("lead_form_active", { mode: "boolean" }).notNull().default(false),
		leadFormTitle: text("lead_form_title").notNull().default("Inscreva-se ou deixe sua mensagem"),
		webhookUrl: text("webhook_url").notNull().default(""),
		// Hierarchical context
		organizationId: text("organization_id").references(() => organizations.id),
		teamId: text("team_id").references(() => teams.id),
		createdAt: integer("created_at")
			.$defaultFn(() => Date.now())
			.notNull(),
		updatedAt: integer("updated_at")
			.$defaultFn(() => Date.now())
			.notNull(),
	},
	(table) => ({
		orgIdx: index("profile_org_idx").on(table.organizationId),
		teamIdx: index("profile_team_idx").on(table.teamId),
		userIdIdx: index("profile_user_idx").on(table.userId),
	}),
);

// Captura de Leads B2B
export const leads = sqliteTable(
	"leads",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		profileId: text("profile_id")
			.notNull()
			.references(() => profiles.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		email: text("email").notNull(),
		phone: text("phone"),
		company: text("company"),
		message: text("message"),
		// CRM fields
		status: text("status").notNull().default("new"), // 'new' | 'contacted' | 'qualified' | 'closed'
		tags: text("tags").notNull().default(""), // comma-separated
		notes: text("notes").notNull().default(""),
		// Hierarchical context
		organizationId: text("organization_id").references(() => organizations.id),
		teamId: text("team_id").references(() => teams.id),
		createdAt: integer("created_at")
			.$defaultFn(() => Date.now())
			.notNull(),
	},
	(table) => ({
		orgIdx: index("lead_org_idx").on(table.organizationId),
		teamIdx: index("lead_team_idx").on(table.teamId),
		profileIdx: index("lead_profile_idx").on(table.profileId),
	}),
);

// Social Proof / Testimonials
export const testimonials = sqliteTable("testimonials", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	profileId: text("profile_id")
		.notNull()
		.references(() => profiles.id, { onDelete: "cascade" }),
	authorName: text("author_name").notNull(),
	authorTitle: text("author_title").notNull().default(""),
	authorAvatar: text("author_avatar").notNull().default(""),
	content: text("content").notNull(),
	rating: integer("rating").notNull().default(5), // 1-5 stars
	isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: integer("created_at")
		.$defaultFn(() => Date.now())
		.notNull(),
});

export const linkItems = sqliteTable("link_items", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	profileId: text("profile_id")
		.notNull()
		.references(() => profiles.id, { onDelete: "cascade" }),
	type: text("type").notNull().default("link"), // 'link' | 'header' | 'divider'
	title: text("title").notNull().default(""),
	url: text("url").notNull().default(""),
	sortOrder: integer("sort_order").notNull().default(0),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
	startDate: integer("start_date", { mode: "timestamp" }),
	endDate: integer("end_date", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
});

// Click events
export const clickEvents = sqliteTable("click_events", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	linkItemId: text("link_item_id")
		.notNull()
		.references(() => linkItems.id, { onDelete: "cascade" }),
	clickedAt: integer("clicked_at")
		.$defaultFn(() => Date.now())
		.notNull(),
	deviceType: text("device_type"),
	browser: text("browser"),
	os: text("os"),
	referrer: text("referrer"),
});

export const webhookDeliveries = sqliteTable(
	"webhook_deliveries",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		profileId: text("profile_id")
			.notNull()
			.references(() => profiles.id, { onDelete: "cascade" }),
		event: text("event").notNull(),
		status: text("status").notNull(),
		httpStatus: integer("http_status"),
		error: text("error"),
		endpointHost: text("endpoint_host").notNull(),
		endpointPath: text("endpoint_path"),
		durationMs: integer("duration_ms").notNull().default(0),
		createdAt: integer("created_at")
			.$defaultFn(() => Date.now())
			.notNull(),
	},
	(table) => ({
		profileIdx: index("webhook_delivery_profile_idx").on(table.profileId),
		eventIdx: index("webhook_delivery_event_idx").on(table.event),
		statusIdx: index("webhook_delivery_status_idx").on(table.status),
		createdAtIdx: index("webhook_delivery_created_at_idx").on(table.createdAt),
	}),
);

// NFC Physical Cards Management
export const nfcCards = sqliteTable("nfc_cards", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id").notNull(),
	label: text("label").notNull().default("Meu Cartão"),
	profileId: text("profile_id").references(() => profiles.id, { onDelete: "set null" }),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.$defaultFn(() => new Date())
		.notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many, one }) => ({
	teams: many(teams),
	users: many(users),
	owner: one(users, {
		fields: [organizations.ownerId],
		references: [users.id],
	}),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [teams.organizationId],
		references: [organizations.id],
	}),
	supervisor: one(users, {
		fields: [teams.supervisorId],
		references: [users.id],
	}),
	members: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [users.organizationId],
		references: [organizations.id],
	}),
	team: one(teams, {
		fields: [users.teamId],
		references: [teams.id],
	}),
	profiles: many(profiles),
}));

export const profilesRelations = relations(profiles, ({ many, one }) => ({
	linkItems: many(linkItems),
	leads: many(leads),
	nfcCards: many(nfcCards),
	testimonials: many(testimonials),
	webhookDeliveries: many(webhookDeliveries),
	organization: one(organizations, {
		fields: [profiles.organizationId],
		references: [organizations.id],
	}),
	team: one(teams, {
		fields: [profiles.teamId],
		references: [teams.id],
	}),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
	profile: one(profiles, {
		fields: [leads.profileId],
		references: [profiles.id],
	}),
	organization: one(organizations, {
		fields: [leads.organizationId],
		references: [organizations.id],
	}),
	team: one(teams, {
		fields: [leads.teamId],
		references: [teams.id],
	}),
}));

export const linkItemsRelations = relations(linkItems, ({ one, many }) => ({
	profile: one(profiles, {
		fields: [linkItems.profileId],
		references: [profiles.id],
	}),
	clickEvents: many(clickEvents),
}));

export const clickEventsRelations = relations(clickEvents, ({ one }) => ({
	linkItem: one(linkItems, {
		fields: [clickEvents.linkItemId],
		references: [linkItems.id],
	}),
}));

export const webhookDeliveriesRelations = relations(webhookDeliveries, ({ one }) => ({
	profile: one(profiles, {
		fields: [webhookDeliveries.profileId],
		references: [profiles.id],
	}),
}));

export const nfcCardsRelations = relations(nfcCards, ({ one }) => ({
	profile: one(profiles, {
		fields: [nfcCards.profileId],
		references: [profiles.id],
	}),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
	profile: one(profiles, {
		fields: [testimonials.profileId],
		references: [profiles.id],
	}),
}));
