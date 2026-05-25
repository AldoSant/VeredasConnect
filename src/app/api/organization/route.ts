import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { leads, organizations, profiles, users } from "@/lib/db/schema";

export async function GET() {
	try {
		const scope = await getSessionScope();

		if (scope.role !== "ADMIN") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const orgId = scope.organizationId;
		if (!orgId) {
			return NextResponse.json({ error: "No organization assigned" }, { status: 400 });
		}

		// 1. Get Organization details
		const org = await db.query.organizations.findFirst({
			where: eq(organizations.id, orgId),
			with: {
				teams: true,
			},
		});

		if (!org) return NextResponse.json({ error: "Org not found" }, { status: 404 });

		// 2. Get all Users in Org
		const orgUsers = await db.query.users.findMany({
			where: eq(users.organizationId, orgId),
		});

		// 3. Global Stats
		const [totalLeads] = await db
			.select({ value: count() })
			.from(leads)
			.where(eq(leads.organizationId, orgId));
		const [totalProfiles] = await db
			.select({ value: count() })
			.from(profiles)
			.where(eq(profiles.organizationId, orgId));

		return NextResponse.json({
			organization: {
				name: org.name,
				logoUrl: org.logoUrl,
			},
			stats: {
				totalUsers: orgUsers.length,
				totalTeams: org.teams.length,
				totalLeads: totalLeads.value,
				totalProfiles: totalProfiles.value,
			},
			teams: org.teams,
			users: orgUsers.map((u) => ({
				id: u.id,
				name: u.name,
				email: u.email,
				role: u.role,
				teamId: u.teamId,
			})),
		});
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
