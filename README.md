# UN Women Iran-USA Regional Escalation Shock Dashboard

Static dashboard prototype for communicating the Iran-USA/regional escalation shock model outputs.

## Source

- Source workbook: `outputs/models/iran_us_shock/UN Women IRAN USA war shock - refreshed rankings 2026-06-02.xlsx`
- Dashboard data bundle: `dashboard/web/iran-us-shock/data/iran-us-shock-dashboard-data.js`
- Data builder: `analysis/scripts/build_iran_us_shock_dashboard_data.py`

## Local Preview

Run from the project root:

```powershell
python -m http.server 8766
```

Then open:

```text
http://localhost:8766/dashboard/web/iran-us-shock/
```

## Refresh

Regenerate the dashboard data bundle after refreshing the official workbook:

```powershell
python analysis/scripts/build_iran_us_shock_dashboard_data.py
```

## Method Boundary

The dashboard communicates a screening and prioritization model. The Shock Exposure Index uses expert-assigned composite-index weights guided by OECD/JRC composite-indicator practice. The weights are not IMF weights; IMF-style shock logic is used only to frame food, fuel, fertilizer and import-exposure pathways. IDMC/IOM displacement and public WFP food-security outcome layers are formally weighted in the refreshed score, but the model should not be used to claim causal impact on women or girls unless sex- and age-disaggregated outcome data become available and the causal-readiness checks support estimation.
