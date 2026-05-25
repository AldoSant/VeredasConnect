import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { nfcCards } from "@/lib/db/schema";

const updateCardSchema = z.object({
	label: z.string().min(1).max(50).optional(),
	profileId: z.string().nullable().optional(),
	isActive: z.boolean().optional(),
});

// PUT: update card (relink profile, rename, pause)
export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ cardId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const { cardId } = await params;
	const body = await request.json();
	const result = updateCardSchema.safeParse(body);
	if (!result.success) {
		return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
	}

	// Ensure card belongs to user
	const existing = await db.query.nfcCards.findFirst({
		where: eq(nfcCards.id, cardId),
	});
	if (!existing || existing.userId !== user.id) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	const [updated] = await db
		.update(nfcCards)
		.set({
			...(result.data.label !== undefined && { label: result.data.label }),
			...(result.data.profileId !== undefined && { profileId: result.data.profileId }),
			...(result.data.isActive !== undefined && { isActive: result.data.isActive }),
			updatedAt: new Date(),
		})
		.where(eq(nfcCards.id, cardId))
		.returning();

	return NextResponse.json({ card: updated });
}

// DELETE: remove a card
export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ cardId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const { cardId } = await params;

	const existing = await db.query.nfcCards.findFirst({
		where: eq(nfcCards.id, cardId),
	});
	if (!existing || existing.userId !== user.id) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	await db.delete(nfcCards).where(eq(nfcCards.id, cardId));
	return NextResponse.json({ success: true });
}
