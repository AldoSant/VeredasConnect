import { eq, desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { leads, profiles } from "@/lib/db/schema";
import { format } from "date-fns";

export async function GET(request: NextRequest) {
	try {
		const scope = await getSessionScope();
		const profileId = request.nextUrl.searchParams.get("id");

		let filter;
		let fileName = "leads-export";

		if (scope.role === "ADMIN" && scope.organizationId) {
			filter = eq(leads.organizationId, scope.organizationId);
			fileName = `leads-organizacao-${scope.organizationId}`;
		} else if (scope.role === "SUPERVISOR" && scope.teamId) {
			filter = eq(leads.teamId, scope.teamId);
			fileName = `leads-equipe-${scope.teamId}`;
		} else if (profileId) {
			const profile = await db.query.profiles.findFirst({
				where: eq(profiles.id, profileId),
			});
			if (!profile || profile.userId !== scope.id) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
			}
			filter = eq(leads.profileId, profileId);
			fileName = `leads-${profile.slug}`;
		} else {
			// Member exporting all their leads
			const userLeads = await db.select({ lead: leads })
				.from(leads)
				.innerJoin(profiles, eq(leads.profileId, profiles.id))
				.where(eq(profiles.userId, scope.id));
			
			return generateCsvResponse(userLeads.map(r => r.lead), "meus-leads");
		}

		const exportLeads = await db.query.leads.findMany({
			where: filter,
			orderBy: [desc(leads.createdAt)],
		});

		return generateCsvResponse(exportLeads, fileName);
	} catch (error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

function generateCsvResponse(data: any[], fileName: string) {
	const header = ["Data", "Nome", "Email", "Telefone", "Empresa", "Mensagem"].join(";");
	const rows = data.map((l) =>
		[
			format(new Date(l.createdAt), "dd/MM/yyyy HH:mm"),
			l.name,
			l.email,
			l.phone ?? "",
			l.company ?? "",
			(l.message ?? "").replace(/;/g, ",").replace(/\n/g, " "),
		]
			.map((v) => `"${v}"`)
			.join(";")
	);

	const csv = [header, ...rows].join("\n");

	return new NextResponse(csv, {
		headers: {
			"Content-Type": "text/csv; charset=utf-8",
			"Content-Disposition": `attachment; filename="${fileName}.csv"`,
		},
	});
}
