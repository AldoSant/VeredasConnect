import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { leads, profiles } from "@/lib/db/schema";

const updateLeadSchema = z.object({
	status: z.enum(["new", "contacted", "qualified", "closed"]).optional(),
	tags: z.string().max(200).optional(),
	notes: z.string().max(1000).optional(),
});

async function findLeadForUser(leadId: string, userId: string) {
	const lead = await db.query.leads.findFirst({
		where: eq(leads.id, leadId),
	});

	if (!lead) return null;

	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.id, lead.profileId),
	});

	if (!profile || profile.userId !== userId) return null;
	return lead;
}

// GET: single lead
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ leadId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { leadId } = await params;

	const lead = await findLeadForUser(leadId, user.id);
	if (!lead) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json({ lead });
}

// PATCH: update CRM fields (status, tags, notes)
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ leadId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { leadId } = await params;

	const lead = await findLeadForUser(leadId, user.id);
	if (!lead) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const body = await request.json();
	const result = updateLeadSchema.safeParse(body);
	if (!result.success) {
		return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
	}

	const [updated] = await db
		.update(leads)
		.set({
			...(result.data.status !== undefined && { status: result.data.status }),
			...(result.data.tags !== undefined && { tags: result.data.tags }),
			...(result.data.notes !== undefined && { notes: result.data.notes }),
		})
		.where(eq(leads.id, lead.id))
		.returning();

	return NextResponse.json({ lead: updated });
}

// DELETE: remove lead
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ leadId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { leadId } = await params;

	const lead = await findLeadForUser(leadId, user.id);
	if (!lead) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	await db.delete(leads).where(eq(leads.id, lead.id));
	return NextResponse.json({ success: true });
}
