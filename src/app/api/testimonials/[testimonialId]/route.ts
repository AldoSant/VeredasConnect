import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { profiles, testimonials } from "@/lib/db/schema";

const updateTestimonialSchema = z.object({
	authorName: z.string().min(2).max(80).optional(),
	authorTitle: z.string().max(80).optional(),
	content: z.string().min(10).max(500).optional(),
	rating: z.number().int().min(1).max(5).optional(),
	isVisible: z.boolean().optional(),
	sortOrder: z.number().int().optional(),
});

async function getTestimonialAndVerify(testimonialId: string, userId: string) {
	const testimonial = await db.query.testimonials.findFirst({
		where: eq(testimonials.id, testimonialId),
	});
	if (!testimonial) return null;

	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.id, testimonial.profileId),
	});
	if (!profile || profile.userId !== userId) return null;

	return testimonial;
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ testimonialId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { testimonialId } = await params;

	const t = await getTestimonialAndVerify(testimonialId, user.id);
	if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });

	const body = await request.json();
	const result = updateTestimonialSchema.safeParse(body);
	if (!result.success) {
		return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
	}

	const [updated] = await db
		.update(testimonials)
		.set({ ...result.data })
		.where(eq(testimonials.id, t.id))
		.returning();

	return NextResponse.json({ testimonial: updated });
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ testimonialId: string }> },
) {
	const { user, error } = await getAuthUser();
	if (error) return error;
	const { testimonialId } = await params;

	const t = await getTestimonialAndVerify(testimonialId, user.id);
	if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });

	await db.delete(testimonials).where(eq(testimonials.id, t.id));
	return NextResponse.json({ success: true });
}
