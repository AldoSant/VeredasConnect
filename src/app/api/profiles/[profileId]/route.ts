import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ profileId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const { profileId } = await params;

	// Verify ownership
	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.id, profileId),
	});

	if (!profile || profile.userId !== user.id) {
		return NextResponse.json({ error: "Profile not found or unauthorized" }, { status: 404 });
	}

	// Prevent deleting the last profile maybe? Or just allow it.
	// We'll allow it for now.
	await db.delete(profiles).where(eq(profiles.id, profileId));

	return NextResponse.json({ success: true });
}
