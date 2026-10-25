import { expect, test } from "./csp.ts";

test("preset tip and split between people", async ({ page }) => {
	await page.goto("/");
	await page.locator("#bill").fill("100");
	await page.locator(".seg button", { hasText: "20%" }).click();
	await expect(page.locator("#tip")).toContainText(/20\.00/);
	await expect(page.locator("#total")).toContainText(/120\.00/);
	await page.locator("#people-plus").click();
	await page.locator("#people-plus").click();
	await expect(page.locator("#people")).toHaveText("3");
	await expect(page.locator("#per-person")).toContainText(/40\.00/);
});

test("custom tip percentage", async ({ page }) => {
	await page.goto("/");
	await page.locator(".seg button", { hasText: "Custom" }).click();
	await expect(page.locator("#custom-tip")).toBeVisible();
	await page.locator("#bill").fill("50");
	await page.locator("#custom-tip").fill("7.5");
	await expect(page.locator("#tip")).toContainText(/3\.75/);
	await expect(page.locator("#total")).toContainText(/53\.75/);
});

test("per person rounds up so the total is covered", async ({ page }) => {
	await page.goto("/");
	await page.locator(".seg button", { hasText: "Custom" }).click();
	await page.locator("#bill").fill("10");
	await page.locator("#custom-tip").fill("20.5");
	// tip $2.05, total $12.05, between 3 people -> ceil(1205/3) = $4.02
	await page.locator("#people-plus").click();
	await page.locator("#people-plus").click();
	await expect(page.locator("#per-person")).toContainText(/4\.02/);
});

test("empty bill shows dashes", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("#tip")).toHaveText("—");
	await expect(page.locator("#total")).toHaveText("—");
	await expect(page.locator("#per-person")).toHaveText("—");
});
