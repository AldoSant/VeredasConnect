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

	it("handles extremely long inputs gracefully without crashing or overflowing", () => {
		const longString = "A".repeat(500); // Test for buffer overflow/performance issue on string handling
		const metadata = buildPublicProfileMetadata({
			slug: longString.substring(0, 100),
			displayName: longString,
			bio: longString,
			avatarUrl: "https://cdn.example.com/test.png",
			jobTitle: "Tester",
			company: "StressTest Corp.",
		});

		// Check if the output fields are correctly generated (even if truncated internally)
		expect(metadata.title).toContain("Tester"); 
		expect(metadata.description).toBeDefined();
	});

	it("handles slugs with special characters by encoding them correctly", () => {
		const metadata = buildPublicProfileMetadata({ slug: "profile-with-&!@#$", displayName: "Test Profile" });
		// Expect the URL/canonical to reflect encoded characters or use a safe fallback pattern.
		expect(metadata.alternates?.canonical).toMatch(/profile-with-%26%21%40%23%24/);
	});
});