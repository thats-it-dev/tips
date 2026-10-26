import { LitElement, html, css, nothing } from "https://kit.thatsit.app/lit.js";
import { sharedStyles } from "https://kit.thatsit.app/kit.js";
import { PRESET_TIPS, clampPeople, formatMoney, parseAmount, parsePercent, perPersonCents, perPersonRoundedUpCents, tipCents } from "./tips-math.ts";

export class AppMain extends LitElement {
	static properties = {
		bill: { state: true },
		tipChoice: { state: true },
		customTip: { state: true },
		people: { state: true },
		roundUp: { state: true },
	};
	// Layout only here: no colors, fonts or border-radius.
	static styles = [
		sharedStyles,
		css`
			main { display: grid; gap: 14px; padding: 18px; max-width: 40rem; margin: 0 auto; }
			.row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
			.results { display: grid; gap: 10px; }
			.result { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
			.result output { font-variant-numeric: tabular-nums; }
			.people-count { min-width: 2ch; text-align: center; }
			.toggle { display: flex; align-items: center; gap: 8px; }
		`,
	];

	bill = "";
	tipChoice = "20";
	customTip = "";
	people = 1;
	roundUp = false;

	private setPeople(delta: number) {
		this.people = clampPeople(this.people + delta);
	}

	render() {
		const billCents = parseAmount(this.bill);
		const percent = this.tipChoice === "custom" ? parsePercent(this.customTip) : Number(this.tipChoice);
		const ready = billCents !== null && percent !== null;
		let tip = 0;
		let total = 0;
		let perPerson = 0;
		if (ready) {
			const baseTip = tipCents(billCents!, percent!);
			if (this.roundUp) {
				// Round the per-person share up to a whole dollar; the tip absorbs the difference.
				perPerson = perPersonRoundedUpCents(billCents! + baseTip, this.people);
				total = perPerson * this.people;
				tip = total - billCents!;
			} else {
				tip = baseTip;
				total = billCents! + tip;
				perPerson = perPersonCents(total, this.people);
			}
		}
		const show = ready ? formatMoney : () => "—";

		return html`
			<main>
				<h1>${__APP_TITLE__}</h1>
				<label>
					<span class="label">bill amount</span>
					<input id="bill" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" .value=${this.bill}
						@input=${(e: InputEvent) => (this.bill = (e.target as HTMLInputElement).value)} />
				</label>
				<div class="seg" role="group" aria-label="Tip percentage">
					${PRESET_TIPS.map(
						(p) => html`<button
							class=${this.tipChoice === String(p) ? "on" : nothing}
							@click=${() => (this.tipChoice = String(p))}
						>${p}%</button>`,
					)}
					<button class=${this.tipChoice === "custom" ? "on" : nothing} @click=${() => (this.tipChoice = "custom")}>Custom</button>
				</div>
				${this.tipChoice === "custom"
					? html`<label>
							<span class="label">custom tip %</span>
							<input id="custom-tip" type="text" inputmode="decimal" autocomplete="off" placeholder="18" .value=${this.customTip}
								@input=${(e: InputEvent) => (this.customTip = (e.target as HTMLInputElement).value)} />
						</label>`
					: nothing}
				<div class="row">
					<span class="label">split between</span>
					<button id="people-minus" class="btn ghost" aria-label="Fewer people" @click=${() => this.setPeople(-1)}>−</button>
					<span id="people" class="people-count">${this.people}</span>
					<button id="people-plus" class="btn ghost" aria-label="More people" @click=${() => this.setPeople(1)}>+</button>
				</div>
				<label class="toggle">
					<input id="round-up" type="checkbox" .checked=${this.roundUp}
						@change=${(e: Event) => (this.roundUp = (e.target as HTMLInputElement).checked)} />
					<span>Round up per person to a whole dollar</span>
				</label>
				<section class="results">
					<p class="result"><span class="label">tip</span> <output id="tip">${show(tip)}</output></p>
					<p class="result"><span class="label">total</span> <output id="total">${show(total)}</output></p>
					<p class="result">
						<span class="label">per person</span> <output id="per-person">${show(perPerson)}</output>
					</p>
				</section>
			</main>
			<tk-toasts></tk-toasts>
		`;
	}
}
customElements.define("app-main", AppMain);
