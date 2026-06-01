import { and, desc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getHierarchyFilter, getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { profiles, webhookDeliveries } from "@/lib/db/schema";
import type { WebhookDeliveryStatus } from "@/lib/webhook-deliveries";
import { summarizeWebhookHealth } from "@/lib/webhook-health";

export async function GET(request: NextRequest) {
	try {
		const scope = await getSessionScope();
		const profileId = request.nextUrl.searchParams.get("profileId");
		const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "50");
		const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;
		const hierarchyFilter = await getHierarchyFilter(profiles, scope);

		const accessibleProfiles = await db
			.select({ id: profiles.id })
			.from(profiles)
			.where(
				profileId
					? hierarchyFilter
						? and(eq(profiles.id, profileId), hierarchyFilter)
						: eq(profiles.id, profileId)
					: hierarchyFilter,
			);

		if (accessibleProfiles.length === 0) {
			return NextResponse.json({ health: summarizeWebhookHealth([]) });
		}

		const profileIds = new Set(accessibleProfiles.map((profile) => profile.id));
		const rows = await db.query.webhookDeliveries.findMany({
			where: profileId ? eq(webhookDeliveries.profileId, profileId) : undefined,
			orderBy: [desc(webhookDeliveries.createdAt)],
			limit: profileId ? limit : limit * 3,
		});

		const deliveries = rows
			.filter((delivery) => profileIds.has(delivery.profileId))
			.slice(0, limit)
			.map((delivery) => ({
				...delivery,
				status: (delivery.status === "success" ? "success" : "failed") as WebhookDeliveryStatus,
			}));

		return NextResponse.json({ health: summarizeWebhookHealth(deliveries) });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
