import { count, eq, sql, and, gte, desc } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getSessionScope } from "@/lib/auth/rbac";
import { db } from "@/lib/db";
import { clickEvents, linkItems, profiles } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
	try {
		const scope = await getSessionScope();
		const profileId = request.nextUrl.searchParams.get("id");

		// 1. Get the profile
		const profile = await db.query.profiles.findFirst({
			where: profileId 
				? eq(profiles.id, profileId) 
				: eq(profiles.userId, scope.id),
		});

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		// Validation of Hierarchy Access
		const isOwner = profile.userId === scope.id;
		const isAdminOfOrg = scope.role === "ADMIN" && scope.organizationId === profile.organizationId;
		const isSupervisorOfTeam = scope.role === "SUPERVISOR" && scope.teamId === profile.teamId;

		if (!isOwner && !isAdminOfOrg && !isSupervisorOfTeam) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		// 2. Get total clicks per link
		const linksCount = count(clickEvents.id).as('clicks_count');

		const linksWithClicks = await db
			.select({
				id: linkItems.id,
				title: linkItems.title,
				url: linkItems.url,
				type: linkItems.type,
				clicks: linksCount,
			})
			.from(linkItems)
			.leftJoin(clickEvents, eq(clickEvents.linkItemId, linkItems.id))
			.where(and(eq(linkItems.profileId, profile.id), eq(linkItems.type, "link")))
			.groupBy(linkItems.id)
			.orderBy(desc(linksCount));

		// 3. Get click trends (Daily aggregation)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const rawDateSql = sql`date(${clickEvents.clickedAt} / 1000, 'unixepoch')`;
		const dateAlias = rawDateSql.as('click_date');

		const trends = await db
			.select({
				date: dateAlias,
				count: count(clickEvents.id),
			})
			.from(clickEvents)
			.innerJoin(linkItems, eq(clickEvents.linkItemId, linkItems.id))
			.where(
				and(
					eq(linkItems.profileId, profile.id),
					gte(clickEvents.clickedAt, thirtyDaysAgo.getTime() as any)
				)
			)
			.groupBy(rawDateSql)
			.orderBy(rawDateSql);

		// 4. Get devices
		const devices = await db
			.select({
				name: clickEvents.deviceType,
				value: count(clickEvents.id),
			})
			.from(clickEvents)
			.innerJoin(linkItems, eq(clickEvents.linkItemId, linkItems.id))
			.where(eq(linkItems.profileId, profile.id))
			.groupBy(clickEvents.deviceType);

		// 5. Get browsers
		const browsers = await db
			.select({
				name: clickEvents.browser,
				value: count(clickEvents.id),
			})
			.from(clickEvents)
			.innerJoin(linkItems, eq(clickEvents.linkItemId, linkItems.id))
			.where(eq(linkItems.profileId, profile.id))
			.groupBy(clickEvents.browser);

		return NextResponse.json({
			totalClicks: linksWithClicks.reduce((acc, curr) => acc + (Number(curr.clicks) || 0), 0),
			links: linksWithClicks,
			trends: trends,
			devices: devices.map(d => ({ name: d.name || 'Unknown', value: d.value })),
			browsers: browsers.map(b => ({ name: b.name || 'Unknown', value: b.value })),
		});
	} catch (error) {
		console.error("Analytics API Error:", error);
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
}
