import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Call this in API route handlers to get the authenticated user.
 * Returns the user with a guaranteed non-null id, or a 401 NextResponse.
 */
export async function getAuthUser() {
	const session = await auth();
	if (!session?.user?.id) {
		return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
	}
	return { user: { ...session.user, id: session.user.id as string }, error: null };
}
