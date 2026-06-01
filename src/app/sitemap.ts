import type { MetadataRoute } from "next";

const baseUrl = "https://veredasinc.com.br/connect";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	return [
		{
			url: baseUrl,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/signup`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/login`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.4,
		},
	];
}
