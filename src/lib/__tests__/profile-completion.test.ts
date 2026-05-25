import { describe, expect, it } from "vitest";
import { getProfileCompletion } from "@/lib/profile-completion";

const baseProfile = {
	displayName: "Ana Veredas",
	bio: "Consultora em negócios digitais.",
	avatarUrl: "https://example.com/avatar.png",
	phone: "",
	whatsapp: "+55 11 99999-0000",
	leadFormActive: false,
};

describe("getProfileCompletion", () => {
	it("marks a complete profile with at least three active links as complete", () => {
		const result = getProfileCompletion(baseProfile, [
			{ isActive: true },
			{ isActive: true },
			{ isActive: true },
		]);

		expect(result.isComplete).toBe(true);
		expect(result.completedCount).toBe(result.totalCount);
		expect(result.percentage).toBe(100);
		expect(result.items.every((item) => item.completed)).toBe(true);
	});

	it("requires name, bio, avatar, three active links and a contact channel", () => {
		const result = getProfileCompletion(
			{
				displayName: "",
				bio: "",
				avatarUrl: "",
				phone: "",
				whatsapp: "",
				leadFormActive: false,
			},
			[{ isActive: true }, { isActive: false }],
		);

		expect(result.isComplete).toBe(false);
		expect(result.percentage).toBe(0);
		expect(result.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: "display-name", completed: false }),
				expect.objectContaining({ id: "bio", completed: false }),
				expect.objectContaining({ id: "avatar", completed: false }),
				expect.objectContaining({ id: "links", completed: false }),
				expect.objectContaining({ id: "contact", completed: false }),
			]),
		);
	});

	it("accepts an active lead form as a conversion/contact step", () => {
		const result = getProfileCompletion(
			{ ...baseProfile, whatsapp: "", phone: "", leadFormActive: true },
			[{ isActive: true }, { isActive: true }, { isActive: true }],
		);

		expect(result.items.find((item) => item.id === "contact")?.completed).toBe(true);
		expect(result.isComplete).toBe(true);
	});
});
