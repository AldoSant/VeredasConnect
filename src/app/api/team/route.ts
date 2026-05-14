import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { leads, profiles, teams, users } from "@/lib/db/schema";

export async function GET() {
	try {
		const scope = await getSessionScope();

		if (scope.role !== "SUPERVISOR" && scope.role !== "ADMIN") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const teamId = scope.teamId;
		if (!teamId && scope.role === "SUPERVISOR") {
			return NextResponse.json({ error: "No team assigned" }, { status: 400 });
		}

		// Se for ADMIN sem teamId, ele precisa passar o teamId via query param (opcional para o futuro)
		// Por enquanto, focamos no supervisor vendo seu próprio time.

		const team = await db.query.teams.findFirst({
			where: eq(teams.id, teamId!),
			with: {
				members: true,
			},
		});

		if (!team) {
			return NextResponse.json({ error: "Team not found" }, { status: 404 });
		}

		// Agregados do Time
		const [leadsCount] = await db
			.select({ value: count() })
			.from(leads)
			.where(eq(leads.teamId, teamId!));

		const [profilesCount] = await db
			.select({ value: count() })
			.from(profiles)
			.where(eq(profiles.teamId, teamId!));

		// Detalhes dos Membros
		const membersPerformance = await Promise.all(
			team.members.map(async (member) => {
				const [mProfiles] = await db
					.select({ value: count() })
					.from(profiles)
					.where(eq(profiles.userId, member.id));
				
				const [mLeads] = await db
					.select({ value: count() })
					.from(leads)
					.innerJoin(profiles, eq(leads.profileId, profiles.id))
					.where(eq(profiles.userId, member.id));

				return {
					id: member.id,
					name: member.name,
					email: member.email,
					profilesCount: mProfiles.value,
					leadsCount: mLeads.value,
				};
			})
		);

		return NextResponse.json({
			teamName: team.name,
			stats: {
				totalLeads: leadsCount.value,
				totalProfiles: profilesCount.value,
				memberCount: team.members.length,
			},
			members: membersPerformance,
		});
	} catch (error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
