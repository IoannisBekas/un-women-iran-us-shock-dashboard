# UN Women Iran-USA Regional Escalation Shock Dashboard

Static analytical dashboard for communicating the Iran-USA/regional escalation shock model outputs.

## Publication Status

Public GitHub Pages deployment:
https://ioannisbekas.github.io/un-women-iran-us-shock-dashboard/

## Source

- Published dashboard dataset: `dashboard/web/iran-us-shock/data/iran-us-shock-dashboard-data.js`
- Data builder: `analysis/scripts/build_iran_us_shock_dashboard_data.py`
- Before/After module: uses documented WFP/HDX like-for-like food-price comparisons, readiness checks, IPC timing, country context and additional public-context coverage. The headline chart shows each country's highest positive matched same-month YoY food-price change in post-shock 2026 months, not negative or flat changes.
- Simplification update: the only composite score presented to users is the official Shock Exposure Index. Scenario, gender-proxy, supplemental and other secondary score views are retained only as internal workbook/model checks where needed.
- Explanation update: repeated per-chart "Calculated / How to read / Uses fields" boxes were removed to keep the dashboard cleaner. The visible decomposition table is limited to the official Shock Exposure Index; other context panels show raw or near-raw indicators with units and notes.
- Communication-flow update: the Country Lens now shows score mechanics immediately after the selected-country profile/map, then raw country evidence, gender/displacement indicators, price evidence and data-readiness sections.

## Page Structure

- `index.html`: regional overview, headline before/after story, official Shock Exposure Index ranking, regional chart, cross-country female labour indicator charts and all-country public displacement evidence.
- `country.html`: country-specific explorer with region, landlocked/coastal and country filters. The main view prioritizes the selected country; full evidence tables are collapsed behind disclosure panels.
- `methodology.html`: text-led methodology page covering analysis logic, calculations, public-source traceability, caveats and safe interpretation language.
- `dictionary.html`: plain-language definitions for terms, data sources and interpretation boundaries.
- The global header intentionally keeps only four page destinations: `Overview`, `Country Lens`, `Methodology`, and `Dictionary`. The before/after, ranking and data-readiness views remain as modules inside the overview or country pages.
- The overview page uses finding-led chart titles, direct value labels on headline bars, a top-10 before/after evidence table, cross-country raw female labour charts and concise caveat/source notes. Keep selected-country evidence and full filtered evidence tables on `country.html`, with full tables collapsed by default so the selected-country story remains primary.

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

The dashboard communicates a screening and prioritization model. The user-facing composite score is the official Shock Exposure Index. It uses documented analytical weights guided by OECD/JRC composite-indicator practice and checked through internal sensitivity testing. IMF-style shock logic is used only to frame food, fuel, fertilizer and import-exposure pathways; no external weight set is copied. IDMC/IOM displacement and public WFP food-security outcome layers are formally weighted in the current score, while dashboard context panels show the underlying raw evidence directly. The model should not be used to claim causal impact on women or girls unless sex- and age-disaggregated outcome data become available and the causal-readiness checks support estimation.
