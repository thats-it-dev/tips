// Pure money math, all amounts in integer cents.

export const PRESET_TIPS = [15, 18, 20, 25];
export const MAX_PEOPLE = 99;

/** Parse a bill amount like "12.34" into cents. Returns null for empty or invalid input. */
export function parseAmount(text: string): number | null {
	const t = text.trim();
	if (t === "" || !/^\d*(?:\.\d*)?$/.test(t)) return null;
	const n = Number(t);
	if (!Number.isFinite(n)) return null;
	return Math.round(n * 100);
}

/** Parse a tip percentage ("18", "7.5"). Returns null for empty or invalid input. */
export function parsePercent(text: string): number | null {
	const t = text.trim();
	if (t === "" || !/^\d*(?:\.\d*)?$/.test(t)) return null;
	const n = Number(t);
	if (!Number.isFinite(n) || n < 0 || n > 100) return null;
	return n;
}

/** The tip for a bill at a percentage, rounded to the nearest cent. */
export function tipCents(bill: number, percent: number): number {
	return Math.round((bill * percent) / 100);
}

/** One person's share of a total, rounded up to the cent so the bill is always covered. */
export function perPersonCents(total: number, people: number): number {
	return Math.ceil(total / people);
}

/**
 * One person's share of a total rounded up to the next whole dollar (in cents).
 * Whole-dollar shares are kept as-is (no extra cent/dollar added).
 */
export function perPersonRoundedUpCents(total: number, people: number): number {
	return Math.ceil(total / (people * 100)) * 100;
}

export function clampPeople(n: number): number {
	if (!Number.isFinite(n) || n < 1) return 1;
	return Math.min(MAX_PEOPLE, Math.round(n));
}

let lazyMoneyFormatter: Intl.NumberFormat | undefined;

/** Format cents for display, e.g. 1250 -> "$12.50" in the browser's locale. */
export function formatMoney(cents: number): string {
	if (!lazyMoneyFormatter) {
		try {
			// Browsers resolve the region's default currency; some Node ICU builds require an explicit code.
			lazyMoneyFormatter = new Intl.NumberFormat(undefined, { style: "currency" });
		} catch {
			lazyMoneyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
		}
	}
	return lazyMoneyFormatter.format(cents / 100);
}
