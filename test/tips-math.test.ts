import { describe, expect, it } from "vitest";
import { clampPeople, parseAmount, parsePercent, perPersonCents, tipCents } from "../src/tips-math.ts";

describe("parseAmount", () => {
	it("parses plain decimals into cents", () => {
		expect(parseAmount("12.34")).toBe(1234);
		expect(parseAmount(" 7 ")).toBe(700);
		expect(parseAmount("0.5")).toBe(50);
		expect(parseAmount("120")).toBe(12000);
	});
	it("rejects empty and invalid input", () => {
		expect(parseAmount("")).toBeNull();
		expect(parseAmount("  ")).toBeNull();
		expect(parseAmount("abc")).toBeNull();
		expect(parseAmount("1.2.3")).toBeNull();
		expect(parseAmount("-5")).toBeNull();
		expect(parseAmount("$10")).toBeNull();
	});
});

describe("parsePercent", () => {
	it("parses percentages", () => {
		expect(parsePercent("18")).toBe(18);
		expect(parsePercent("7.5")).toBe(7.5);
		expect(parsePercent("0")).toBe(0);
	});
	it("rejects empty, invalid and out-of-range input", () => {
		expect(parsePercent("")).toBeNull();
		expect(parsePercent("x")).toBeNull();
		expect(parsePercent("101")).toBeNull();
		expect(parsePercent("-1")).toBeNull();
	});
});

describe("tipCents", () => {
	it("rounds to the nearest cent", () => {
		expect(tipCents(10000, 20)).toBe(2000);
		expect(tipCents(1000, 20.5)).toBe(205);
		expect(tipCents(999, 15)).toBe(150); // 149.85 -> 150
		expect(tipCents(1, 18)).toBe(0); // 0.18 -> 0
	});
});

describe("perPersonCents", () => {
	it("rounds up so the total is covered", () => {
		expect(perPersonCents(12000, 3)).toBe(4000);
		expect(perPersonCents(1205, 3)).toBe(402); // 401.67 -> 402
		expect(perPersonCents(1000, 1)).toBe(1000);
	});
});

describe("clampPeople", () => {
	it("keeps the count between 1 and 99", () => {
		expect(clampPeople(0)).toBe(1);
		expect(clampPeople(-5)).toBe(1);
		expect(clampPeople(NaN)).toBe(1);
		expect(clampPeople(150)).toBe(99);
		expect(clampPeople(4.4)).toBe(4);
	});
});
