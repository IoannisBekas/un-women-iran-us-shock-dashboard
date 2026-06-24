# UN Women Iran-USA Regional Escalation Shock Dashboard

Static analytical dashboard for communicating the Iran-USA/regional escalation shock model outputs.

## Publication Status

Public GitHub Pages deployment:
https://ioannisbekas.github.io/un-women-iran-us-shock-dashboard/

## Source

- Published dashboard dataset: `dashboard/web/iran-us-shock/data/iran-us-shock-dashboard-data.js`
- Data builder: `analysis/scripts/build_iran_us_shock_dashboard_data.py`
- Before/After module: uses documented WFP/HDX like-for-like food-price comparisons, readiness checks, IPC timing, country context and supplemental public-source coverage. The headline chart shows each country's highest positive matched same-month YoY food-price change in post-shock 2026 months, not negative or flat changes.
- Scenario controls group the analytical scenarios into a `Stress lens` selector and a three-option `Shock level` selector to keep the dashboard readable without dropping scenarios.
- Chart explanation update: every main visual now includes compact "Calculated / How to read / Uses fields" guidance. Composite visuals also include decomposition tables showing input score, weight or coefficient, contribution points and final score relationship. These are explanatory/proxy views; they do not change the official score weights.
- Communication-flow update: the Country Lens now shows score mechanics immediately after the selected-country profile/map, before the gender/displacement and price-evidence sections. Visible labels use "exposure" and "sensitivity" language where "risk" could be read as a forecast.

## Page Structure

- `index.html`: regional overview, headline before/after story, ranking, regional charts, and method boundary.
- `country.html`: country-specific explorer with region, landlocked/coastal, country, stress-lens and shock-level filters. The main view prioritizes the selected country; full evidence tables are collapsed behind disclosure panels.
- `methodology.html`: text-led methodology page covering analysis logic, calculations, public-source traceability, caveats and safe interpretation language.
- `dictionary.html`: plain-language definitions for terms, data sources and interpretation boundaries.
- The global header intentionally keeps only four page destinations: `Overview`, `Country Lens`, `Methodology`, and `Dictionary`. The before/after, ranking, scenario and data-readiness views remain as modules inside the overview or country pages.
- The overview page uses finding-led chart titles, direct value labels on headline bars, a top-10 before/after evidence table, and concise caveat/source notes. Keep full filtered evidence tables on `country.html`, but keep them collapsed by default so the selected-country story remains primary.

## Local Preview

Run from the project root:

```powershell
python -m http.server 8766
```

Then open:

```text
http://localhost:8766/dashboard/web/iran-us-shock/
http://localhost:8766/dashboard/web/iran-us-shock/country.html
http://localhost:8766/dashboard/web/iran-us-shock/methodology.html
http://localhost:8766/dashboard/web/iran-us-shock/dictionary.html
```

## Refresh

Regenerate the published dashboard dataset after refreshing the maintained analytical source:

```powershell
python analysis/scripts/build_iran_us_shock_dashboard_data.py
```

## Validation

Run the browser validation after dashboard UI or published-dataset changes:

```powershell
node analysis/scripts/validate_iran_us_shock_dashboard.mjs
```

The validation script sets the local session access flag before loading the page so it checks the actual dashboard, not the access gate.

In the Codex desktop runtime, set the bundled module path first if Playwright is not found:

```powershell
$env:NODE_PATH = "C:\Users\bekas\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules"
node analysis/scripts/validate_iran_us_shock_dashboard.mjs
```

## Method Boundary

The dashboard communicates a screening and prioritization model. The Shock Exposure Index uses documented analytical weights guided by OECD/JRC composite-indicator practice and checked through sensitivity testing. IMF-style shock logic is used only to frame food, fuel, fertilizer and import-exposure pathways; no external weight set is copied. IDMC/IOM displacement and public WFP food-security outcome layers are formally weighted in the current score, but the model should not be used to claim causal impact on women or girls unless sex- and age-disaggregated outcome data become available and the causal-readiness checks support estimation.
