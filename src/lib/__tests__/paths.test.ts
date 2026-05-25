import { describe, expect, it } from "vitest";
import { apiPath, appPath, safeInternalPath, stripAppBasePath } from "@/lib/paths";

describe("base path helpers", () => {
	it("prefixes app paths with the configured app base path", () => {
		expect(appPath("/editor")).toBe("/connect/editor");
		expect(appPath("n/card-1")).toBe("/connect/n/card-1");
	});

	it("prefixes API paths with the configured app base path", () => {
		expect(apiPath("/api/profile")).toBe("/connect/api/profile");
		expect(apiPath("api/profile")).toBe("/connect/api/profile");
		expect(apiPath(`/api/leads?id=${encodeURIComponent("perfil 1")}`)).toBe(
			"/connect/api/leads?id=perfil%201",
		);
	});

	it("strips the app base path from internal callback URLs", () => {
		expect(stripAppBasePath("/connect/editor")).toBe("/editor");
		expect(stripAppBasePath("/connect")).toBe("/");
		expect(stripAppBasePath("/editor")).toBe("/editor");
	});

	it("normalizes callback paths to safe internal routes", () => {
		expect(safeInternalPath("/connect/editor")).toBe("/editor");
		expect(safeInternalPath("/editor?tab=links")).toBe("/editor?tab=links");
		expect(safeInternalPath("editor")).toBe("/editor");
	});

	it("rejects external or protocol-relative callback paths", () => {
		expect(safeInternalPath("https://evil.example/phish")).toBe("/editor");
		expect(safeInternalPath("//evil.example/phish")).toBe("/editor");
		expect(safeInternalPath("javascript:alert(1)")).toBe("/editor");
		expect(safeInternalPath("\\\\evil.example\\phish")).toBe("/editor");
	});
});
