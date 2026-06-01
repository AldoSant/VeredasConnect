import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { buildLinkClickedEvent } from "@/lib/automation-events";
import { db } from "@/lib/db";
import { clickEvents, linkItems, profiles } from "@/lib/db/schema";
import { appPath } from "@/lib/paths";
import { buildVisitorContext } from "@/lib/visitor-context";
import { dispatchWebhookEvent } from "@/lib/webhook-dispatcher";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	try {
		// 1. Fetch the link item to get the target URL
		const link = await db.query.linkItems.findFirst({
			where: eq(linkItems.id, id),
		});

		if (!link?.url) {
			return NextResponse.redirect(new URL("/", request.url));
		}

		// Parse User Admin and Referrer
		const userAgent = request.headers.get("user-agent") || "";
		const referer = request.headers.get("referer") || "Direct";
		const parser = new UAParser(userAgent);
		const device = parser.getDevice();
		const browser = parser.getBrowser();
		const os = parser.getOS();

		const deviceType = device.type || "desktop"; // If no type, assume desktop

		// 2. Record the click event
		await db.insert(clickEvents).values({
			linkItemId: id,
			clickedAt: Date.now(),
			deviceType,
			browser: browser.name || "Unknown",
			os: os.name || "Unknown",
			referrer: referer,
		});

		const profile = await db.query.profiles.findFirst({
			where: eq(profiles.id, link.profileId),
		});
		if (profile?.webhookUrl) {
			const payload = buildLinkClickedEvent({
				profile,
				link: { id: link.id, title: link.title, url: link.url },
				visitor: buildVisitorContext(request),
				publicUrl: `${request.nextUrl.origin}${appPath(`/${profile.slug}`)}`,
			});
			const delivery = await dispatchWebhookEvent({ url: profile.webhookUrl, payload });
			if (!delivery.delivered) {
				console.warn("Link webhook delivery failed", {
					linkId: link.id,
					status: delivery.status,
					error: delivery.error,
				});
			}
		}

		// 3. Redirect to the target URL
		// We use a 302 (Found) to ensure browsers don't cache the redirect and bypass tracking next time
		return NextResponse.redirect(new URL(link.url), 302);
	} catch (error) {
		console.error("Click tracking error:", error);
		return NextResponse.redirect(new URL("/", request.url));
	}
}
