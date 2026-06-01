import { describe, expect, it } from "vitest";
import { validateAutomationUrl } from "@/lib/automation-url";

describe("automation URL validation", () => {
	it("returns friendly messages for missing or invalid automation addresses", () => {
		expect(validateAutomationUrl(" ")).toEqual({
			ok: false,
			error: "Configure o endereço da automação antes de testar.",
		});
		expect(validateAutomationUrl("not-a-url")).toEqual({
			ok: false,
			error: "O endereço informado não parece válido.",
		});
		expect(validateAutomationUrl("ftp://example.com/hook")).toEqual({
			ok: false,
			error: "Use um endereço começando com http:// ou https://.",
		});
	});

	it("accepts http and https URLs", () => {
		expect(validateAutomationUrl("https://example.com/hook")).toEqual({ ok: true });
		expect(validateAutomationUrl("http://localhost:3001/hook")).toEqual({ ok: true });
	});
});
