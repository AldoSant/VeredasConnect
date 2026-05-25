import { and, eq, type InferInsertModel } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { linkItems, profiles } from "@/lib/db/schema";
import { apiRateLimiter } from "@/lib/rate-limit";
import { bulkUpdateSchema } from "@/lib/validations";

export async function PUT(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = apiRateLimiter.check(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const scope = await getSessionScope();
		const body = await request.json();

		const profileId = body.profileId;
		if (!profileId) {
			return NextResponse.json({ error: "Profile ID is required" }, { status: 400 });
		}

		// Verify hierarchy access
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

		const result = bulkUpdateSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
		}

		// Update each item ensuring it belongs to the verified profile
		for (const item of result.data.items) {
			const updateData: Partial<InferInsertModel<typeof linkItems>> = {
				sortOrder: item.sortOrder,
				updatedAt: new Date(),
			};
			if (item.title !== undefined) updateData.title = item.title;
			if (item.url !== undefined) updateData.url = item.url;
			if (item.isActive !== undefined) updateData.isActive = item.isActive;
			if (item.startDate !== undefined)
				updateData.startDate = item.startDate ? new Date(item.startDate) : null;
			if (item.endDate !== undefined)
				updateData.endDate = item.endDate ? new Date(item.endDate) : null;

			await db
				.update(linkItems)
				.set(updateData)
				.where(and(eq(linkItems.id, item.id), eq(linkItems.profileId, profile.id)));
		}

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
