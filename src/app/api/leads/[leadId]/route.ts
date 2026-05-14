import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { leads, profiles } from "@/lib/db/schema";
import { z } from "zod";

const updateLeadSchema = z.object({
	status: z.enum(["new", "contacted", "qualified", "closed"]).optional(),
	tags: z.string().max(200).optional(),
	notes: z.string().max(1000).optional(),
});

// GET: single lead
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ leadId: string }> }
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { leadId } = await params;

	const lead = await db.query.leads.findFirst({
		where: eq(leads.id, leadId),
		with: { profile: true },
	});

	if (!lead || lead.profile?.userId !== user.id) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	return NextResponse.json({ lead });
}

// PATCH: update CRM fields (status, tags, notes)
export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ leadId: string }> }
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { leadId } = await params;

	const lead = await db.query.leads.findFirst({
		where: eq(leads.id, leadId),
		with: { profile: true },
	});

	if (!lead || lead.profile?.userId !== user.id) {
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
		.where(eq(leads.id, leadId))
		.returning();

	return NextResponse.json({ lead: updated });
}

// DELETE: remove lead
export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ leadId: string }> }
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { leadId } = await params;

	const lead = await db.query.leads.findFirst({
		where: eq(leads.id, leadId),
		with: { profile: true },
	});

	if (!lead || lead.profile?.userId !== user.id) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	await db.delete(leads).where(eq(leads.id, leadId));
	return NextResponse.json({ success: true });
}
