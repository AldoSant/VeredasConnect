import { and, eq } from "drizzle-orm";
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
			with: {
				profile: true
			}
		});

		if (!link || !link.profile) {
			return NextResponse.json({ error: "Link or Profile not found" }, { status: 404 });
		}

		// Validation of Hierarchy Access
		const isOwner = (link.profile as any).userId === scope.id;
		const isAdminOfOrg = scope.role === "ADMIN" && scope.organizationId === link.profile.organizationId;
		const isSupervisorOfTeam = scope.role === "SUPERVISOR" && scope.teamId === link.profile.teamId;

		if (!isOwner && !isAdminOfOrg && !isSupervisorOfTeam) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		await db
			.delete(linkItems)
			.where(eq(linkItems.id, id));

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
