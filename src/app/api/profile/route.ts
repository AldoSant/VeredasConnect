import { asc, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { linkItems, profiles } from "@/lib/db/schema";
import { apiRateLimiter } from "@/lib/rate-limit";
import { profileSchema, slugSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = apiRateLimiter.check(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const scope = await getSessionScope();
		const profileId = request.nextUrl.searchParams.get("id");

		const profile = await db.query.profiles.findFirst({
			where: profileId ? eq(profiles.id, profileId) : eq(profiles.userId, scope.id),
		});

		if (!profile) {
			return NextResponse.json({ profile: null, links: [] });
		}

		// Validation of Hierarchy Access
		const isOwner = profile.userId === scope.id;
		const isAdminOfOrg = scope.role === "ADMIN" && scope.organizationId === profile.organizationId;
		const isSupervisorOfTeam = scope.role === "SUPERVISOR" && scope.teamId === profile.teamId;

		if (!isOwner && !isAdminOfOrg && !isSupervisorOfTeam) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const links = await db.query.linkItems.findMany({
			where: eq(linkItems.profileId, profile.id),
			orderBy: [asc(linkItems.sortOrder)],
		});

		return NextResponse.json({ profile, links });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

export async function POST(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = apiRateLimiter.check(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const scope = await getSessionScope();
		const body = await request.json();
		const slugResult = slugSchema.safeParse(body.slug);

		if (!slugResult.success) {
			return NextResponse.json({ error: slugResult.error.issues[0]?.message }, { status: 400 });
		}

		// Check slug uniqueness
		const slugTaken = await db.query.profiles.findFirst({
			where: eq(profiles.slug, body.slug),
		});
		if (slugTaken) {
			return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
		}

		const [profile] = await db
			.insert(profiles)
			.values({
				userId: scope.id,
				slug: body.slug,
				displayName: body.displayName || "",
				organizationId: scope.organizationId,
				teamId: scope.teamId,
			})
			.returning();

		return NextResponse.json({ profile }, { status: 201 });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}

export async function PUT(request: NextRequest) {
	const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
	const { success } = apiRateLimiter.check(ip);
	if (!success) {
		return NextResponse.json({ error: "Too many requests" }, { status: 429 });
	}

	try {
		const scope = await getSessionScope();
		const body = await request.json();
		const result = profileSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json({ error: result.error.issues[0]?.message }, { status: 400 });
		}

		// Fetch existing profile to check permission
		const existingProfile = await db.query.profiles.findFirst({
			where: body.id ? eq(profiles.id, body.id) : eq(profiles.userId, scope.id),
		});

		if (!existingProfile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		// Check hierarchy permission
		const isOwner = existingProfile.userId === scope.id;
		const isAdminOfOrg =
			scope.role === "ADMIN" && scope.organizationId === existingProfile.organizationId;
		const isSupervisorOfTeam =
			scope.role === "SUPERVISOR" && scope.teamId === existingProfile.teamId;

		if (!isOwner && !isAdminOfOrg && !isSupervisorOfTeam) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const [updated] = await db
			.update(profiles)
			.set({
				displayName: result.data.displayName,
				bio: result.data.bio,
				avatarUrl: result.data.avatarUrl,
				theme: result.data.theme,
				jobTitle: result.data.jobTitle || "",
				company: result.data.company || "",
				phone: result.data.phone || "",
				whatsapp: result.data.whatsapp || "",
				leadFormActive: result.data.leadFormActive ?? false,
				leadFormTitle: result.data.leadFormTitle || "Inscreva-se ou deixe sua mensagem",
				webhookUrl: result.data.webhookUrl || "",
				updatedAt: Date.now(),
			})
			.where(eq(profiles.id, existingProfile.id))
			.returning();

		return NextResponse.json({ profile: updated });
	} catch (_error) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
