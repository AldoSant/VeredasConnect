import { and, desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getHierarchyFilter, getSessionScope } from "@/lib/auth/rbac";
import { buildLeadCreatedEvent } from "@/lib/automation-events";
import { db } from "@/lib/db";
import { leads, profiles } from "@/lib/db/schema";
import { appPath } from "@/lib/paths";
import { dispatchAndRecordWebhook } from "@/lib/webhook-deliveries";

// GET: list all leads for dashboard CRM
export async function GET(request: NextRequest) {
	try {
		const scope = await getSessionScope();
		const profileId = request.nextUrl.searchParams.get("id");

		const hierarchyFilter = await getHierarchyFilter(leads, scope);
		let filter = hierarchyFilter;

		if (profileId) {
			// Se o usuário pediu um perfil específico, validamos se ele tem acesso
			const profile = await db.query.profiles.findFirst({
				where: and(eq(profiles.id, profileId), await getHierarchyFilter(profiles, scope)),
			});

			if (!profile) {
				return NextResponse.json({ error: "Unauthorized or Profile not found" }, { status: 403 });
			}

			filter = and(hierarchyFilter, eq(leads.profileId, profileId));
		}

		const userLeads = await db.query.leads.findMany({
			where: filter,
			orderBy: [desc(leads.createdAt)],
		});

		return NextResponse.json({ leads: userLeads });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

const leadSchema = z.object({
	slug: z.string(),
	name: z.string().min(2, "Name is too short"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	company: z.string().optional(),
	message: z.string().optional(),
	lgpdConsent: z.literal(true, {
		error: "Consentimento LGPD é obrigatório para enviar o contato",
	}),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const result = leadSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
		}

		const data = result.data;

		// 1. Find profile by slug
		const profile = await db.query.profiles.findFirst({
			where: eq(profiles.slug, data.slug),
		});

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		// 2. Disable submission if leadForm is deactivated
		if (!profile.leadFormActive) {
			return NextResponse.json(
				{ error: "Lead capture is disabled for this profile" },
				{ status: 403 },
			);
		}

		// 3. Save lead (inheriting organization and team from profile)
		const [lead] = await db
			.insert(leads)
			.values({
				profileId: profile.id,
				name: data.name,
				email: data.email,
				phone: data.phone || null,
				company: data.company || null,
				message: data.message || null,
				organizationId: profile.organizationId,
				teamId: profile.teamId,
			})
			.returning();

		// 4. Notify external automation without blocking lead capture.
		if (profile.webhookUrl) {
			const origin = request.nextUrl.origin;
			const event = buildLeadCreatedEvent({
				profile,
				lead,
				publicUrl: `${origin}${appPath(`/${profile.slug}`)}`,
			});

			dispatchAndRecordWebhook({
				profileId: profile.id,
				event: event.event,
				url: profile.webhookUrl,
				payload: event,
			}).then((delivery) => {
				if (!delivery.delivered) {
					console.warn("Lead webhook delivery failed", {
						profileId: profile.id,
						leadId: lead.id,
						status: delivery.status,
						error: delivery.error,
					});
				}
			});
		}

		return NextResponse.json({ lead }, { status: 201 });
	} catch (error) {
		console.error("Error creating lead:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
