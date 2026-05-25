import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { linkItems, profiles } from "@/lib/db/schema";
import { apiRateLimiter } from "@/lib/rate-limit";

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = apiRateLimiter.check(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const scope = await getSessionScope();
		const { id } = await params;

		// Fetch the link and its associated profile
		const link = await db.query.linkItems.findFirst({
			where: eq(linkItems.id, id),
		});

		if (!link) {
			return NextResponse.json({ error: "Link not found" }, { status: 404 });
		}

		const profile = await db.query.profiles.findFirst({
			where: eq(profiles.id, link.profileId),
		});

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		// Validation of Hierarchy Access
		const isOwner = profile.userId === scope.id;
		const isAdminOfOrg = scope.role === "ADMIN" && scope.organizationId === profile.organizationId;
		const isSupervisorOfTeam = scope.role === "SUPERVISOR" && scope.teamId === profile.teamId;

		if (!isOwner && !isAdminOfOrg && !isSupervisorOfTeam) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		await db.delete(linkItems).where(eq(linkItems.id, link.id));

		return NextResponse.json({ success: true });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
