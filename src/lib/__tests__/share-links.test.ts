import { describe, expect, it } from "vitest";
import { buildShareLinks } from "@/lib/share-links";

describe("buildShareLinks", () => {
	it("builds base-path aware public and vCard URLs for sharing", () => {
		const links = buildShareLinks("https://app.example.com", "ana-veredas");

		expect(links.publicPath).toBe("/connect/ana-veredas");
		expect(links.publicUrl).toBe("https://app.example.com/connect/ana-veredas");
		expect(links.vcardPath).toBe("/connect/api/vcard/ana-veredas");
		expect(links.vcardUrl).toBe("https://app.example.com/connect/api/vcard/ana-veredas");
	});

	it("encodes slugs safely inside generated URLs", () => {
		const links = buildShareLinks("https://app.example.com/", "ana veredas");

		expect(links.publicUrl).toBe("https://app.example.com/connect/ana%20veredas");
		expect(links.vcardUrl).toBe("https://app.example.com/connect/api/vcard/ana%20veredas");
	});
});
