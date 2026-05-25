import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nfcCards, profiles } from "@/lib/db/schema";

/**
 * NFC Redirect Route: /n/[cardId]
 * This is the URL burned into each physical NFC chip.
 * It looks up the card → finds the linked profile → redirects to the public slug.
 * No need to ever re-burn the chip; just re-link the card in the dashboard.
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ cardId: string }> },
) {
	const { cardId } = await params;

	try {
		const card = await db.query.nfcCards.findFirst({
			where: eq(nfcCards.id, cardId),
		});

		// Card not found or paused → go to home
		if (!card || !card.isActive) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		// Card has no profile linked → go to home
		if (!card.profileId) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		const profile = await db.query.profiles.findFirst({
			where: eq(profiles.id, card.profileId),
		});

		if (!profile) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		// Redirect to the profile public page
		return NextResponse.redirect(new URL(`/${profile.slug}`, request.url), 302);
	} catch (error) {
		console.error("NFC redirect error:", error);
		return NextResponse.redirect(new URL("/", request.url));
	}
}
