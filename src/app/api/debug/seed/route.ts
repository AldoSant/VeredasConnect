import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, organizations, profiles, teams, users } from "@/lib/db/schema";

export async function GET() {
	if (process.env.NODE_ENV === "production") {
		return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
	}

	try {
		// 1. Create Organization
		const orgId = crypto.randomUUID();
		const adminId = crypto.randomUUID();
		const supervisorId = crypto.randomUUID();
		const memberId = crypto.randomUUID();

		await db
			.insert(users)
			.values([
				{
					id: adminId,
					name: "Admin Empresa",
					email: "admin@empresa.com",
					role: "ADMIN",
					organizationId: orgId,
				},
				{
					id: supervisorId,
					name: "Supervisor Vendas",
					email: "supervisor@empresa.com",
					role: "SUPERVISOR",
					organizationId: orgId,
				},
				{
					id: memberId,
					name: "Vendedor Alpha",
					email: "vendedor@empresa.com",
					role: "MEMBER",
					organizationId: orgId,
				},
			])
			.onConflictDoNothing();

		await db
			.insert(organizations)
			.values({
				id: orgId,
				name: "Tech Solutions Corp",
				ownerId: adminId,
			})
			.onConflictDoNothing();

		// 2. Create Team
		const teamId = crypto.randomUUID();
		await db
			.insert(teams)
			.values({
				id: teamId,
				name: "Time de Vendas SP",
				organizationId: orgId,
				supervisorId: supervisorId,
			})
			.onConflictDoNothing();

		// 3. Link Supervisor and Member to Team
		await db.update(users).set({ teamId }).where(eq(users.id, supervisorId));
		await db.update(users).set({ teamId }).where(eq(users.id, memberId));

		// 4. Create Profile for Member
		const profileId = crypto.randomUUID();
		await db
			.insert(profiles)
			.values({
				id: profileId,
				userId: memberId,
				slug: "vendedor-alpha",
				displayName: "João Vendedor",
				jobTitle: "Executivo de Contas",
				company: "Tech Solutions Corp",
				organizationId: orgId,
				teamId: teamId,
			})
			.onConflictDoNothing();

		// 5. Create some Leads for this profile
		await db.insert(leads).values([
			{
				id: crypto.randomUUID(),
				profileId,
				name: "Interessado 1",
				email: "lead1@gmail.com",
				organizationId: orgId,
				teamId: teamId,
				status: "new",
			},
			{
				id: crypto.randomUUID(),
				profileId,
				name: "Interessado 2",
				email: "lead2@gmail.com",
				organizationId: orgId,
				teamId: teamId,
				status: "qualified",
			},
		]);

		return NextResponse.json({
			success: true,
			message: "Hierarquia institucional criada com sucesso",
			credentials: {
				admin: "admin@empresa.com",
				supervisor: "supervisor@empresa.com",
				member: "vendedor@empresa.com",
			},
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Failed to seed hierarchy" }, { status: 500 });
	}
}
