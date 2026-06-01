import type { MetadataRoute } from "next";

const baseUrl = "https://veredasinc.com.br";
const basePath = "/connect";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: [basePath, `${basePath}/`],
			disallow: [
				`${basePath}/api/`,
				`${basePath}/editor`,
				`${basePath}/analytics`,
				`${basePath}/settings`,
				`${basePath}/organization`,
				`${basePath}/team`,
			],
		},
		sitemap: `${baseUrl}${basePath}/sitemap.xml`,
	};
}
