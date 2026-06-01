import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getHierarchyFilter, getSessionScope } from "@/lib/auth/rbac";
import { buildWebhookTestEvent } from "@/lib/automation-events";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { appPath } from "@/lib/paths";
import { apiRateLimiter } from "@/lib/rate-limit";
import { dispatchWebhookEvent } from "@/lib/webhook-dispatcher";

export async function POST(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = apiRateLimiter.check(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const scope = await getSessionScope();
		const body = await request.json().catch(() => ({}));
		const profileId = typeof body.profileId === "string" ? body.profileId : null;
		const hierarchyFilter = await getHierarchyFilter(profiles, scope);

		const profile = await db.query.profiles.findFirst({
			where: profileId
				? hierarchyFilter
					? and(eq(profiles.id, profileId), hierarchyFilter)
					: eq(profiles.id, profileId)
				: hierarchyFilter,
		});

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		if (!profile.webhookUrl) {
			return NextResponse.json({ error: "Webhook URL is not configured" }, { status: 400 });
		}

		const payload = buildWebhookTestEvent({
			profile,
			publicUrl: `${request.nextUrl.origin}${appPath(`/${profile.slug}`)}`,
		});
		const delivery = await dispatchWebhookEvent({ url: profile.webhookUrl, payload });

		return NextResponse.json({ delivery, payload });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
