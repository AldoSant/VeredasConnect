import { eq, and } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const scope = await getSessionScope();
		const { userId } = await params;

		if (scope.role !== "ADMIN") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const body = await request.json();
		const { role, teamId } = body;

		// Verify target user belongs to the same org
		const targetUser = await db.query.users.findFirst({
			where: and(eq(users.id, userId), eq(users.organizationId, scope.organizationId!))
		});

		if (!targetUser) {
			return NextResponse.json({ error: "User not found in organization" }, { status: 404 });
		}

		await db.update(users)
			.set({
				role: role || targetUser.role,
				teamId: teamId === undefined ? targetUser.teamId : teamId,
			})
			.where(eq(users.id, userId));

		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
