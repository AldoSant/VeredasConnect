import { desc, eq, and } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { linkItems, profiles } from "@/lib/db/schema";
import { apiRateLimiter } from "@/lib/rate-limit";
import { linkItemSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = apiRateLimiter.check(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const scope = await getSessionScope();
		const body = await request.json();

		// Validate profileId presence
		const profileId = body.profileId;
		if (!profileId) {
			return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
		}

		// Fetch profile and verify hierarchy
		const profile = await db.query.profiles.findFirst({
			where: eq(profiles.id, profileId),
		});

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		const isOwner = profile.userId === scope.id;
		const isAdminOfOrg = scope.role === "ADMIN" && scope.organizationId === profile.organizationId;
		const isSupervisorOfTeam = scope.role === "SUPERVISOR" && scope.teamId === profile.teamId;

		if (!isOwner && !isAdminOfOrg && !isSupervisorOfTeam) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const result = linkItemSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
		}

		// Get current max sortOrder
		const lastItem = await db.query.linkItems.findFirst({
			where: eq(linkItems.profileId, profile.id),
			orderBy: [desc(linkItems.sortOrder)],
		});
		const nextOrder = (lastItem?.sortOrder ?? -1) + 1;

		const [newLink] = await db
			.insert(linkItems)
			.values({
				profileId: profile.id,
				type: result.data.type,
				title: result.data.title ?? "",
				url: result.data.url ?? "",
				sortOrder: nextOrder,
			})
			.returning();

		return NextResponse.json({ link: newLink }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
