import { describe, expect, it } from "vitest";
import { automationRecipes, supportedAutomationEvents } from "@/lib/automation-recipes";

const vendorNames = [
	"telegram",
	"google",
	"sheets",
	"odoo",
	"zapier",
	"make",
	"hubspot",
	"salesforce",
];

describe("automationRecipes", () => {
	it("uses unique stable ids", () => {
		const ids = automationRecipes.map((recipe) => recipe.id);

		expect(new Set(ids).size).toBe(ids.length);
	});

	it("stays vendor-neutral in market-facing labels", () => {
		const marketText = automationRecipes
			.flatMap((recipe) => [
				recipe.title,
				recipe.summary,
				recipe.destinationCategory,
				...recipe.outcomes,
			])
			.join(" ")
			.toLowerCase();

		for (const vendor of vendorNames) {
			expect(marketText).not.toContain(vendor);
		}
	});

	it("maps every recipe trigger to a supported Veredas event", () => {
		for (const recipe of automationRecipes) {
			for (const event of recipe.events) {
				expect(supportedAutomationEvents).toContain(event);
			}
		}
	});

	it("covers the standard commercial automation lifecycle", () => {
		const stages = new Set(automationRecipes.map((recipe) => recipe.lifecycleStage));

		expect(stages).toEqual(
			new Set(["capture", "qualify", "route", "follow-up", "sync", "score", "report"]),
		);
	});
});
