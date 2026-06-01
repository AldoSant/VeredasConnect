import type { Metadata } from "next";

interface PublicProfileSeoInput {
	slug: string;
	displayName: string;
	bio: string;
	avatarUrl: string;
	jobTitle?: string;
	company?: string;
}

function compactText(value: string | null | undefined): string {
	return value?.trim() ?? "";
}

export function buildPublicProfileMetadata(profile: PublicProfileSeoInput): Metadata {
	const slug = compactText(profile.slug);
	const displayName = compactText(profile.displayName);
	const bio = compactText(profile.bio);
	const avatarUrl = compactText(profile.avatarUrl);
	const publicHandle = `@${slug}`;
	const encodedSlug = encodeURIComponent(slug).replace(/!/g, "%21");
	const publicPath = `/${encodedSlug}`;
	const title = displayName
		? `${displayName} (${publicHandle}) | Veredas Connect`
		: `${publicHandle} | Veredas Connect`;
	const description =
		bio || `Conheça o perfil público de ${displayName || publicHandle} no Veredas Connect.`;
	const imageAlt = `Foto de perfil de ${displayName || publicHandle}`;
	const images = avatarUrl ? [{ url: avatarUrl, alt: imageAlt }] : undefined;

	return {
		title,
		description,
		alternates: {
			canonical: publicPath,
		},
		openGraph: {
			title,
			description,
			type: "profile",
			url: publicPath,
			siteName: "Veredas Connect",
			images,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: avatarUrl ? [avatarUrl] : undefined,
		},
	};
}
