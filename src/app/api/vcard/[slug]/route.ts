import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const { slug } = await params;

	try {
		const profile = await db.query.profiles.findFirst({
			where: eq(profiles.slug, slug),
		});

		if (!profile) {
			return new NextResponse("Profile not found", { status: 404 });
		}

		// Build vCard string
		const vcardLines = [
			"BEGIN:VCARD",
			"VERSION:3.0",
			`N:;${profile.displayName || profile.slug};;;`,
			`FN:${profile.displayName || profile.slug}`,
		];

		if (profile.jobTitle) {
			vcardLines.push(`TITLE:${profile.jobTitle}`);
		}
		
		if (profile.company) {
			vcardLines.push(`ORG:${profile.company}`);
		}

		if (profile.phone) {
			vcardLines.push(`TEL;TYPE=CELL,VOICE:${profile.phone}`);
		}
		
		if (profile.whatsapp) {
			vcardLines.push(`TEL;TYPE=WORK,VOICE:${profile.whatsapp}`);
		}

		if (profile.avatarUrl) {
			vcardLines.push(`PHOTO;VALUE=URI:${profile.avatarUrl}`);
		}

		// Add profile link as the main website
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
		vcardLines.push(`URL:${appUrl}/${profile.slug}`);

		if (profile.bio) {
			// Escape newlines for vCard note
			const note = profile.bio.replace(/\n/g, "\\n");
			vcardLines.push(`NOTE:${note}`);
		}

		vcardLines.push("END:VCARD");

		const vcard = vcardLines.join("\n");

		// Return as a downloadable .vcf file
		return new NextResponse(vcard, {
			headers: {
				"Content-Type": "text/vcard",
				"Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
			},
		});
	} catch (error) {
		console.error("Error generating vCard:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}
