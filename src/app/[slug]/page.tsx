import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PremiumTheme } from "@/components/themes/premium-theme";
import { db } from "@/lib/db";
import { linkItems, profiles, testimonials } from "@/lib/db/schema";
import { buildPublicProfileMetadata } from "@/lib/public-profile-seo";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.slug, slug),
	});

	if (!profile) {
		return { title: "Not Found" };
	}

	return buildPublicProfileMetadata(profile);
}

export default async function PublicProfilePage({ params }: PageProps) {
	const { slug } = await params;

	const profile = await db.query.profiles.findFirst({
		where: eq(profiles.slug, slug),
	});

	if (!profile) {
		notFound();
	}

	const links = await db.query.linkItems.findMany({
		where: eq(linkItems.profileId, profile.id),
		orderBy: [asc(linkItems.sortOrder)],
	});

	const allTestimonials = await db.query.testimonials.findMany({
		where: eq(testimonials.profileId, profile.id),
		orderBy: [asc(testimonials.sortOrder)],
	});

	const now = new Date();
	const activeLinks = links.filter((l) => {
		if (l.isActive === false) return false;
		if (l.startDate && now < new Date(l.startDate)) return false;
		if (l.endDate && now > new Date(l.endDate)) return false;
		return true;
	});

	const previewLinks = activeLinks.map((l) => ({
		id: l.id,
		type: l.type as "link" | "header" | "divider",
		title: l.title,
		url: l.url,
	}));

	const publicTestimonials = allTestimonials
		.filter((t) => t.isVisible)
		.map((t) => ({
			id: t.id,
			authorName: t.authorName,
			authorTitle: t.authorTitle,
			authorAvatar: t.authorAvatar,
			content: t.content,
			rating: t.rating,
		}));

	return (
		<main className="min-h-screen bg-black">
			<PremiumTheme
				slug={profile.slug}
				displayName={profile.displayName}
				bio={profile.bio}
				avatarUrl={profile.avatarUrl}
				jobTitle={profile.jobTitle}
				company={profile.company}
				phone={profile.phone}
				whatsapp={profile.whatsapp}
				leadFormActive={profile.leadFormActive}
				leadFormTitle={profile.leadFormTitle}
				testimonials={publicTestimonials}
				links={previewLinks}
				isPreview={false}
			/>
		</main>
	);
}
