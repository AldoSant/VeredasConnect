import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../auth/password";

describe("password hashing", () => {
	it("hashes and verifies a password without storing the plain text", async () => {
		const password = "correct horse battery staple";

		const hash = await hashPassword(password);

		expect(hash).not.toContain(password);
		expect(await verifyPassword(password, hash)).toBe(true);
		expect(await verifyPassword("wrong password", hash)).toBe(false);
	});

	it("rejects missing or malformed hashes", async () => {
		expect(await verifyPassword("password", null)).toBe(false);
		expect(await verifyPassword("password", "not-a-valid-hash")).toBe(false);
		expect(await verifyPassword("password", "scrypt$salt$zz")).toBe(false);
		expect(await verifyPassword("password", "scrypt$salt$abc123")).toBe(false);
	});
});
