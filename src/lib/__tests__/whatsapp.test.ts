import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from "../whatsapp";

describe("normalizeWhatsAppNumber", () => {
	it("keeps only digits and strips leading zeroes", () => {
		expect(normalizeWhatsAppNumber("(77) 9 9999-8888")).toBe("77999998888");
		expect(normalizeWhatsAppNumber("00 55 77 99999-8888")).toBe("5577999998888");
	});
});

describe("buildWhatsAppUrl", () => {
	it("builds a wa.me url with an encoded commercial message", () => {
		const url = buildWhatsAppUrl({
			number: "(77) 99999-8888",
			displayName: "Clínica Veredas",
			slug: "clinica-veredas",
		});

		expect(url).toContain("https://wa.me/77999998888?text=");
		expect(decodeURIComponent(url.split("text=")[1] ?? "")).toBe(
			"Olá, Clínica Veredas! Vim pelo Veredas Connect e gostaria de mais informações.",
		);
	});

	it("returns null when number has no usable digits", () => {
		expect(buildWhatsAppUrl({ number: "abc", displayName: "Teste", slug: "teste" })).toBeNull();
	});
});
