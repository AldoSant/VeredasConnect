import { describe, expect, it } from "vitest";
import { buildPublicProfileMetadata } from "@/lib/public-profile-seo";

describe("buildPublicProfileMetadata", () => {
	it("builds localized SEO and Open Graph metadata for a complete public profile", () => {
		const metadata = buildPublicProfileMetadata({
			slug: "ana-veredas",
			displayName: "Ana Veredas",
			bio: "Consultora em negócios digitais.",
			avatarUrl: "https://cdn.example.com/ana.png",
			jobTitle: "Consultora",
			company: "Veredas",
		});

		expect(metadata.title).toBe("Ana Veredas (@ana-veredas) | Veredas Connect");
		expect(metadata.description).toBe("Consultora em negócios digitais.");
		expect(metadata.alternates).toEqual({ canonical: "/ana-veredas" });
		expect(metadata.openGraph).toMatchObject({
			title: "Ana Veredas (@ana-veredas) | Veredas Connect",
			description: "Consultora em negócios digitais.",
			type: "profile",
			url: "/ana-veredas",
			siteName: "Veredas Connect",
		});
		expect(metadata.openGraph?.images).toEqual([
			{
				url: "https://cdn.example.com/ana.png",
				alt: "Foto de perfil de Ana Veredas",
			},
		]);
		expect(metadata.twitter).toMatchObject({
			card: "summary_large_image",
			title: "Ana Veredas (@ana-veredas) | Veredas Connect",
			description: "Consultora em negócios digitais.",
		});
	});

	it("uses Portuguese fallbacks when public profile fields are sparse", () => {
		const metadata = buildPublicProfileMetadata({
			slug: "ana-veredas",
			displayName: "",
			bio: "",
			avatarUrl: "",
			jobTitle: "",
			company: "",
		});

		expect(metadata.title).toBe("@ana-veredas | Veredas Connect");
		expect(metadata.description).toBe(
			"Conheça o perfil público de @ana-veredas no Veredas Connect.",
		);
		expect(metadata.openGraph?.images).toBeUndefined();
	});
});
