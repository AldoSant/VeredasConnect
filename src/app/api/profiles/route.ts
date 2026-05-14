import { desc, eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export async function GET() {
	try {
		const scope = await getSessionScope();
		const filter = await getHierarchyFilter(profiles, scope);

		const userProfiles = await db.query.profiles.findMany({
			where: filter,
			orderBy: [desc(profiles.createdAt)],
		});

		return NextResponse.json({ 
			profiles: userProfiles,
			scope: {
				role: scope.role,
				organizationId: scope.organizationId,
				teamId: scope.teamId
			}
		});
	} catch (error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
