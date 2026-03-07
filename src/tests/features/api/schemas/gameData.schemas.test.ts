import { describe, it, expect } from "vitest";
import {
	BuildingSchema,
	ExchangeSchema,
	MaterialSchema,
	PlanetSchema,
	RecipeSchema,
} from "@/features/api/schemas/gameData.schemas";

// test data
import recipes from "@/tests/test_data/api_data_recipes.json";
import buildings from "@/tests/test_data/api_data_buildings.json";
import materials from "@/tests/test_data/api_data_materials.json";
import exchanges from "@/tests/test_data/api_data_exchanges.json";
import planets from "@/tests/test_data/api_data_planets.json";

describe("RecipeSchema validation", () => {
	recipes.forEach((recipe: any) => {
		it(`Validate recipe ${recipe.recipe_id}`, () => {
			const result = RecipeSchema.safeParse(recipe);
			expect(result.success).toBe(true);
			if (!result.success) {
				console.error(
					`Validation failed for recipe: ${recipe.recipe_id}`,
					result.error.errors
				);
			}
		});
	});
});

describe("BuildingSchema validation", () => {
	buildings.forEach((building: any) => {
		it(`Validate building ${building.building_ticker}`, () => {
			const result = BuildingSchema.safeParse(building);
			expect(result.success).toBe(true);
			if (!result.success) {
				console.error(
					`Validation failed for building: ${building.building_ticker}`,
					result.error.errors
				);
			}
		});
	});
});

describe("MaterialSchema validation", () => {
	materials.forEach((material: any) => {
		it(`Validate material ${material.ticker}`, () => {
			const result = MaterialSchema.safeParse(material);
			expect(result.success).toBe(true);
			if (!result.success) {
				console.error(
					`Validation failed for material: ${material.ticker}`,
					result.error.errors
				);
			}
		});
	});
});

describe("ExchangeSchema validation", () => {
	exchanges.forEach((exchange: any) => {
		it(`Validate exchange ${exchange.TickerId}`, () => {
			const result = ExchangeSchema.safeParse(exchange);
			expect(result.success).toBe(true);
			if (!result.success) {
				console.error(
					`Validation failed for exchange: ${exchange.TickerId}`,
					result.error.errors
				);
			}
		});
	});
});

describe("PlanetSchema validation", () => {
	planets.forEach((planet: any) => {
		it(`Validate planet ${planet.planet_natural_id}`, () => {
			const result = PlanetSchema.safeParse(planet);
			expect(result.success).toBe(true);
			if (!result.success) {
				console.error(
					`Validation failed for planet: ${planet.planet_natural_id}`,
					result.error.errors
				);
			}
		});
	});
});
