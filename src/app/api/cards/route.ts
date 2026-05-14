import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { nfcCards } from "@/lib/db/schema";
import { z } from "zod";

const createCardSchema = z.object({
	label: z.string().min(1).max(50),
	profileId: z.string().optional(),
});

// GET: list all cards for this user
export async function GET() {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const cards = await db.query.nfcCards.findMany({
		where: eq(nfcCards.userId, user.id),
		with: { profile: true },
	});

	return NextResponse.json({ cards });
}

// POST: register a new card
export async function POST(request: NextRequest) {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const body = await request.json();
	const result = createCardSchema.safeParse(body);
	if (!result.success) {
		return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
	}

	const [card] = await db
		.insert(nfcCards)
		.values({
			userId: user.id,
			label: result.data.label,
			profileId: result.data.profileId || null,
		})
		.returning();

	return NextResponse.json({ card }, { status: 201 });
}
