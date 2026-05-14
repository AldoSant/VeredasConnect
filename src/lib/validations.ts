import { z } from "zod";

// Reserved slugs that conflict with app routes
export const RESERVED_SLUGS = [
	"login",
	"signup",
	"editor",
	"analytics",
	"settings",
	"api",
	"admin",
	"about",
	"help",
	"support",
	"terms",
	"privacy",
	"auth",
	"dashboard",
	"account",
	"profile",
	"public",
	"static",
	"assets",
	"images",
	"favicon",
];

export const slugSchema = z
	.string()
	.min(3, "Username must be at least 3 characters")
	.max(30, "Username must be at most 30 characters")
	.regex(
		/^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
		"Username must be lowercase alphanumeric with hyphens, cannot start or end with a hyphen",
	)
	.refine((val) => !RESERVED_SLUGS.includes(val), "This username is reserved");

export const profileSchema = z.object({
	displayName: z.string().max(50, "Name must be at most 50 characters"),
	bio: z.string().max(160, "Bio must be at most 160 characters"),
	avatarUrl: z.string().url("Must be a valid URL").or(z.literal("")),
	theme: z.enum(["minimal", "dark", "colorful", "professional"]),
	jobTitle: z.string().max(50, "Job title must be at most 50 characters").optional(),
	company: z.string().max(50, "Company must be at most 50 characters").optional(),
	phone: z.string().max(30, "Phone must be at most 30 characters").optional(),
	whatsapp: z.string().max(30, "WhatsApp must be at most 30 characters").optional(),
	leadFormActive: z.boolean().optional(),
	leadFormTitle: z.string().max(60, "Title must be at most 60 characters").optional(),
	webhookUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export const linkItemSchema = z
	.object({
		type: z.enum(["link", "header", "divider"]),
		title: z.string().max(100).optional(),
		url: z.string().url("Must be a valid URL").optional(),
	})
	.refine(
		(data) => {
			if (data.type === "link") return !!data.title && !!data.url;
			if (data.type === "header") return !!data.title;
			return true; // divider needs nothing
		},
		{ message: "Links require title and URL; headers require title" },
	);

export const bulkUpdateSchema = z.object({
	items: z.array(
		z.object({
			id: z.string().uuid(),
			sortOrder: z.number().int().nonnegative(),
			title: z.string().optional(),
			url: z.string().optional(),
			isActive: z.boolean().optional(),
			startDate: z.string().datetime({ offset: true }).optional().nullable(),
			endDate: z.string().datetime({ offset: true }).optional().nullable(),
		}),
	),
});

export const slugCheckSchema = z.object({
	slug: z.string().min(1),
});
