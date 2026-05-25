import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { profiles, testimonials } from "@/lib/db/schema";

const testimonialSchema = z.object({
	authorName: z.string().min(2).max(80),
	authorTitle: z.string().max(80).optional(),
	authorAvatar: z.string().url().or(z.literal("")).optional(),
	content: z.string().min(10).max(500),
	rating: z.number().int().min(1).max(5).optional(),
	isVisible: z.boolean().optional(),
	sortOrder: z.number().int().optional(),
});

// GET: list all testimonials for user's profile
export async function GET(request: NextRequest) {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const profileId = request.nextUrl.searchParams.get("id");

	const profile = await db.query.profiles.findFirst({
		where: profileId ? eq(profiles.id, profileId) : eq(profiles.userId, user.id),
	});

	if (!profile) return NextResponse.json({ testimonials: [] });

	// Verify ownership
	if (profile.userId !== user.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
	}

	const items = await db.query.testimonials.findMany({
		where: eq(testimonials.profileId, profile.id),
		orderBy: (t, { asc }) => [asc(t.sortOrder)],
	});

	return NextResponse.json({ testimonials: items });
}

// POST: create new testimonial
export async function POST(request: NextRequest) {
	const { user, error } = await getAuthUser();
	if (error) return error;

	const body = await request.json();
	const profileId = body.profileId;

	const profile = await db.query.profiles.findFirst({
		where: profileId ? eq(profiles.id, profileId) : eq(profiles.userId, user.id),
	});

	if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

	// Verify ownership
	if (profile.userId !== user.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
	}

	const result = testimonialSchema.safeParse(body);
	if (!result.success) {
		return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
	}

	const [item] = await db
		.insert(testimonials)
		.values({
			profileId: profile.id,
			authorName: result.data.authorName,
			authorTitle: result.data.authorTitle ?? "",
			authorAvatar: result.data.authorAvatar ?? "",
			content: result.data.content,
			rating: result.data.rating ?? 5,
			isVisible: result.data.isVisible ?? true,
			sortOrder: result.data.sortOrder ?? 0,
		})
		.returning();

	return NextResponse.json({ testimonial: item }, { status: 201 });
}
