import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

const webhookSchema = z.object({
	webhookUrl: z.string().url("Must be a valid URL").or(z.literal("")),
});

// GET: fetch webhook URL
export async function GET() {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.userId, user.id),
	});

	return NextResponse.json({ webhookUrl: profile?.webhookUrl ?? "" });
}

// PUT: update webhook URL
export async function PUT(request: NextRequest) {
	const { error } = await getAuthUser();
	if (error) return error;

	const body = await request.json();
	const result = webhookSchema.safeParse(body);
	if (!result.success) {
		return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
	}

	return NextResponse.json({
		success: true,
		message: "Webhook saved (requires schema field to persist). No-op placeholder.",
	});
}
