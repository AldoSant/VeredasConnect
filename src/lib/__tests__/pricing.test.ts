import { describe, expect, it } from "vitest";
import { pricingPlans } from "@/lib/pricing";

describe("pricingPlans", () => {
	it("defines Starter, Pro and Equipe plans", () => {
		expect(pricingPlans.map((plan) => plan.name)).toEqual(["Starter", "Pro", "Equipe"]);
	});

	it("highlights only the Pro plan as the main commercial offer", () => {
		expect(pricingPlans.filter((plan) => plan.highlighted).map((plan) => plan.name)).toEqual([
			"Pro",
		]);
	});

	it("keeps each plan commercially usable", () => {
		for (const plan of pricingPlans) {
			expect(plan.price).toMatch(/^R\$/);
			expect(plan.cta.length).toBeGreaterThan(3);
			expect(plan.features.length).toBeGreaterThanOrEqual(4);
		}
	});
});
