const data = window.IRAN_US_SHOCK_DASHBOARD_DATA;

const COLORS = {
  navy: "#1f2326",
  blue: "#006b6f",
  red: "#e84a5f",
  teal: "#5c7f78",
  gold: "#c78a2c",
  grid: "#ddd8cf",
  muted: "#5d6770",
  softBlue: "#e8f1ef",
  neutral: "#9aa6a0",
  neutralLight: "#cbd2ce",
};

const SCENARIO_ORDER = [
  "combined_high",
  "combined_base",
  "combined_low",
  "assistance_cut_50pct",
  "assistance_cut_25pct",
  "assistance_cut_10pct",
  "food_price_20pct",
  "food_price_10pct",
  "food_price_5pct",
  "fertilizer_50pct",
  "fertilizer_25pct",
  "fertilizer_10pct",
  "oil_50pct",
  "oil_25pct",
  "oil_10pct",
];

const SCENARIO_LABELS = {
  combined_high: "Combined high shock",
  combined_base: "Combined base shock",
  combined_low: "Combined low shock",
  assistance_cut_50pct: "Assistance cut 50%",
  assistance_cut_25pct: "Assistance cut 25%",
  assistance_cut_10pct: "Assistance cut 10%",
  food_price_20pct: "Food price +20%",
  food_price_10pct: "Food price +10%",
  food_price_5pct: "Food price +5%",
  fertilizer_50pct: "Fertilizer +50%",
  fertilizer_25pct: "Fertilizer +25%",
  fertilizer_10pct: "Fertilizer +10%",
  oil_50pct: "Oil +50%",
  oil_25pct: "Oil +25%",
  oil_10pct: "Oil +10%",
};

const SCENARIO_GROUPS = [
  { id: "combined", label: "Combined stress test", scenarios: ["combined_high", "combined_base", "combined_low"] },
  { id: "assistance", label: "Assistance financing", scenarios: ["assistance_cut_50pct", "assistance_cut_25pct", "assistance_cut_10pct"] },
  { id: "food", label: "Food prices", scenarios: ["food_price_20pct", "food_price_10pct", "food_price_5pct"] },
  { id: "fertilizer", label: "Fertilizer prices", scenarios: ["fertilizer_50pct", "fertilizer_25pct", "fertilizer_10pct"] },
  { id: "oil", label: "Oil prices", scenarios: ["oil_50pct", "oil_25pct", "oil_10pct"] },
];

const SCENARIO_LEVEL_LABELS = {
  combined_high: "High shock",
  combined_base: "Base shock",
  combined_low: "Low shock",
  assistance_cut_50pct: "50% cut",
  assistance_cut_25pct: "25% cut",
  assistance_cut_10pct: "10% cut",
  food_price_20pct: "+20%",
  food_price_10pct: "+10%",
  food_price_5pct: "+5%",
  fertilizer_50pct: "+50%",
  fertilizer_25pct: "+25%",
  fertilizer_10pct: "+10%",
  oil_50pct: "+50%",
  oil_25pct: "+25%",
  oil_10pct: "+10%",
};

const LANDLOCKED_ISO3 = new Set(["AFG", "ARM", "BFA", "ETH", "MLI", "MDA", "SSD"]);
const GEOGRAPHY_OPTIONS = ["All geographies", "Landlocked", "Coastal or island"];
const RAW_EVIDENCE_SUMMARY_LABELS = new Set([
  "Peak food-price increase",
  "IPC Phase 3+ population",
  "IDMC conflict IDPs",
  "IOM selected DTM IDPs",
  "Humanitarian funding flows",
  "Food/nutrition funding per IPC 3+ person",
  "Imports as share of GDP",
  "Female informal employment",
  "Female vulnerable employment",
  "Women account ownership",
  "Female-headed households",
]);

const GENDER_DRIVER_COMPONENTS = [
  { key: "gender_vulnerability_score", label: "Gender vulnerability", color: COLORS.red },
  { key: "acute_food_insecurity_score", label: "IPC severity", color: COLORS.gold },
  { key: "public_displacement_layer_score", label: "Internal displacement", color: COLORS.blue },
  { key: "assistance_pressure_score", label: "Assistance pressure", color: COLORS.teal },
  { key: "wfp_food_security_outcome_score", label: "WFP outcome layer", color: COLORS.neutral },
  { key: "price_pressure_score", label: "Food-price pressure", color: COLORS.navy },
];

const GENDER_PROXY_DECOMPOSITION_COMPONENTS = [
  { field: "score", label: "Official Shock Exposure Index", coefficient: 0.25, scale: "0-100", color: COLORS.navy },
  { field: "components.gender_vulnerability_score", label: "Gender vulnerability", coefficient: 0.25, scale: "0-1", color: COLORS.red },
  { field: "components.acute_food_insecurity_score", label: "IPC acute food insecurity", coefficient: 0.15, scale: "0-1", color: COLORS.gold },
  { field: "components.wfp_food_security_outcome_score", label: "WFP outcome layer", coefficient: 0.10, scale: "0-1", color: COLORS.neutral },
  { field: "components.public_displacement_layer_score", label: "IDMC/IOM internal displacement", coefficient: 0.15, scale: "0-1", color: COLORS.blue },
  { field: "components.assistance_pressure_score", label: "Assistance/funding pressure", coefficient: 0.10, scale: "0-1", color: COLORS.teal },
  { field: "components.price_pressure_score", label: "Domestic food-price pressure", coefficient: 0.10, scale: "0-1", color: COLORS.navy },
  { field: "components.import_exposure_score", label: "Food/fuel import exposure", coefficient: 0.05, scale: "0-1", color: COLORS.neutralLight },
  { field: "components.agriculture_input_exposure_score", label: "Agriculture/fertilizer exposure", coefficient: 0.10, scale: "0-1", color: COLORS.blue },
];

const state = {
  region: "All regions",
  geography: "All geographies",
  selectedIso: data.summary.topCountry?.iso3 || data.countries[0]?.iso3,
  scenarioGroup: "assistance",
  scenario: "assistance_cut_50pct",
};

function hasElement(...items) {
  return items.every(Boolean);
}

function appendMobileCardRow(card, label, value) {
  const row = document.createElement("div");
  row.className = "mobile-table-card-row";
  const key = document.createElement("span");
  key.textContent = label;
  const data = document.createElement("strong");
  data.textContent = value || "n/a";
  row.append(key, data);
  card.appendChild(row);
}

function createMobileTableCard(title, meta, rows) {
  const card = document.createElement("article");
  card.className = "mobile-table-card";
  const heading = document.createElement("h4");
  heading.textContent = title;
  card.appendChild(heading);
  if (meta) {
    const note = document.createElement("p");
    note.className = "mobile-table-card-meta";
    note.textContent = meta;
    card.appendChild(note);
  }
  rows.forEach(([label, value]) => appendMobileCardRow(card, label, value));
  return card;
}

function appendLensItem(container, label, value, note = "") {
  const item = document.createElement("div");
  item.className = "lens-item";
  const copy = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = label;
  const span = document.createElement("span");
  span.textContent = value || "n/a";
  copy.append(strong, span);
  item.appendChild(copy);
  if (note) {
    const p = document.createElement("p");
    p.textContent = note;
    item.appendChild(p);
  }
  container.appendChild(item);
}

function appendText(parent, tagName, text, className = "") {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  node.textContent = text;
  parent.appendChild(node);
  return node;
}

function setMobileFiltersExpanded(expanded) {
  if (!el.controlsBand) return;
  el.controlsBand.dataset.expanded = expanded ? "true" : "false";
  if (el.mobileFilterToggle) {
    el.mobileFilterToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    el.mobileFilterToggle.textContent = expanded ? "Close" : "Filters";
  }
}

const charts = {
  beforeAfter: null,
  ranking: null,
  component: null,
  scenario: null,
  region: null,
  gender: null,
  femaleVulnerable: null,
  femaleLabourForce: null,
  femaleAgriculture: null,
  genderDrivers: null,
  genderDecomposition: null,
  indexDecomposition: null,
  caseloadRange: null,
  figureRange: null,
  figureWaterfall: null,
  figureTopCountries: null,
  figureAllCountriesPeople: null,
  figureAllCountriesPopulation: null,
  figureWomenGirlsAbsolute: null,
  figureGenderShare: null,
};

const el = {
  progressBar: document.getElementById("reading-progress-bar"),
  methodBoundary: document.getElementById("method-boundary"),
  beforeAfterCountry: document.getElementById("before-after-country"),
  beforeAfterReadiness: document.getElementById("before-after-readiness"),
  beforeAfterPeakIncrease: document.getElementById("before-after-peak-increase"),
  beforeAfterPeakComparison: document.getElementById("before-after-peak-comparison"),
  beforeAfterMatchedSeries: document.getElementById("before-after-matched-series"),
  beforeAfterIpc: document.getElementById("before-after-ipc"),
  beforeAfterEventStudy: document.getElementById("before-after-event-study"),
  beforeAfterNote: document.getElementById("before-after-note"),
  beforeAfterChartNote: document.getElementById("before-after-chart-note"),
  beforeAfterMessageList: document.getElementById("before-after-message-list"),
  beforeAfterSupplementalList: document.getElementById("before-after-supplemental-list"),
  beforeAfterTableBody: document.getElementById("before-after-table-body"),
  beforeAfterTableNote: document.getElementById("before-after-table-note"),
  regionFilter: document.getElementById("region-filter"),
  geographyFilter: document.getElementById("geography-filter"),
  countrySelect: document.getElementById("country-select"),
  scenarioGroupSelect: document.getElementById("scenario-group-select"),
  scenarioSelect: document.getElementById("scenario-select"),
  filterSummary: document.getElementById("filter-summary"),
  controlsBand: document.querySelector(".controls-band"),
  controlsPanel: document.getElementById("controls-panel"),
  mobileFilterToggle: document.getElementById("mobile-filter-toggle"),
  compactFilterTitle: document.getElementById("compact-filter-title"),
  compactFilterSubtitle: document.getElementById("compact-filter-subtitle"),
  messageList: document.getElementById("message-list"),
  rankingConfidenceList: document.getElementById("ranking-confidence-list"),
  countryRegion: document.getElementById("country-region"),
  countryName: document.getElementById("country-name"),
  countryScore: document.getElementById("country-score"),
  countryScoreFill: document.getElementById("country-score-fill"),
  countryTier: document.getElementById("country-tier"),
  countryRank: document.getElementById("country-rank"),
  countryProxyRank: document.getElementById("country-proxy-rank"),
  countryMissing: document.getElementById("country-missing"),
  countryConfidence: document.getElementById("country-confidence"),
  countryImputationPanel: document.getElementById("country-imputation-panel"),
  countryImputationCount: document.getElementById("country-imputation-count"),
  countryImputationList: document.getElementById("country-imputation-list"),
  countryImputationNote: document.getElementById("country-imputation-note"),
  pathwayList: document.getElementById("pathway-list"),
  countryFocus: document.getElementById("country-focus"),
  countryGenderList: document.getElementById("country-gender-list"),
  countryComparisonList: document.getElementById("country-comparison-list"),
  scenarioTitle: document.getElementById("scenario-title"),
  scenarioSelectedDelta: document.getElementById("scenario-selected-delta"),
  scenarioSelectedScore: document.getElementById("scenario-selected-score"),
  scenarioSelectedRank: document.getElementById("scenario-selected-rank"),
  scenarioNote: document.getElementById("scenario-note"),
  readinessList: document.getElementById("readiness-list"),
  coverageList: document.getElementById("coverage-list"),
  genderDriverTitle: document.getElementById("gender-driver-title"),
  genderLensList: document.getElementById("gender-lens-list"),
  genderMonitoringList: document.getElementById("gender-monitoring-list"),
  displacementClarityList: document.getElementById("displacement-clarity-list"),
  sourceCoverageSummary: document.getElementById("source-coverage-summary"),
  sourceCoverageHeatmap: document.getElementById("source-coverage-heatmap"),
  countryGenderIndicatorTable: document.getElementById("country-gender-indicator-table"),
  countrySourceEvidenceTable: document.getElementById("country-source-evidence-table"),
  genderDecompositionTable: document.getElementById("gender-decomposition-table"),
  indexDecompositionTable: document.getElementById("index-decomposition-table"),
  rawEvidenceTable: document.getElementById("country-raw-evidence-table"),
  countryTableBody: document.getElementById("country-table-body"),
  countryTableCardList: document.getElementById("country-table-card-list"),
  countryTableSummary: document.getElementById("country-table-summary"),
  beforeAfterCardList: document.getElementById("before-after-card-list"),
  caseloadSummaryList: document.getElementById("caseload-summary-list"),
  caseloadBoundaryNote: document.getElementById("caseload-boundary-note"),
  caseloadSourceNote: document.getElementById("caseload-source-note"),
  caseloadEstimatesTableBody: document.getElementById("caseload-estimates-table-body"),
  caseloadEstimatesCardList: document.getElementById("caseload-estimates-card-list"),
  caseloadTableSummary: document.getElementById("caseload-table-summary"),
  footerSource: document.getElementById("footer-source"),
};

function nf(options = {}) {
  return new Intl.NumberFormat("en-US", options);
}

function fmt(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return nf({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(value));
}

function fmtInt(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return nf({ maximumFractionDigits: 0 }).format(Number(value));
}

function fmtCompact(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return nf({ notation: "compact", maximumFractionDigits: 1 }).format(Number(value));
}

function fmtUsd(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return `$${nf({ notation: "compact", maximumFractionDigits: 1 }).format(Number(value))}`;
}

function fmtPct(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return `${fmt(value, digits)}%`;
}

function fmtSignedPct(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  const number = Number(value);
  const sign = number > 0 ? "+" : "";
  return `${sign}${fmt(number, digits)}%`;
}

function fmtShare(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  const number = Number(value);
  return fmtPct(Math.abs(number) <= 1 ? number * 100 : number, digits);
}

function fmtMillions(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  return `${fmt(Number(value) / 1000000, digits)}M`;
}

function fmtDate(value) {
  if (!value) return "n/a";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function fmtIpcTiming(ipc) {
  if (!ipc?.available) return "No latest national IPC row";
  const period = ipc.periodFrom || ipc.periodTo ? `${fmtDate(ipc.periodFrom)} to ${fmtDate(ipc.periodTo)}` : "period n/a";
  const analysis = ipc.dateOfAnalysis ? `analysis ${ipc.dateOfAnalysis}` : "analysis date n/a";
  const type = ipc.periodType || "period";
  return `${type}: ${period}; ${analysis}`;
}

function eventStudyLabel(country) {
  return country.beforeAfter?.eventStudyReady ? "Ready" : "Not ready";
}

function sameMonthYoY(country) {
  return country.beforeAfter?.sameMonthYoY || {};
}

function eventStudyPillLabel(country) {
  return country.beforeAfter?.eventStudyReady ? "Event-study ready" : "Not event-study ready";
}

function eventStudyUseText(country) {
  const yoy = sameMonthYoY(country);
  if (country.beforeAfter?.eventStudyReady && yoy.status === "positive_peak") return "Ready for formal price event study";
  if (country.beforeAfter?.eventStudyReady && yoy.status === "no_positive_increase") return "Ready, but no positive price peak";
  if (country.beforeAfter?.eventStudyReady) return "Ready for descriptive price study";
  if (yoy.status === "no_matched_yoy_series") return "Not ready: no comparable price record";
  return "Not ready for formal price event study";
}

function numericValue(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  return Number(value);
}

function valueAtPath(obj, path) {
  return String(path).split(".").reduce((current, key) => (current == null ? null : current[key]), obj);
}

function genderProxyContributionRows(country) {
  return GENDER_PROXY_DECOMPOSITION_COMPONENTS.map((item) => {
    const raw = numericValue(valueAtPath(country, item.field));
    const points = raw === null
      ? null
      : item.scale === "0-100"
        ? raw * item.coefficient
        : raw * item.coefficient * 100;
    return {
      label: item.label,
      field: item.field,
      inputValue: raw,
      inputScale: item.scale,
      coefficient: item.coefficient,
      points,
      color: item.color,
    };
  }).filter((row) => row.points !== null);
}

function indexContributionRows(country) {
  return Object.entries(data.componentLabels || {}).map(([key, label]) => {
    const component = numericValue(country.components?.[key]);
    const weight = numericValue(data.indexWeights?.[key]);
    return {
      key,
      label,
      componentScore: component,
      weight,
      points: component === null || weight === null ? null : component * weight * 100,
      color: key === "gender_vulnerability_score" ? COLORS.red : key === "public_displacement_layer_score" ? COLORS.blue : COLORS.teal,
    };
  }).filter((row) => row.points !== null);
}

function appendTableCell(row, text, tagName = "td", className = "") {
  const cell = document.createElement(tagName);
  if (className) cell.className = className;
  cell.textContent = text;
  row.appendChild(cell);
  return cell;
}

function renderDecompositionTable(container, rows, options) {
  if (!container) return;
  container.innerHTML = "";
  const list = document.createElement("div");
  list.className = "decomposition-table";

  const header = document.createElement("div");
  header.className = "decomposition-row decomposition-header";
  ["Input", "Score", "Weight", "Contribution"].forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "decomposition-cell";
    cell.textContent = label;
    header.appendChild(cell);
  });
  list.appendChild(header);

  rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "decomposition-row";
    if (row.imputed) {
      item.dataset.imputed = "true";
      item.title = "This row uses a missing or neutral-imputed public input.";
    }
    [
      ["Input", row.label, "input"],
      ["Score", row.scoreText, "numeric"],
      ["Weight", row.weightText, "numeric"],
      ["Contribution", row.pointsText, "numeric"],
    ].forEach(([label, value, modifier]) => {
      const cell = document.createElement("div");
      cell.className = `decomposition-cell decomposition-${modifier}`;
      cell.dataset.label = label;
      cell.textContent = value;
      item.appendChild(cell);
    });
    list.appendChild(item);
  });

  [
    ["Recalculated from visible rows", options.note || "", `${fmt(options.total)} points`],
    [options.finalLabel, options.finalNote || "", `${fmt(options.finalScore)} points`],
  ].forEach(([label, note, value]) => {
    const item = document.createElement("div");
    item.className = "decomposition-row decomposition-summary-row";
    const labelCell = document.createElement("div");
    labelCell.className = "decomposition-cell decomposition-input";
    labelCell.dataset.label = "Input";
    labelCell.textContent = label;
    const noteCell = document.createElement("div");
    noteCell.className = "decomposition-cell decomposition-note";
    noteCell.dataset.label = "Note";
    noteCell.textContent = note;
    const valueCell = document.createElement("div");
    valueCell.className = "decomposition-cell decomposition-numeric decomposition-contribution";
    valueCell.dataset.label = "Contribution";
    valueCell.textContent = value;
    item.append(labelCell, noteCell, valueCell);
    list.appendChild(item);
  });

  container.appendChild(list);
}

function hasPositiveYoyPeak(country) {
  const value = numericValue(sameMonthYoY(country).peakPositiveYoYPct);
  return value !== null && value > 0;
}

function positivePeakLabel(yoy) {
  const peak = numericValue(yoy.peakPositiveYoYPct);
  return peak !== null && peak > 0 ? fmtSignedPct(peak) : "No positive rise";
}

function matchedSeriesLabel(yoy) {
  const peakSeries = numericValue(yoy.matchedSeriesAtPeak);
  const totalSeries = numericValue(yoy.matchedYoySeriesMonths);
  if (peakSeries && peakSeries > 0) return fmtInt(peakSeries);
  if (totalSeries && totalSeries > 0) return `${fmtInt(totalSeries)} total`;
  return "n/a";
}

function supplementalLayerLabel(country) {
  const available = numericValue(country.supplementalEvidence?.availableLayerCount);
  if (available === null) return "n/a";
  return `${fmtInt(available)}/5 available`;
}

function coverageStatusLabel(value) {
  if (!value) return "n/a";
  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function hasData(value) {
  return value !== null && value !== undefined && !Number.isNaN(Number(value));
}

function isUnavailableText(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return !text || text === "n/a" || text.includes("not available") || text.includes("no selected") || text.includes("no comparable price record");
}

function confidenceBorderColor(country) {
  const level = country.dataConfidence?.level;
  if (level === "Limited") return COLORS.red;
  if (level === "Partial") return COLORS.gold;
  return "rgba(0, 0, 0, 0)";
}

function confidenceBorderWidth(country) {
  const level = country.dataConfidence?.level;
  return level === "Limited" || level === "Partial" ? 2 : 0;
}

function missingComponentKeySet(country) {
  return new Set((country.missingComponents || []).map((component) => component.key));
}

function sourceStatusFromSupplemental(value) {
  const status = String(value || "").toLowerCase();
  if (status === "covered" || status === "available") return "available";
  if (status === "partial" || status === "limited") return "partial";
  return "missing";
}

function sourceStatusLabel(status) {
  if (status === "available") return "Available";
  if (status === "partial") return "Partial";
  return "Missing";
}

function sourceStatusBadge(status) {
  const badge = document.createElement("span");
  badge.className = `source-status source-status-${status || "missing"}`;
  badge.textContent = sourceStatusLabel(status);
  return badge;
}

function sourceCoverageRows(country) {
  const yoy = sameMonthYoY(country);
  const indicators = country.indicators || {};
  const coverage = country.additionalCoverage || {};
  const supplemental = country.supplementalEvidence || {};
  const genderFinance = country.genderFinance || {};

  const wfpPriceStatus = yoy.status === "no_matched_yoy_series" ? "missing" : "available";
  const ipcStatus = hasData(indicators.ipcPhase3PlusPct) || country.beforeAfter?.ipcLatest?.available ? "available" : "missing";
  const wdiStatus = [
    indicators.importsGdpPct,
    indicators.foodImportsMerchandisePct,
    indicators.fuelImportsMerchandisePct,
    indicators.agricultureValueAddedGdpPct,
  ].some(hasData) ? "available" : "missing";
  const faostatStatus = [
    indicators.cerealImportDependencyPct,
    indicators.fertilizerImportDependencyPct,
  ].some(hasData) ? "available" : "missing";
  const idmcStatus = coverage.idmcAnnualAvailable || coverage.idmcEventsAvailable || [
    indicators.idmcConflictTotalDisplacement,
    indicators.idmcPostShockConflictFigureTotal,
  ].some(hasData) ? "available" : "missing";
  const iomStatus = coverage.iomDtmAvailable || hasData(indicators.iomLatestIdpSum) ? "available" : "missing";
  const ftsStatus = hasData(indicators.destinationFundingUsd) || hasData(indicators.foodNutritionFundingPerIpc3PlusUsd) ? "available" : "missing";
  const wfpOutcomeStatus = coverage.wfpFsiAvailable || [
    indicators.wfpPoorBorderlineFoodConsumptionPct,
    indicators.wfpRcsiMean,
  ].some(hasData) ? "available" : "missing";
  const findexStatus = [
    genderFinance.accountWomenPct,
    genderFinance.mobileMoneyWomenPct,
    genderFinance.formalOrMobileSavingWomenPct,
    indicators.femaleAccountOwnershipPct,
  ].some(hasData) ? "available" : sourceStatusFromSupplemental(supplemental.findexCoverageStatus);

  return [
    {
      key: "wfp_prices",
      shortLabel: "Prices",
      label: "WFP/HDX food prices",
      status: wfpPriceStatus,
      evidence: wfpPriceStatus === "available" ? `${positivePeakLabel(yoy)}; ${matchedSeriesLabel(yoy)} matched records` : "No comparable same-month price record",
      use: "Domestic food-price pressure and before/after price evidence",
      note: "Descriptive matched price movement, not causal attribution.",
    },
    {
      key: "ipc",
      shortLabel: "IPC",
      label: "IPC/HDX acute food insecurity",
      status: ipcStatus,
      evidence: hasData(indicators.ipcPhase3PlusPct) ? `${fmtPct(indicators.ipcPhase3PlusPct)} Phase 3+ (${fmtCompact(indicators.ipcPhase3PlusNumber)} people)` : fmtIpcTiming(country.beforeAfter?.ipcLatest),
      use: "IPC acute food insecurity component and IPC Phase 3+/4+ context",
      note: "Total-population evidence; not sex-disaggregated.",
    },
    {
      key: "wdi",
      shortLabel: "WDI",
      label: "World Bank WDI",
      status: wdiStatus,
      evidence: hasData(indicators.importsGdpPct) ? `${fmtPct(indicators.importsGdpPct)} imports/GDP` : "No selected WDI field available",
      use: "Import exposure and structural country context",
      note: "Structural exposure, not a short-term outcome.",
    },
    {
      key: "faostat",
      shortLabel: "FAOSTAT",
      label: "FAOSTAT",
      status: faostatStatus,
      evidence: hasData(indicators.fertilizerImportDependencyPct) ? `${fmtPct(indicators.fertilizerImportDependencyPct)} fertilizer import dependency` : hasData(indicators.cerealImportDependencyPct) ? `${fmtPct(indicators.cerealImportDependencyPct)} cereal import dependency` : "No selected FAOSTAT field available",
      use: "Agriculture and fertilizer exposure",
      note: "Food-system and input-dependency context.",
    },
    {
      key: "unhcr",
      shortLabel: "UNHCR",
      label: "UNHCR displacement extracts",
      status: hasData(country.components?.displacement_pressure_score) ? "available" : "missing",
      evidence: hasData(country.components?.displacement_pressure_score) ? `Legacy proxy input ${fmt(country.components.displacement_pressure_score, 2)}` : "Legacy proxy unavailable",
      use: "Legacy external displacement proxy retained for continuity",
      note: "Not shown as a standalone score; zero does not mean no internal displacement.",
    },
    {
      key: "fts",
      shortLabel: "FTS",
      label: "OCHA Financial Tracking Service",
      status: ftsStatus,
      evidence: hasData(indicators.destinationFundingUsd) ? `${fmtUsd(indicators.destinationFundingUsd)} destination funding` : "No selected FTS field available",
      use: "Assistance/funding pressure and funding-per-person context",
      note: "Funding flow/context indicator, not assistance reach.",
    },
    {
      key: "idmc",
      shortLabel: "IDMC",
      label: "IDMC internal displacement",
      status: idmcStatus,
      evidence: hasData(indicators.idmcConflictTotalDisplacement) ? `${fmtCompact(indicators.idmcConflictTotalDisplacement)} conflict IDPs` : coverage.idmcEventsAvailable ? `${fmtCompact(coverage.idmcPostShockFigureTotal)} post-shock figure total` : "No selected IDMC field available",
      use: "IDMC/IOM internal-displacement layer and public displacement evidence",
      note: "Shown as public displacement evidence, not a separate score.",
    },
    {
      key: "iom",
      shortLabel: "IOM",
      label: "IOM DTM public summaries",
      status: iomStatus,
      evidence: hasData(indicators.iomLatestIdpSum) ? `${fmtCompact(indicators.iomLatestIdpSum)} selected DTM IDPs` : "No selected IOM DTM field available",
      use: "IDMC/IOM internal-displacement layer and public displacement evidence",
      note: "Selected public DTM summaries where available.",
    },
    {
      key: "wfp_outcomes",
      shortLabel: "WFP out.",
      label: "Public WFP food-security outcomes",
      status: wfpOutcomeStatus,
      evidence: hasData(indicators.wfpPoorBorderlineFoodConsumptionPct) ? `${fmtPct(indicators.wfpPoorBorderlineFoodConsumptionPct)} poor/borderline FCS` : hasData(indicators.wfpRcsiMean) ? `${fmt(indicators.wfpRcsiMean, 1)} rCSI mean` : "No selected public WFP outcome field available",
      use: "Public WFP food-security outcome layer",
      note: "Coverage is sparse, so this receives modest weight.",
    },
    {
      key: "findex",
      shortLabel: "Findex",
      label: "Findex gender-finance indicators",
      status: findexStatus,
      evidence: hasData(genderFinance.accountWomenPct ?? indicators.femaleAccountOwnershipPct) ? `${fmtPct(genderFinance.accountWomenPct ?? indicators.femaleAccountOwnershipPct)} women account ownership` : "No selected Findex field available",
      use: "Gender and financial-access monitoring context",
      note: "Context only; not a measured food-security outcome.",
    },
    {
      key: "acled",
      shortLabel: "ACLED",
      label: "ACLED public event coverage",
      status: sourceStatusFromSupplemental(supplemental.acledCoverageStatus),
      evidence: `Coverage status: ${coverageStatusLabel(supplemental.acledCoverageStatus)}`,
      use: "Supplemental public-context coverage",
      note: "Not an index component and not conflict-impact attribution.",
    },
  ];
}

function compactCountryList(rows, limit = 5) {
  const names = rows.map((row) => row.country);
  if (names.length <= limit) return names.join(", ");
  return `${names.slice(0, limit).join(", ")} and ${names.length - limit} more`;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function countryByIso(iso3) {
  return data.countries.find((country) => country.iso3 === iso3) || data.countries[0];
}

function countryGeography(country) {
  return LANDLOCKED_ISO3.has(country.iso3) ? "Landlocked" : "Coastal or island";
}

function displayPathwayLabel(label) {
  if (!label) return "n/a";
  return String(label)
    .replaceAll("Existing displacement proxy", "Legacy external displacement proxy")
    .replaceAll("IDMC/IOM public displacement layer", "IDMC/IOM internal displacement layer");
}

function matchesGeography(country) {
  return state.geography === "All geographies" || countryGeography(country) === state.geography;
}

function matchesRegion(country) {
  return state.region === "All regions" || country.region === state.region;
}

function regions() {
  const countries = data.countries.filter(matchesGeography);
  return ["All regions", ...Array.from(new Set(countries.map((country) => country.region))).sort()];
}

function filteredCountries() {
  return data.countries
    .filter((country) => matchesRegion(country) && matchesGeography(country))
    .sort((a, b) => (a.rank || 999) - (b.rank || 999));
}

function tierColor(tier) {
  if (tier === "Very high") return COLORS.red;
  if (tier === "High") return COLORS.gold;
  if (tier === "Lower") return COLORS.teal;
  return COLORS.blue;
}

function scenarioLabel(scenario) {
  return SCENARIO_LABELS[scenario] || scenario.replaceAll("_", " ");
}

function scenarioLevelLabel(scenario) {
  return SCENARIO_LEVEL_LABELS[scenario] || scenarioLabel(scenario);
}

function availableScenarios() {
  const present = new Set(data.scenarios.map((row) => row.scenario));
  const ordered = SCENARIO_ORDER.filter((scenario) => present.has(scenario));
  const extras = Array.from(present).filter((scenario) => !ordered.includes(scenario)).sort();
  return [...ordered, ...extras];
}

function scenarioGroupFor(scenario) {
  return SCENARIO_GROUPS.find((group) => group.scenarios.includes(scenario));
}

function availableScenarioGroups() {
  const present = new Set(data.scenarios.map((row) => row.scenario));
  const grouped = SCENARIO_GROUPS
    .map((group) => ({
      ...group,
      scenarios: group.scenarios.filter((scenario) => present.has(scenario)),
    }))
    .filter((group) => group.scenarios.length);
  const groupedScenarios = new Set(grouped.flatMap((group) => group.scenarios));
  const ungrouped = availableScenarios().filter((scenario) => !groupedScenarios.has(scenario));
  return ungrouped.length ? [...grouped, { id: "other", label: "Other scenarios", scenarios: ungrouped }] : grouped;
}

function scenariosForGroup(groupId) {
  return availableScenarioGroups().find((group) => group.id === groupId)?.scenarios || [];
}

function chartFont() {
  return {
    family: '"Source Sans 3", "Segoe UI", Arial, sans-serif',
    size: 12,
    weight: "700",
  };
}

const barValueLabelPlugin = {
  id: "barValueLabel",
  afterDatasetsDraw(chart, _args, options) {
    const dataset = chart.data.datasets?.[0];
    const meta = chart.getDatasetMeta(0);
    if (!dataset || !meta?.data?.length) return;
    const maxLabels = options?.maxLabels ?? 0;
    if (!maxLabels) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    ctx.save();
    ctx.font = '800 11px "Source Sans 3", "Segoe UI", Arial, sans-serif';
    ctx.textBaseline = "middle";

    meta.data.forEach((bar, index) => {
      if (index >= maxLabels) return;
      const value = numericValue(dataset.data[index]);
      if (value === null) return;
      const label = options?.formatter ? options.formatter(value, index, chart) : fmt(value);
      const props = bar.getProps(["x", "y", "base"], true);
      const textWidth = ctx.measureText(label).width;
      let x = props.x + 7;
      let align = "left";
      let color = options?.color || COLORS.navy;
      if (x + textWidth > chartArea.right) {
        x = props.x - 7;
        align = "right";
        color = options?.insideColor || COLORS.navy;
      }
      ctx.textAlign = align;
      ctx.fillStyle = color;
      ctx.fillText(label, x, props.y);
    });
    ctx.restore();
  },
};

function baseChartOptions(extra = {}) {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: { color: COLORS.navy, font: chartFont() },
      },
      tooltip: {
        backgroundColor: COLORS.navy,
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: COLORS.grid },
        ticks: { color: COLORS.muted, font: chartFont() },
      },
      y: {
        grid: { display: false },
        ticks: { color: COLORS.navy, font: chartFont() },
      },
    },
  };
  return {
    ...base,
    ...extra,
    plugins: {
      ...base.plugins,
      ...(extra.plugins || {}),
    },
  };
}

function destroyChart(name) {
  if (charts[name]) {
    charts[name].destroy();
    charts[name] = null;
  }
}

function renderMeta() {
  if (el.methodBoundary) el.methodBoundary.textContent = data.metadata.methodBoundary;
  if (el.footerSource) el.footerSource.textContent = "Source: Public-source indicators and UN Women analytical calculations.";
}

function populateControls() {
  if (!hasElement(el.geographyFilter, el.regionFilter, el.countrySelect)) return;
  el.geographyFilter.innerHTML = "";
  GEOGRAPHY_OPTIONS.forEach((geography) => {
    const option = document.createElement("option");
    option.value = geography;
    option.textContent = geography;
    el.geographyFilter.appendChild(option);
  });
  el.geographyFilter.value = state.geography;

  el.regionFilter.innerHTML = "";
  const regionOptions = regions();
  if (!regionOptions.includes(state.region)) state.region = "All regions";
  regionOptions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    el.regionFilter.appendChild(option);
  });
  el.regionFilter.value = state.region;

  populateCountrySelect();
  populateScenarioControls();
}

function populateCountrySelect() {
  if (!el.countrySelect) return;
  const countries = filteredCountries();
  if (!countries.some((country) => country.iso3 === state.selectedIso)) {
    state.selectedIso = countries[0]?.iso3 || data.countries[0]?.iso3;
  }
  el.countrySelect.innerHTML = "";
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.iso3;
    option.textContent = `${country.rank}. ${country.country}`;
    el.countrySelect.appendChild(option);
  });
  el.countrySelect.value = state.selectedIso;
}

function populateScenarioControls() {
  if (!hasElement(el.scenarioGroupSelect, el.scenarioSelect)) return;
  const groupOptions = availableScenarioGroups();
  const currentScenarioGroup = scenarioGroupFor(state.scenario);
  if (!groupOptions.some((group) => group.id === state.scenarioGroup)) {
    state.scenarioGroup = currentScenarioGroup?.id || groupOptions[0]?.id || "other";
  }

  el.scenarioGroupSelect.innerHTML = "";
  groupOptions.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.label;
    el.scenarioGroupSelect.appendChild(option);
  });
  el.scenarioGroupSelect.value = state.scenarioGroup;

  populateScenarioSelect();
}

function populateScenarioSelect() {
  if (!el.scenarioSelect) return;
  const options = scenariosForGroup(state.scenarioGroup);
  if (!options.includes(state.scenario)) {
    state.scenario = options[0] || availableScenarios()[0];
  }

  el.scenarioSelect.innerHTML = "";
  options.forEach((scenario) => {
    const option = document.createElement("option");
    option.value = scenario;
    option.textContent = scenarioLevelLabel(scenario);
    option.title = scenarioLabel(scenario);
    el.scenarioSelect.appendChild(option);
  });
  el.scenarioSelect.value = state.scenario;
}

function renderMessages() {
  if (!el.messageList) return;
  el.messageList.innerHTML = "";
  data.keyMessages.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    el.messageList.appendChild(item);
  });
}

function renderFilterSummary() {
  if (!el.filterSummary && !el.compactFilterTitle && !el.compactFilterSubtitle) return;
  const countries = filteredCountries();
  const selectedCountry = countryByIso(state.selectedIso);
  const parts = [];
  if (state.region !== "All regions") parts.push(state.region);
  if (state.geography !== "All geographies") parts.push(state.geography.toLowerCase());
  const scope = parts.length ? ` for ${parts.join(", ")}` : "";
  const availableRegions = regions().length - 1;
  const geographyNote = state.geography === "All geographies"
    ? ""
    : ` Region options are limited to the ${availableRegions} region${availableRegions === 1 ? "" : "s"} with ${state.geography.toLowerCase()} countries.`;
  if (el.filterSummary) {
    el.filterSummary.textContent = `Showing ${countries.length} of ${data.summary.countryCount} countries${scope}. Selected country: ${selectedCountry.country}.${geographyNote}`;
  }
  if (el.compactFilterTitle) {
    el.compactFilterTitle.textContent = selectedCountry.country;
  }
  if (el.compactFilterSubtitle) {
    const scopeLabel = [
      state.region === "All regions" ? "All regions" : state.region,
      state.geography === "All geographies" ? "All geographies" : state.geography,
    ];
    el.compactFilterSubtitle.textContent = scopeLabel.join(" - ");
  }
}

function renderBeforeAfter() {
  const country = countryByIso(state.selectedIso);
  const beforeAfter = country.beforeAfter || {};
  const yoy = sameMonthYoY(country);
  const countries = filteredCountries();
  const positiveRows = countries
    .filter(hasPositiveYoyPeak)
    .sort((a, b) => numericValue(sameMonthYoY(b).peakPositiveYoYPct) - numericValue(sameMonthYoY(a).peakPositiveYoYPct));
  const noMatchedRows = countries.filter((row) => sameMonthYoY(row).status === "no_matched_yoy_series");
  const noPositiveRows = countries.filter((row) => sameMonthYoY(row).status === "no_positive_increase");
  const largestIncrease = positiveRows[0];

  if (el.beforeAfterCountry) el.beforeAfterCountry.textContent = country.country;
  if (el.beforeAfterReadiness) {
    el.beforeAfterReadiness.textContent = eventStudyPillLabel(country);
    delete el.beforeAfterReadiness.dataset.readiness;
  }
  if (el.beforeAfterPeakIncrease) el.beforeAfterPeakIncrease.textContent = positivePeakLabel(yoy);
  if (el.beforeAfterPeakComparison) el.beforeAfterPeakComparison.textContent = yoy.peakComparisonLabel || yoy.bestAvailableComparisonLabel || "No comparable price record";
  if (el.beforeAfterMatchedSeries) el.beforeAfterMatchedSeries.textContent = matchedSeriesLabel(yoy);
  if (el.beforeAfterIpc) el.beforeAfterIpc.textContent = fmtIpcTiming(beforeAfter.ipcLatest);
  if (el.beforeAfterEventStudy) el.beforeAfterEventStudy.textContent = eventStudyUseText(country);
  if (el.beforeAfterNote) el.beforeAfterNote.textContent = `${country.country}: ${yoy.interpretation || "No same-month price interpretation is available."} The price-record count shows how many like-for-like WFP/HDX market, commodity and unit records sit behind the peak comparison.`;

  renderBeforeAfterChart(positiveRows);
  if (el.beforeAfterChartNote) {
    el.beforeAfterChartNote.textContent = positiveRows.length
      ? "Bars show only each country's highest positive median food-price change against the same month in 2025. This is a screening view, not causal attribution; flat, negative and unavailable comparisons stay in the table."
      : "No country in the current filtered view has a positive price increase against the same month in 2025.";
  }

  if (el.beforeAfterMessageList) {
    el.beforeAfterMessageList.innerHTML = "";
    [
      largestIncrease ? `${largestIncrease.country} has the largest positive matched price comparison: ${fmtSignedPct(sameMonthYoY(largestIncrease).peakPositiveYoYPct)} in ${sameMonthYoY(largestIncrease).peakComparisonLabel}.` : "No positive price increase against the same month in 2025 is available in this filtered view.",
      `${positiveRows.length} of ${countries.length} countries show at least one positive post-February 2026 price increase against the same month in 2025.`,
      noPositiveRows.length ? `${noPositiveRows.length} countries have comparable price data but no positive median increase, so they are treated as caution context rather than headline evidence.` : "No country with comparable price data is negative or flat across all available post-shock comparisons.",
      noMatchedRows.length ? `No comparable price record is available for ${compactCountryList(noMatchedRows)}.` : "All countries in this view have at least one comparable same-month price record.",
      "Do not read this chart as evidence that the Iran-USA escalation caused the price change; local conflict, inflation, access constraints and exchange-rate movement may also explain observed prices.",
    ].forEach((message) => {
      const item = document.createElement("li");
      item.textContent = message;
      el.beforeAfterMessageList.appendChild(item);
    });
  }

  const supp = country.supplementalEvidence || {};
  if (el.beforeAfterSupplementalList) {
    el.beforeAfterSupplementalList.innerHTML = "";
    [
      ["Coverage count", `${supplementalLayerLabel(country)} across additional public-context checks: ACLED, CPI, food incidents, PortWatch and Findex; ${fmtInt(supp.missingLayerCount)} missing.`],
      ["Layer detail", `ACLED availability ${coverageStatusLabel(supp.acledCoverageStatus)}; CPI ${coverageStatusLabel(supp.cpiCoverageStatus)}; food incidents ${coverageStatusLabel(supp.foodIncidentCoverageStatus)}; PortWatch ${coverageStatusLabel(supp.portwatchCoverageStatus)}; Findex ${coverageStatusLabel(supp.findexCoverageStatus)}.`],
      ["How to use it", "Use public-context coverage to explain where extra public data exist. It does not replace or add another published score."],
    ].forEach(([label, value]) => {
      const item = document.createElement("li");
      item.textContent = `${label}: ${value}`;
      el.beforeAfterSupplementalList.appendChild(item);
    });
  }

  if (!el.beforeAfterTableBody) return;
  el.beforeAfterTableBody.innerHTML = "";
  const sortedBeforeAfterRows = [...countries].sort((a, b) => {
    const aYoy = sameMonthYoY(a);
    const bYoy = sameMonthYoY(b);
    const statusOrder = { positive_peak: 0, no_positive_increase: 1, no_matched_yoy_series: 2 };
    const aOrder = statusOrder[aYoy.status] ?? 3;
    const bOrder = statusOrder[bYoy.status] ?? 3;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (aOrder === 0) return numericValue(bYoy.peakPositiveYoYPct) - numericValue(aYoy.peakPositiveYoYPct);
    return a.country.localeCompare(b.country);
  });
  const tableRows = document.body.dataset.page === "overview"
    ? sortedBeforeAfterRows.filter((row) => sameMonthYoY(row).status === "positive_peak").slice(0, 10)
    : sortedBeforeAfterRows;
  if (el.beforeAfterTableNote) {
    el.beforeAfterTableNote.textContent = document.body.dataset.page === "overview"
      ? `Overview table shows the top ${tableRows.length} positive like-for-like price increases only. Price records compared are WFP/HDX market, commodity and unit records matched between a 2026 post-shock month and the same month in 2025. Public-context coverage means five additional public-data checks: ACLED availability, CPI, food incidents, PortWatch port activity and Findex gender-finance data.`
      : `${tableRows.length} countries shown after the active filters. Price records compared are like-for-like WFP/HDX market, commodity and unit records; public-context coverage means five additional public-data checks: ACLED availability, CPI, food incidents, PortWatch port activity and Findex gender-finance data. Rows with no positive rise or no comparable price record are kept as interpretation context.`;
  }
  if (el.beforeAfterCardList) {
    el.beforeAfterCardList.innerHTML = "";
    tableRows.forEach((row) => {
      const ba = row.beforeAfter || {};
      const rowYoy = sameMonthYoY(row);
      el.beforeAfterCardList.appendChild(createMobileTableCard(
        row.country,
        positivePeakLabel(rowYoy),
        [
          ["Compared with", rowYoy.peakComparisonLabel || rowYoy.bestAvailableComparisonLabel || "No comparable price record"],
          ["Price records", matchedSeriesLabel(rowYoy)],
          ["IPC timing", fmtIpcTiming(ba.ipcLatest)],
          ["Context layers", supplementalLayerLabel(row)],
        ]
      ));
    });
  }
  tableRows.forEach((row) => {
    const ba = row.beforeAfter || {};
    const rowYoy = sameMonthYoY(row);
    const tr = document.createElement("tr");
    [
      row.country,
      positivePeakLabel(rowYoy),
      rowYoy.peakComparisonLabel || rowYoy.bestAvailableComparisonLabel || "No comparable price record",
      matchedSeriesLabel(rowYoy),
      fmtIpcTiming(ba.ipcLatest),
      supplementalLayerLabel(row),
    ].forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      tr.appendChild(cell);
    });
    el.beforeAfterTableBody.appendChild(tr);
  });
}

function renderBeforeAfterChart(rows) {
  if (!window.Chart) return;
  destroyChart("beforeAfter");
  const ctx = document.getElementById("before-after-chart");
  if (!ctx) return;
  const chartRows = rows.slice(0, 10);
  if (!chartRows.length) return;
  const maxValue = Math.max(...chartRows.map((row) => numericValue(sameMonthYoY(row).peakPositiveYoYPct) || 0));
  charts.beforeAfter = new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartRows.map((row) => row.country),
      datasets: [
        {
          label: "Highest positive price comparison vs 2025",
          data: chartRows.map((row) => sameMonthYoY(row).peakPositiveYoYPct),
          backgroundColor: chartRows.map((row, index) => {
            if (row.iso3 === state.selectedIso) return COLORS.navy;
            return index < 4 ? COLORS.gold : COLORS.neutralLight;
          }),
          borderRadius: 2,
        },
      ],
    },
    plugins: [barValueLabelPlugin],
    options: baseChartOptions({
      indexAxis: "y",
      layout: { padding: { right: 48 } },
      plugins: {
        barValueLabel: {
          maxLabels: 4,
          formatter: (value) => fmtSignedPct(value),
        },
      },
      scales: {
        x: {
          min: 0,
          suggestedMax: Math.max(40, Math.ceil(maxValue / 10) * 10),
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont(), callback: (value) => `${value}%` },
          title: { display: true, text: "Median price change vs same month in 2025", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont(), autoSkip: false },
        },
      },
      onClick: (_event, elements) => {
        const element = elements?.[0];
        if (!element) return;
        state.selectedIso = chartRows[element.index].iso3;
        populateCountrySelect();
        renderAll();
      },
    }),
  });
}

function renderRankingChart() {
  if (!window.Chart) return;
  destroyChart("ranking");
  const countries = filteredCountries();
  const selected = state.selectedIso;
  const ctx = document.getElementById("ranking-chart");
  if (!ctx) return;
  charts.ranking = new Chart(ctx, {
    type: "bar",
    data: {
      labels: countries.map((country) => country.country),
      datasets: [
        {
          label: "Shock Exposure Index",
          data: countries.map((country) => country.score),
          backgroundColor: countries.map((country, index) => {
            if (country.iso3 === selected) return COLORS.navy;
            if (index < 2) return COLORS.red;
            if (country.riskTier === "High") return COLORS.gold;
            return COLORS.neutralLight;
          }),
          borderColor: countries.map(confidenceBorderColor),
          borderWidth: countries.map(confidenceBorderWidth),
          borderRadius: 2,
        },
      ],
    },
    plugins: [barValueLabelPlugin],
    options: baseChartOptions({
      indexAxis: "y",
      layout: { padding: { right: 44 } },
      plugins: {
        barValueLabel: {
          maxLabels: 3,
          formatter: (value) => fmt(value, 1),
        },
        tooltip: {
          backgroundColor: COLORS.navy,
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (context) => {
              const country = countries[context.dataIndex];
              const confidence = country?.dataConfidence?.level ? `; confidence: ${country.dataConfidence.level}` : "";
              const missing = country?.componentMissingCount ? `; ${country.componentMissingCount} missing/neutral component(s)` : "";
              return `${fmt(context.parsed.x)} points${confidence}${missing}`;
            },
          },
        },
      },
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Score, 0-100", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont(), autoSkip: false },
        },
      },
      onClick: (_event, elements) => {
        const element = elements?.[0];
        if (!element) return;
        state.selectedIso = countries[element.index].iso3;
        populateCountrySelect();
        renderAll();
      },
    }),
  });
}

function renderRankingConfidence() {
  if (!el.rankingConfidenceList) return;
  const flagged = filteredCountries()
    .filter((country) => ["Limited", "Partial"].includes(country.dataConfidence?.level))
    .slice(0, 8);
  el.rankingConfidenceList.innerHTML = "";
  if (!flagged.length) {
    const item = document.createElement("span");
    item.className = "confidence-pill";
    item.dataset.confidence = "Stronger";
    item.textContent = "No limited or partial data-confidence flags in this filtered view";
    el.rankingConfidenceList.appendChild(item);
    return;
  }
  const intro = document.createElement("span");
  intro.className = "confidence-label";
  intro.textContent = "Missing/neutral-input flags";
  el.rankingConfidenceList.appendChild(intro);
  flagged.forEach((country) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "confidence-pill";
    item.dataset.confidence = country.dataConfidence.level;
    item.title = country.dataConfidence.note || "";
    item.textContent = country.country;
    item.addEventListener("click", () => {
      state.selectedIso = country.iso3;
      populateCountrySelect();
      renderAll();
    });
    el.rankingConfidenceList.appendChild(item);
  });
}

function renderCountryProfile() {
  if (!hasElement(el.countryRegion, el.countryName, el.countryScore, el.countryScoreFill, el.countryTier, el.countryRank, el.countryProxyRank, el.countryMissing, el.countryConfidence, el.pathwayList, el.countryFocus)) return;
  const country = countryByIso(state.selectedIso);
  el.countryRegion.textContent = `${country.region} | ${countryGeography(country)}`;
  el.countryName.textContent = country.country;
  el.countryScore.textContent = fmt(country.score);
  el.countryScoreFill.style.width = `${clamp(country.score)}%`;
  el.countryTier.textContent = country.riskTier || "n/a";
  el.countryRank.textContent = country.rank ? `#${country.rank}` : "n/a";
  el.countryProxyRank.textContent = fmtPct(country.indicators?.ipcPhase3PlusPct);
  el.countryMissing.textContent = fmtInt(country.componentMissingCount);
  el.countryConfidence.textContent = country.dataConfidence?.level || "n/a";
  el.countryConfidence.parentElement.dataset.confidence = country.dataConfidence?.level || "";
  el.countryConfidence.parentElement.title = country.dataConfidence?.note || "";
  el.countryFocus.textContent = "Use the raw evidence table below to explain the country context. The headline score remains the official Shock Exposure Index.";

  renderImputationPanel(country);

  el.pathwayList.innerHTML = "";
  [
    ["IPC Phase 3+", `${fmtPct(country.indicators?.ipcPhase3PlusPct)} (${fmtCompact(country.indicators?.ipcPhase3PlusNumber)} people)`],
    ["IDMC conflict IDPs", fmtCompact(country.indicators?.idmcConflictTotalDisplacement)],
    ["Peak food-price increase", positivePeakLabel(sameMonthYoY(country))],
  ].forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "pathway-item raw-profile-item";
    const text = document.createElement("div");
    const title = document.createElement("div");
    title.className = "pathway-label";
    title.textContent = label;
    text.appendChild(title);
    const detail = document.createElement("div");
    detail.className = "pathway-score";
    detail.textContent = value || "n/a";
    item.append(text, detail);
    el.pathwayList.appendChild(item);
  });
}

function renderImputationPanel(country) {
  if (!hasElement(el.countryImputationPanel, el.countryImputationCount, el.countryImputationList, el.countryImputationNote)) return;
  const missingComponents = Array.isArray(country.missingComponents) ? country.missingComponents : [];
  const warningText = country.dataConfidence?.warnings?.filter((warning) => !/score component/i.test(warning)).join("; ");
  el.countryImputationCount.textContent = missingComponents.length
    ? `${fmtInt(missingComponents.length)} flagged`
    : "None flagged";
  el.countryImputationList.innerHTML = "";

  if (!missingComponents.length) {
    const item = document.createElement("li");
    item.textContent = "No missing-input score components are flagged for this country in the published calculation.";
    el.countryImputationList.appendChild(item);
    el.countryImputationPanel.dataset.status = "complete";
  } else {
    missingComponents.forEach((component) => {
      const item = document.createElement("li");
      const label = document.createElement("strong");
      label.textContent = component.label || component.key || "Missing component";
      const detail = document.createElement("span");
      detail.textContent = component.interpretation || "Source input is missing or unavailable; use the score with data-confidence caution.";
      item.append(label, detail);
      el.countryImputationList.appendChild(item);
    });
    el.countryImputationPanel.dataset.status = "flagged";
  }

  el.countryImputationNote.textContent = warningText
    ? `Additional data-quality notes: ${warningText}.`
    : "These flags identify missing inputs used by the composite score; they are not evidence that the issue is absent.";
}

function renderComponentChart() {
  if (!window.Chart) return;
  destroyChart("component");
  const ctx = document.getElementById("component-chart");
  if (!ctx) return;
  const country = countryByIso(state.selectedIso);
  const entries = Object.entries(data.componentLabels).map(([key, label]) => ({
    key,
    label,
    value: country.components[key],
  }));
  charts.component = new Chart(ctx, {
    type: "bar",
    data: {
      labels: entries.map((entry) => entry.label),
      datasets: [
        {
          label: country.country,
          data: entries.map((entry) => entry.value),
          backgroundColor: entries.map((entry) => (entry.key === "gender_vulnerability_score" ? COLORS.red : COLORS.blue)),
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      indexAxis: "y",
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Average Shock Exposure Index, 0-100", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
    }),
  });
}

function rawEvidenceRows(country) {
  const yoy = sameMonthYoY(country);
  return [
    ["Peak food-price increase", positivePeakLabel(yoy), yoy.peakComparisonLabel || yoy.bestAvailableComparisonLabel || "Matched WFP/HDX same-month comparison"],
    ["Price records compared", matchedSeriesLabel(yoy), "Like-for-like market, commodity and unit records at peak comparison"],
    ["Median price change since baseline", fmtSignedPct(country.indicators?.medianPriceChangeSinceBaselinePct), `${fmtInt(country.indicators?.comparableSeries)} comparable WFP/HDX series`],
    ["IPC Phase 3+ population", `${fmtPct(country.indicators?.ipcPhase3PlusPct)} (${fmtCompact(country.indicators?.ipcPhase3PlusNumber)} people)`, "Total-population IPC severity, not sex-disaggregated"],
    ["IPC Phase 4+ population", `${fmtPct(country.indicators?.ipcPhase4PlusPct)} (${fmtCompact(country.indicators?.ipcPhase4PlusNumber)} people)`, "Total-population IPC severity where available"],
    ["WFP poor/borderline food consumption", fmtPct(country.indicators?.wfpPoorBorderlineFoodConsumptionPct), "Public WFP outcome field where available"],
    ["WFP rCSI mean", fmt(country.indicators?.wfpRcsiMean, 1), "Public WFP coping indicator where available"],
    ["IDMC conflict IDPs", fmtCompact(country.indicators?.idmcConflictTotalDisplacement), "Public IDMC conflict displacement stock"],
    ["IOM selected DTM IDPs", fmtCompact(country.indicators?.iomLatestIdpSum), "Selected public IOM DTM summary rows"],
    ["Post-shock displacement figure", fmtCompact(country.indicators?.idmcPostShockConflictFigureTotal), "Selected IDMC post-shock conflict figure where available"],
    ["Humanitarian funding flows", fmtUsd(country.indicators?.destinationFundingUsd), "OCHA FTS destination-country flow total"],
    ["Food/nutrition funding per IPC 3+ person", fmtUsd(country.indicators?.foodNutritionFundingPerIpc3PlusUsd), "OCHA FTS food/nutrition/multi-sector funding divided by IPC Phase 3+ population"],
    ["Imports as share of GDP", fmtPct(country.indicators?.importsGdpPct), "World Bank/WDI structural exposure"],
    ["Food imports share of merchandise imports", fmtPct(country.indicators?.foodImportsMerchandisePct), "Food import reliance indicator"],
    ["Fuel imports share of merchandise imports", fmtPct(country.indicators?.fuelImportsMerchandisePct), "Fuel import reliance indicator"],
    ["Agriculture value added", fmtPct(country.indicators?.agricultureValueAddedGdpPct), "Agriculture share of GDP"],
    ["Cereal import dependency", fmtPct(country.indicators?.cerealImportDependencyPct), "FAOSTAT food-system exposure"],
    ["Fertilizer import dependency", fmtPct(country.indicators?.fertilizerImportDependencyPct), "FAOSTAT fertilizer exposure"],
    ["Female informal employment", fmtPct(country.informality?.femaleInformalEmploymentPct), country.informality?.femaleInformalEmploymentYear ? `ILOSTAT/proxy year ${country.informality.femaleInformalEmploymentYear}` : "ILOSTAT/proxy coverage varies"],
    ["Female vulnerable employment", fmtPct(country.indicators?.femaleVulnerableEmploymentPct), "Structural labour-market indicator"],
    ["Female agricultural employment", fmtPct(country.indicators?.femaleAgricultureEmploymentPct), "Female employment exposure to agriculture"],
    ["Female labour force participation", fmtPct(country.indicators?.femaleLaborForceParticipationPct), "Structural labour-market indicator"],
    ["Women account ownership", fmtPct(country.genderFinance?.accountWomenPct ?? country.indicators?.femaleAccountOwnershipPct), country.genderFinance?.latestYear ? `Findex ${country.genderFinance.latestYear}` : "Findex coverage varies"],
    ["Women mobile money account", fmtPct(country.genderFinance?.mobileMoneyWomenPct), "Findex financial-access indicator where available"],
    ["Women formal/mobile saving", fmtPct(country.genderFinance?.formalOrMobileSavingWomenPct), "Findex coping/resilience context where available"],
    ["Women receiving wages", fmtPct(country.genderFinance?.receivedWagesWomenPct), "Findex income-channel indicator where available"],
    ["Women receiving government payments", fmtPct(country.genderFinance?.receivedGovernmentPaymentsWomenPct), "Findex assistance/payment-channel context where available"],
    ["Female-headed households", fmtPct(country.indicators?.femaleHeadedHouseholdsPct), country.indicators?.femaleHeadedHouseholdsYear ? `World Bank year ${country.indicators.femaleHeadedHouseholdsYear}` : "Coverage varies"],
  ];
}

function createRawEvidenceTable(rows) {
  const table = document.createElement("table");
  table.className = "indicator-mini-table-inner raw-evidence-table";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Raw indicator</th><th>Value</th><th>Source / interpretation note</th></tr>";
  const tbody = document.createElement("tbody");
  const visibleRows = rows.filter(([, value]) => !isUnavailableText(value));
  const rowsToRender = visibleRows.length ? visibleRows : [["No available values", "Not available", "Selected public fields are unavailable for this country in the current pull."]];
  rowsToRender.forEach(([label, value, note]) => {
    const row = document.createElement("tr");
    [label, value, note].forEach((text) => {
      const cell = document.createElement("td");
      cell.textContent = text || "n/a";
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
  table.append(thead, tbody);
  return table;
}

function renderRawEvidenceTable() {
  if (!el.rawEvidenceTable) return;
  const country = countryByIso(state.selectedIso);
  const rows = rawEvidenceRows(country);
  const availableRows = rows.filter(([, value]) => !isUnavailableText(value));
  const hiddenUnavailableCount = rows.length - availableRows.length;
  el.rawEvidenceTable.innerHTML = "";

  const summaryIntro = document.createElement("p");
  summaryIntro.className = "mini-table-intro";
  summaryIntro.textContent = hiddenUnavailableCount
    ? `Available raw indicators are shown; ${fmtInt(hiddenUnavailableCount)} unavailable field(s) are hidden to reduce n/a noise.`
    : "All available raw fields used for context and source traceability are shown.";
  el.rawEvidenceTable.appendChild(summaryIntro);
  el.rawEvidenceTable.appendChild(createRawEvidenceTable(availableRows));
}

function renderScenarioChart() {
  if (!window.Chart) return;
  destroyChart("scenario");
  const ctx = document.getElementById("scenario-chart");
  if (!ctx) return;
  const scenarioRows = data.scenarios
    .filter((row) => row.scenario === state.scenario)
    .filter((row) => {
      const country = countryByIso(row.countryiso3);
      return matchesRegion(country) && matchesGeography(country);
    })
    .sort((a, b) => (b.risk_delta_0_100 || 0) - (a.risk_delta_0_100 || 0))
    .slice(0, 10);

  const selectedRow = data.scenarios.find((row) => row.scenario === state.scenario && row.countryiso3 === state.selectedIso);
  if (el.scenarioTitle) el.scenarioTitle.textContent = `${scenarioLabel(state.scenario)}: countries most sensitive`;
  if (el.scenarioSelectedDelta) el.scenarioSelectedDelta.textContent = selectedRow ? `${fmt(selectedRow.risk_delta_0_100)} points` : "n/a";
  if (el.scenarioSelectedScore) el.scenarioSelectedScore.textContent = selectedRow ? `${fmt(selectedRow.scenario_score_0_100)} (${selectedRow.scenario_risk_tier || "tier n/a"})` : "n/a";
  if (el.scenarioSelectedRank) el.scenarioSelectedRank.textContent = selectedRow?.scenario_rank ? `#${selectedRow.scenario_rank}` : "n/a";
  if (el.scenarioNote) {
    el.scenarioNote.textContent = selectedRow
      ? `${countryByIso(state.selectedIso).country} is summarized above. The bars show point movement from the published baseline score under the selected stress test; larger deltas mean higher scenario sensitivity, not a forecast.`
      : "No scenario row available for the selected country.";
  }

  charts.scenario = new Chart(ctx, {
    type: "bar",
    data: {
      labels: scenarioRows.map((row) => row.country),
      datasets: [
        {
          label: "Sensitivity delta",
          data: scenarioRows.map((row) => row.risk_delta_0_100),
          backgroundColor: scenarioRows.map((row, index) => {
            if (row.countryiso3 === state.selectedIso) return COLORS.navy;
            return index < 3 ? COLORS.gold : COLORS.neutralLight;
          }),
          borderRadius: 2,
        },
      ],
    },
    plugins: [barValueLabelPlugin],
    options: baseChartOptions({
      indexAxis: "y",
      layout: { padding: { right: 44 } },
      plugins: {
        barValueLabel: {
          maxLabels: 3,
          formatter: (value) => fmt(value, 1),
        },
      },
      scales: {
        x: {
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Score movement from baseline, points", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
    }),
  });
}

function renderRegionChart() {
  if (!window.Chart) return;
  destroyChart("region");
  const ctx = document.getElementById("region-chart");
  if (!ctx) return;
  const grouped = data.countries
    .filter(matchesGeography)
    .reduce((acc, country) => {
      if (!acc[country.region]) acc[country.region] = { region: country.region, countryCount: 0, scoreTotal: 0 };
      acc[country.region].countryCount += 1;
      acc[country.region].scoreTotal += Number(country.score) || 0;
      return acc;
    }, {});
  const rows = Object.values(grouped)
    .map((row) => ({ ...row, averageScore: row.countryCount ? row.scoreTotal / row.countryCount : 0 }))
    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
  charts.region = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.region),
      datasets: [
        {
          data: rows.map((row) => row.averageScore),
          backgroundColor: rows.map((row, index) => (row.region === state.region || index === 0 ? COLORS.teal : COLORS.neutralLight)),
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      indexAxis: "y",
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
      onClick: (_event, elements) => {
        const element = elements?.[0];
        if (!element) return;
        state.region = rows[element.index].region;
        populateControls();
        renderAll();
      },
    }),
  });
}

function renderFemaleIndicatorChart({ chartKey, canvasId, valueGetter, color, xAxisTitle, sortDirection = "desc" }) {
  if (!window.Chart) return;
  destroyChart(chartKey);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  const rows = filteredCountries()
    .map((country) => ({ country, value: numericValue(valueGetter(country)) }))
    .filter((row) => row.value !== null)
    .sort((a, b) => (sortDirection === "asc" ? a.value - b.value : b.value - a.value))
    .slice(0, 10);
  charts[chartKey] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.country.country),
      datasets: [
        {
          data: rows.map((row) => row.value),
          backgroundColor: rows.map((_row, index) => (index < 3 ? color : COLORS.neutralLight)),
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      indexAxis: "y",
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: xAxisTitle, color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
    }),
  });
}

function renderGenderChart() {
  renderFemaleIndicatorChart({
    chartKey: "gender",
    canvasId: "gender-chart",
    valueGetter: (country) => country.informality?.femaleInformalEmploymentPct,
    color: COLORS.red,
    xAxisTitle: "Female informal employment, %",
  });
}

function renderFemaleVulnerableChart() {
  renderFemaleIndicatorChart({
    chartKey: "femaleVulnerable",
    canvasId: "female-vulnerable-chart",
    valueGetter: (country) => country.indicators?.femaleVulnerableEmploymentPct,
    color: COLORS.gold,
    xAxisTitle: "Female vulnerable employment, %",
  });
}

function renderFemaleLabourForceChart() {
  renderFemaleIndicatorChart({
    chartKey: "femaleLabourForce",
    canvasId: "female-labour-force-chart",
    valueGetter: (country) => {
      const value = numericValue(country.indicators?.femaleLaborForceParticipationPct);
      return value === null ? null : 100 - value;
    },
    color: COLORS.blue,
    xAxisTitle: "Low participation gap: 100 - female LFPR, percentage points",
  });
}

function renderFemaleAgricultureChart() {
  renderFemaleIndicatorChart({
    chartKey: "femaleAgriculture",
    canvasId: "female-agriculture-chart",
    valueGetter: (country) => country.indicators?.femaleAgricultureEmploymentPct,
    color: COLORS.teal,
    xAxisTitle: "Female agricultural employment, %",
  });
}

function renderGenderDriverChart() {
  if (!window.Chart) return;
  destroyChart("genderDrivers");
  const ctx = document.getElementById("gender-driver-chart");
  if (!ctx) return;
  const country = countryByIso(state.selectedIso);
  if (el.genderDriverTitle) el.genderDriverTitle.textContent = `${country.country}: raw gender and finance indicators`;
  const entries = [
    { label: "Female informal employment", value: country.informality?.femaleInformalEmploymentPct, color: COLORS.red },
    { label: "Female vulnerable employment", value: country.indicators?.femaleVulnerableEmploymentPct, color: COLORS.gold },
    { label: "Female agricultural employment", value: country.indicators?.femaleAgricultureEmploymentPct, color: COLORS.teal },
    { label: "Female labour force participation", value: country.indicators?.femaleLaborForceParticipationPct, color: COLORS.blue },
    { label: "Women account ownership", value: country.genderFinance?.accountWomenPct ?? country.indicators?.femaleAccountOwnershipPct, color: COLORS.navy },
    { label: "Women mobile money account", value: country.genderFinance?.mobileMoneyWomenPct, color: COLORS.neutral },
  ].filter((entry) => numericValue(entry.value) !== null);
  charts.genderDrivers = new Chart(ctx, {
    type: "bar",
    data: {
      labels: entries.map((entry) => entry.label),
      datasets: [
        {
          label: country.country,
          data: entries.map((entry) => entry.value),
          backgroundColor: entries.map((entry) => entry.color),
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      indexAxis: "y",
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Percent of women or female employment", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
    }),
  });
}

function renderGenderDecompositionChart() {
  if (!window.Chart) return;
  destroyChart("genderDecomposition");
  const ctx = document.getElementById("gender-decomposition-chart");
  if (!ctx) return;
  const country = countryByIso(state.selectedIso);
  const rows = genderProxyContributionRows(country)
    .sort((a, b) => (b.points || 0) - (a.points || 0));
  renderDecompositionTable(
    el.genderDecompositionTable,
    rows.map((row) => ({
      label: row.label,
      scoreText: row.inputScale === "0-100" ? `${fmt(row.inputValue)} / 100` : fmt(row.inputValue, 2),
      weightText: fmtShare(row.coefficient, 0),
      pointsText: `${fmt(row.points)} pts`,
    })),
    {
      total: rows.reduce((sum, row) => sum + (numericValue(row.points) || 0), 0),
      finalScore: country.genderProxy?.score,
      finalLabel: "Internal gender-priority proxy",
      finalNote: "Traceability field; not a current user-facing dashboard score.",
      note: "Component inputs use full precision in the generated dashboard data.",
    }
  );
  charts.genderDecomposition = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.label),
      datasets: [
        {
          label: "Contribution points",
          data: rows.map((row) => row.points),
          backgroundColor: rows.map((row) => row.color),
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      indexAxis: "y",
      scales: {
        x: {
          min: 0,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Internal gender-priority proxy points", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${fmt(context.parsed.x)} points`,
          },
        },
      },
    }),
  });
}

function renderIndexDecompositionChart() {
  if (!window.Chart) return;
  destroyChart("indexDecomposition");
  const ctx = document.getElementById("index-decomposition-chart");
  if (!ctx) return;
  const country = countryByIso(state.selectedIso);
  const missingKeys = missingComponentKeySet(country);
  const rows = indexContributionRows(country)
    .map((row) => ({ ...row, imputed: missingKeys.has(row.key) }))
    .sort((a, b) => (b.points || 0) - (a.points || 0));
  renderDecompositionTable(
    el.indexDecompositionTable,
    rows.map((row) => ({
      label: row.label,
      scoreText: row.imputed ? `${fmt(row.componentScore, 2)} (neutral/imputed)` : fmt(row.componentScore, 2),
      weightText: fmtShare(row.weight, 0),
      pointsText: `${fmt(row.points)} pts`,
      imputed: row.imputed,
    })),
    {
      total: rows.reduce((sum, row) => sum + (numericValue(row.points) || 0), 0),
      finalScore: country.score,
      finalLabel: "Published Shock Exposure Index",
      finalNote: "Final country score after full-precision calculation and rounding.",
      note: "Formula: component score x component weight x 100. Rows marked neutral/imputed use missing public inputs.",
    }
  );
  charts.indexDecomposition = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.label),
      datasets: [
        {
          label: "Weighted index points",
          data: rows.map((row) => row.points),
          backgroundColor: rows.map((row) => (row.imputed ? COLORS.neutralLight : row.color)),
          borderColor: rows.map((row) => (row.imputed ? COLORS.gold : "rgba(0, 0, 0, 0)")),
          borderWidth: rows.map((row) => (row.imputed ? 2 : 0)),
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      indexAxis: "y",
      scales: {
        x: {
          min: 0,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Points in 0-100 Shock Exposure Index", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${fmt(context.parsed.x)} points`,
          },
        },
      },
    }),
  });
}

function renderGenderLensList() {
  if (!el.genderLensList) return;
  el.genderLensList.innerHTML = "";
  const country = countryByIso(state.selectedIso);
  appendLensItem(
    el.genderLensList,
    "Female informal employment",
    fmtPct(country.informality?.femaleInformalEmploymentPct),
    country.informality?.proxyUsed || "ILOSTAT/proxy coverage varies."
  );
  appendLensItem(
    el.genderLensList,
    "Female vulnerable/agricultural employment",
    `${fmtPct(country.indicators?.femaleVulnerableEmploymentPct)} vulnerable | ${fmtPct(country.indicators?.femaleAgricultureEmploymentPct)} agriculture`,
    "Raw structural labour indicators for country-team interpretation."
  );
  appendLensItem(
    el.genderLensList,
    "Women financial access",
    `${fmtPct(country.genderFinance?.accountWomenPct ?? country.indicators?.femaleAccountOwnershipPct)} account ownership | ${fmtPct(country.genderFinance?.mobileMoneyWomenPct)} mobile money`,
    "Findex indicators are shown directly where available."
  );
  const sexDisaggregatedAvailable = data.countries.filter((country) => country.readiness?.sexDisaggregatedOutcomeAvailable).length;
  appendLensItem(
    el.genderLensList,
    "Measured women/girls outcome coverage",
    `${fmtInt(sexDisaggregatedAvailable)}/${fmtInt(data.countries.length)} countries`,
    "Public IPC rows are total-population severity; the dashboard does not infer women/girls IPC counts."
  );
}

function renderGenderMonitoringList() {
  if (!el.genderMonitoringList) return;
  el.genderMonitoringList.innerHTML = "";
  const country = countryByIso(state.selectedIso);
  appendLensItem(
    el.genderMonitoringList,
    "Use",
    "Read raw indicators alongside the Shock Exposure Index",
    `${country.country}'s raw IPC, displacement, assistance and gender/labour indicators should guide what country teams validate next.`
  );
  appendLensItem(
    el.genderMonitoringList,
    "Ask for",
    "Sex-disaggregated outcomes",
    "Request sex- and age-disaggregated FCS, rCSI, LCS, assistance reach, access constraints and female-headed household outcomes before making impact claims."
  );
  appendLensItem(
    el.genderMonitoringList,
    "Do not claim",
    "Causal gender impact",
    "These are structural/proxy indicators for screening. They do not estimate how many women or girls became food insecure."
  );
}

function renderDisplacementClarity() {
  if (!el.displacementClarityList) return;
  el.displacementClarityList.innerHTML = "";

  const displacementRows = [...data.countries].sort((a, b) => {
    const aMax = Math.max(
      numericValue(a.indicators?.idmcConflictTotalDisplacement) || 0,
      numericValue(a.indicators?.iomLatestIdpSum) || 0,
      numericValue(a.indicators?.idmcPostShockConflictFigureTotal) || 0
    );
    const bMax = Math.max(
      numericValue(b.indicators?.idmcConflictTotalDisplacement) || 0,
      numericValue(b.indicators?.iomLatestIdpSum) || 0,
      numericValue(b.indicators?.idmcPostShockConflictFigureTotal) || 0
    );
    if (bMax !== aMax) return bMax - aMax;
    return a.country.localeCompare(b.country);
  });
  if (!displacementRows.length) return;

  const tableBlock = document.createElement("div");
  tableBlock.className = "displacement-compare-block";
  appendText(tableBlock, "h3", "Public displacement evidence by country");
  appendText(
    tableBlock,
    "p",
    `All ${fmtInt(displacementRows.length)} countries are shown. n/a means no public value is available in the current dashboard pull.`,
    "displacement-source-note"
  );

  const table = document.createElement("table");
  table.className = "displacement-compare-table";
  const labels = ["Country", "IDMC conflict IDPs", "IOM selected DTM IDPs", "Post-shock displacement figure"];
  const appendDisplacementCell = (row, text, label, className = "") => {
    const cell = appendTableCell(row, text, "td", className);
    cell.dataset.label = label;
    return cell;
  };
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  labels.forEach((label) => appendTableCell(header, label, "th"));
  thead.appendChild(header);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  displacementRows.forEach((country) => {
    const idmc = numericValue(country.indicators?.idmcConflictTotalDisplacement);
    const iom = numericValue(country.indicators?.iomLatestIdpSum);
    const postShock = numericValue(country.indicators?.idmcPostShockConflictFigureTotal);

    const row = document.createElement("tr");
    appendDisplacementCell(row, country.country, labels[0]);
    appendDisplacementCell(row, idmc === null ? "n/a" : fmtCompact(idmc), labels[1], "numeric");
    appendDisplacementCell(row, iom === null ? "n/a" : fmtCompact(iom), labels[2], "numeric");
    appendDisplacementCell(row, postShock === null ? "n/a" : fmtCompact(postShock), labels[3], "numeric");
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  tableBlock.appendChild(table);
  el.displacementClarityList.appendChild(tableBlock);
}

function renderCountryGenderLens() {
  if (!el.countryGenderList) return;
  const country = countryByIso(state.selectedIso);
  el.countryGenderList.innerHTML = "";
  appendLensItem(
    el.countryGenderList,
    "IPC input",
    `${fmtPct(country.indicators?.ipcPhase3PlusPct)} Phase 3+ total population (${fmtCompact(country.indicators?.ipcPhase3PlusNumber)} people)`,
    "IPC is used, but the public IPC pull is not sex-disaggregated."
  );
  appendLensItem(
    el.countryGenderList,
    "Internal displacement evidence",
    `${fmtCompact(country.indicators?.idmcConflictTotalDisplacement)} IDMC conflict IDPs; ${fmtCompact(country.indicators?.iomLatestIdpSum)} IOM selected DTM IDPs where available.`
  );
  appendLensItem(
    el.countryGenderList,
    "Assistance/funding evidence",
    `${fmtUsd(country.indicators?.destinationFundingUsd)} destination funding; ${fmtUsd(country.indicators?.foodNutritionFundingPerIpc3PlusUsd)} food/nutrition funding per IPC Phase 3+ person`,
    "FTS funding fields do not fully measure assistance reach, ration size or access constraints."
  );
  appendLensItem(
    el.countryGenderList,
    "Female labour and household indicators",
    `${fmtPct(country.informality?.femaleInformalEmploymentPct)} informal employment | ${fmtPct(country.indicators?.femaleHeadedHouseholdsPct)} female-headed households`,
    "Use as structural vulnerability evidence and a prompt for field validation, not as measured food-security impact."
  );
}

function renderCountryGenderIndicators() {
  if (!el.countryGenderIndicatorTable) return;
  const country = countryByIso(state.selectedIso);
  const rows = [
    ["Female informal employment", fmtPct(country.informality?.femaleInformalEmploymentPct), country.informality?.proxyUsed || "ILOSTAT/proxy status not available"],
    ["Female vulnerable employment", fmtPct(country.indicators?.femaleVulnerableEmploymentPct), "Structural labour vulnerability indicator"],
    ["Female agricultural employment", fmtPct(country.indicators?.femaleAgricultureEmploymentPct), "Agriculture/fertilizer shock exposure context"],
    ["Female labour force participation", fmtPct(country.indicators?.femaleLaborForceParticipationPct), "Structural economic participation context"],
    ["Women account ownership", fmtPct(country.genderFinance?.accountWomenPct ?? country.indicators?.femaleAccountOwnershipPct), country.genderFinance?.latestYear ? `Findex ${country.genderFinance.latestYear}` : "Findex/account coverage varies"],
    ["Women mobile money account", fmtPct(country.genderFinance?.mobileMoneyWomenPct), "Findex financial access context"],
    ["Women formal/mobile saving", fmtPct(country.genderFinance?.formalOrMobileSavingWomenPct), "Findex resilience/coping context"],
    ["Women receiving wages", fmtPct(country.genderFinance?.receivedWagesWomenPct), "Findex income-channel context"],
    ["Women receiving government payments", fmtPct(country.genderFinance?.receivedGovernmentPaymentsWomenPct), "Findex assistance/payment-channel context"],
    ["Women digital bill payment", fmtPct(country.genderFinance?.digitalBillPaymentWomenPct), "Findex digital access context"],
    ["Female-headed households", fmtPct(country.indicators?.femaleHeadedHouseholdsPct), country.indicators?.femaleHeadedHouseholdsYear ? `Latest year ${country.indicators.femaleHeadedHouseholdsYear}` : "Coverage varies"],
  ];
  const availableRows = rows.filter(([, value]) => !isUnavailableText(value));
  const hiddenUnavailableCount = rows.length - availableRows.length;
  el.countryGenderIndicatorTable.innerHTML = "";
  const intro = document.createElement("p");
  intro.className = "mini-table-intro";
  intro.textContent = hiddenUnavailableCount
    ? `${fmtInt(availableRows.length)} available gender/labour/financial-access indicator(s) shown; ${fmtInt(hiddenUnavailableCount)} unavailable field(s) hidden.`
    : `${fmtInt(availableRows.length)} available gender/labour/financial-access indicator(s) shown.`;
  el.countryGenderIndicatorTable.appendChild(intro);
  const table = document.createElement("table");
  table.className = "indicator-mini-table-inner";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Indicator</th><th>Value</th><th>How to read it</th></tr>";
  const tbody = document.createElement("tbody");
  availableRows.forEach(([label, value, note]) => {
    const tr = document.createElement("tr");
    [label, value, note].forEach((text) => {
      const cell = document.createElement("td");
      cell.textContent = text || "n/a";
      tr.appendChild(cell);
    });
    tbody.appendChild(tr);
  });
  table.append(thead, tbody);
  el.countryGenderIndicatorTable.appendChild(table);
}

function renderReadiness() {
  if (!el.readinessList) return;
  const country = countryByIso(state.selectedIso);
  const items = [
    ["Price event-study setup", country.readiness.priceEventStudy],
    ["Food-security outcome model", country.readiness.foodSecurityOutcome],
    ["Women/girls causal-impact analysis", country.readiness.genderCausal],
    ["Main data gap", country.readiness.mainGap],
  ];
  el.readinessList.innerHTML = "";
  items.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "readiness-item";
    const strong = document.createElement("strong");
    strong.textContent = label;
    const span = document.createElement("span");
    span.textContent = value || "n/a";
    item.appendChild(strong);
    item.appendChild(span);
    el.readinessList.appendChild(item);
  });
}

function renderCoverage() {
  if (!el.coverageList) return;
  const country = countryByIso(state.selectedIso);
  const c = country.additionalCoverage;
  const fhhPct = country.indicators?.femaleHeadedHouseholdsPct;
  const fhhYear = country.indicators?.femaleHeadedHouseholdsYear;
  const items = [
    ["IDMC annual internal displacement", c.idmcAnnualAvailable ? `${fmtCompact(c.idmcConflictTotalDisplacement)} conflict IDPs, ${c.idmcLatestYear || "latest year n/a"}` : "Not available in public pull"],
    ["IDMC 2026 displacement events", c.idmcEventsAvailable ? `${fmtCompact(c.idmcPostShockFigureTotal)} post-shock figure total` : "Not available in public pull"],
    ["IOM DTM public summary", c.iomDtmAvailable ? `${fmtCompact(c.iomLatestIdpSum)} latest selected IDP sum` : "Not available in public pull"],
    ["WFP public food-security outcomes", c.wfpFsiAvailable ? `${fmtShare(c.wfpPoorBorderlineFoodConsumptionPct)} poor/borderline food consumption` : "Not available in public pull"],
    ["Female-headed households", fhhPct !== null && fhhPct !== undefined ? `${fmtPct(fhhPct)} households, ${fhhYear || "latest year n/a"}` : "Not available in the World Bank FHH pull"],
  ];
  el.coverageList.innerHTML = "";
  items.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "coverage-item";
    const strong = document.createElement("strong");
    strong.textContent = label;
    const span = document.createElement("span");
    span.textContent = value || "n/a";
    item.appendChild(strong);
    item.appendChild(span);
    el.coverageList.appendChild(item);
  });
}

function renderSourceCoverageHeatmap() {
  if (!el.sourceCoverageHeatmap && !el.sourceCoverageSummary) return;
  const countries = [...data.countries].sort((a, b) => (a.rank || 999) - (b.rank || 999));
  const sourceRows = sourceCoverageRows(countries[0] || {});

  if (el.sourceCoverageSummary) {
    el.sourceCoverageSummary.innerHTML = "";
    sourceRows.forEach((source) => {
      const counts = countries.reduce((acc, country) => {
        const row = sourceCoverageRows(country).find((item) => item.key === source.key);
        const status = row?.status || "missing";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, { available: 0, partial: 0, missing: 0 });
      const item = document.createElement("div");
      item.className = "source-summary-card";
      const title = document.createElement("strong");
      title.textContent = source.shortLabel;
      const detail = document.createElement("span");
      detail.textContent = `${fmtInt(counts.available || 0)} available, ${fmtInt(counts.missing || 0)} missing`;
      item.append(title, detail);
      el.sourceCoverageSummary.appendChild(item);
    });
  }

  if (!el.sourceCoverageHeatmap) return;
  el.sourceCoverageHeatmap.innerHTML = "";

  const header = document.createElement("div");
  header.className = "source-coverage-row source-coverage-header";
  appendText(header, "div", "Country", "source-country-cell");
  sourceRows.forEach((source) => appendText(header, "div", source.shortLabel, "source-status-cell"));
  el.sourceCoverageHeatmap.appendChild(header);

  countries.forEach((country) => {
    const row = document.createElement("div");
    row.className = "source-coverage-row";
    const countryCell = document.createElement("div");
    countryCell.className = "source-country-cell";
    const countryName = document.createElement("strong");
    countryName.textContent = country.country;
    const countryMeta = document.createElement("span");
    countryMeta.textContent = `#${country.rank || "n/a"} - ${country.region}`;
    countryCell.append(countryName, countryMeta);
    row.appendChild(countryCell);

    sourceCoverageRows(country).forEach((source) => {
      const cell = document.createElement("div");
      cell.className = "source-status-cell";
      const badge = sourceStatusBadge(source.status);
      badge.title = `${source.label}: ${source.evidence}`;
      cell.appendChild(badge);
      row.appendChild(cell);
    });
    el.sourceCoverageHeatmap.appendChild(row);
  });
}

function createSourceEvidenceTable(rows) {
  const table = document.createElement("table");
  table.className = "indicator-mini-table-inner source-evidence-table";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Source family</th><th>Status</th><th>Selected-country evidence</th><th>Dashboard use / caveat</th></tr>";
  const tbody = document.createElement("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    const sourceCell = document.createElement("td");
    sourceCell.textContent = row.label;
    const statusCell = document.createElement("td");
    statusCell.appendChild(sourceStatusBadge(row.status));
    const evidenceCell = document.createElement("td");
    evidenceCell.textContent = row.evidence || "n/a";
    const useCell = document.createElement("td");
    const use = document.createElement("strong");
    use.textContent = row.use || "Context";
    const note = document.createElement("span");
    note.textContent = row.note || "";
    useCell.append(use, note);
    tr.append(sourceCell, statusCell, evidenceCell, useCell);
    tbody.appendChild(tr);
  });
  table.append(thead, tbody);
  return table;
}

function renderCountrySourceEvidence() {
  if (!el.countrySourceEvidenceTable) return;
  const country = countryByIso(state.selectedIso);
  el.countrySourceEvidenceTable.innerHTML = "";
  const intro = document.createElement("p");
  intro.className = "mini-table-intro";
  intro.textContent = `${country.country}: source availability for the current country view. Available means the dashboard dataset has a usable field; missing is a coverage gap, not evidence of absence.`;
  el.countrySourceEvidenceTable.appendChild(intro);
  el.countrySourceEvidenceTable.appendChild(createSourceEvidenceTable(sourceCoverageRows(country)));
}

function renderTable() {
  if (!el.countryTableBody) return;
  el.countryTableBody.innerHTML = "";
  const countries = filteredCountries();
  if (el.countryTableSummary) {
    const geography = state.geography === "All geographies" ? "all geographies" : state.geography.toLowerCase();
    const region = state.region === "All regions" ? "all regions" : state.region;
    el.countryTableSummary.textContent = `${countries.length} countries shown for ${region}, ${geography}; table keeps the official score plus raw indicators. Use data confidence and main gap to see where interpretation is weaker.`;
  }
  if (el.countryTableCardList) {
    el.countryTableCardList.innerHTML = "";
  }
  countries.forEach((country) => {
    if (el.countryTableCardList) {
      el.countryTableCardList.appendChild(createMobileTableCard(
        `${country.rank ? `#${country.rank} ` : ""}${country.country}`,
        `${country.region} - ${countryGeography(country)}`,
        [
          ["Score", fmt(country.score)],
          ["Exposure tier", country.riskTier || "n/a"],
          ["Data confidence", country.dataConfidence?.level || "n/a"],
          ["IPC Phase 3+", fmtPct(country.indicators.ipcPhase3PlusPct)],
          ["IDMC IDPs", fmtCompact(country.indicators?.idmcConflictTotalDisplacement)],
          ["Female vulnerable %", fmtPct(country.indicators?.femaleVulnerableEmploymentPct)],
          ["Main gap", country.readiness?.mainGap || "n/a"],
        ]
      ));
    }
    const row = document.createElement("tr");
    const values = [
      country.rank ? `#${country.rank}` : "n/a",
      country.country,
      country.region,
      countryGeography(country),
      fmt(country.score),
      country.riskTier || "n/a",
      country.dataConfidence?.level || "n/a",
      fmtCompact(country.indicators?.idmcConflictTotalDisplacement),
      fmtPct(country.indicators.ipcPhase3PlusPct),
      fmtPct(country.indicators?.femaleVulnerableEmploymentPct),
      fmtPct(country.indicators?.femaleHeadedHouseholdsPct),
      fmtPct(country.informality?.femaleInformalEmploymentPct),
      country.readiness?.mainGap || "n/a",
    ];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 5) {
        const pill = document.createElement("span");
        pill.className = "risk-pill";
        pill.dataset.tier = country.riskTier || "";
        pill.textContent = value;
        cell.appendChild(pill);
      } else if (index === 6) {
        const pill = document.createElement("span");
        pill.className = "confidence-pill";
        pill.dataset.confidence = country.dataConfidence?.level || "";
        pill.title = country.dataConfidence?.note || "";
        pill.textContent = value;
        cell.appendChild(pill);
      } else {
        cell.textContent = value;
      }
      row.appendChild(cell);
    });
    el.countryTableBody.appendChild(row);
  });
}

function renderCountryComparisonList() {
  if (!el.countryComparisonList) return;
  const countries = filteredCountries().slice(0, 12);
  el.countryComparisonList.innerHTML = "";
  countries.forEach((country) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "country-comparison-item";
    item.dataset.selected = country.iso3 === state.selectedIso ? "true" : "false";
    item.dataset.confidence = country.dataConfidence?.level || "";

    const meta = document.createElement("span");
    meta.className = "country-comparison-meta";
    meta.textContent = `${country.rank ? `#${country.rank}` : "Unranked"} | ${country.riskTier || "Tier n/a"} | ${country.dataConfidence?.level || "Confidence n/a"}`;

    const name = document.createElement("strong");
    name.textContent = country.country;

    const score = document.createElement("span");
    score.className = "country-comparison-score";
    score.textContent = `${fmt(country.score)} / 100`;

    const bar = document.createElement("span");
    bar.className = "country-comparison-track";
    const fill = document.createElement("span");
    fill.style.width = `${clamp(country.score)}%`;
    bar.appendChild(fill);

    item.append(meta, name, score, bar);
    item.title = country.componentMissingCount
      ? `${country.componentMissingCount} missing or neutral-imputed score component(s).`
      : "No missing score components flagged.";
    item.addEventListener("click", () => {
      state.selectedIso = country.iso3;
      populateCountrySelect();
      renderAll();
    });
    el.countryComparisonList.appendChild(item);
  });
}

function scenarioCaseloadData() {
  return data.scenarioCaseload || {};
}

function caseloadGenderKey(row) {
  return `${row?.iso3 || ""}|${row?.scenario || ""}`;
}

function caseloadScenarioLabel(value) {
  if (value === "mild") return "Mild";
  if (value === "central") return "Central";
  if (value === "severe") return "Severe";
  return value || "Scenario n/a";
}

const FIGURE_HORIZONS = {
  "6m": {
    label: "Sep 2026 (+6m)",
    add: "add_6m_sep26",
    pct: "pct_6m_sep26",
    upper: "add_6m_sep26_upper",
    women: "women_girls_6m_sep26",
    men: "men_boys_6m_sep26",
    womenUpper: "women_girls_6m_sep26_upper",
    menUpper: "men_boys_6m_sep26_upper",
    concentration: "women_girls_pct_est_female_population_6m_sep26",
  },
  "9m": {
    label: "Dec 2026 (+9m)",
    add: "add_9m_dec26",
    pct: "pct_9m_dec26",
    upper: "add_9m_dec26_upper",
    women: "women_girls_9m_dec26",
    men: "men_boys_9m_dec26",
    womenUpper: "women_girls_9m_dec26_upper",
    menUpper: "men_boys_9m_dec26_upper",
    concentration: "women_girls_pct_est_female_population_9m_dec26",
  },
};

const FIGURE_PANEL_SPECS = [
  { id: "central-6m", label: "Central +6m (Sep 2026)", scenario: "central", horizon: "6m", band: "price_only" },
  { id: "severe-6m", label: "Severe +6m (Sep 2026)", scenario: "severe", horizon: "6m", band: "price_only" },
  { id: "severe-upper-6m", label: "Severe + income +6m (Sep 2026)", scenario: "severe", horizon: "6m", band: "upper_band" },
  { id: "central-9m", label: "Central +9m (Dec 2026)", scenario: "central", horizon: "9m", band: "price_only" },
  { id: "severe-9m", label: "Severe +9m (Dec 2026)", scenario: "severe", horizon: "9m", band: "price_only" },
  { id: "severe-upper-9m", label: "Severe + income +9m (Dec 2026)", scenario: "severe", horizon: "9m", band: "upper_band" },
];

function selectedFigureRowLimit(selectId, fallback = 15) {
  const selected = document.getElementById(selectId)?.value || String(fallback);
  if (selected === "all") return { value: null, all: true };
  const value = Number.parseInt(selected, 10);
  return Number.isFinite(value) && value > 0 ? { value, all: false } : { value: fallback, all: false };
}

function applyFigureRowLimit(rows, limit) {
  return limit.all ? rows : rows.slice(0, limit.value);
}

function figureRowLimitLabel(limit, totalRows) {
  if (limit.all) return `All ${fmtInt(totalRows)} countries`;
  return `Top ${fmtInt(Math.min(limit.value, totalRows))} of ${fmtInt(totalRows)} countries`;
}

function setFigureChartHeight(canvasId, rowCount) {
  const canvas = document.getElementById(canvasId);
  const wrapper = canvas?.closest(".interactive-chart-wrap");
  if (!wrapper) return;
  const height = Math.max(430, Math.min(820, 210 + rowCount * 24));
  wrapper.style.height = `${height}px`;
}

function caseloadEstimateRows() {
  const caseload = scenarioCaseloadData();
  return Array.isArray(caseload.estimates) ? caseload.estimates : [];
}

function caseloadGenderRows() {
  const caseload = scenarioCaseloadData();
  return Array.isArray(caseload.genderBreakdown) ? caseload.genderBreakdown : [];
}

function caseloadGenderRowMap() {
  return new Map(caseloadGenderRows().map((row) => [caseloadGenderKey(row), row]));
}

function caseloadRowsForScenario(scenario) {
  return caseloadEstimateRows().filter((row) => row.scenario === scenario);
}

function caseloadUpperValue(row, horizonKey) {
  const fields = FIGURE_HORIZONS[horizonKey];
  if (!fields) return 0;
  const upperBandValue = numericValue(row?.[fields.upper]);
  const priceOnly = numericValue(row?.[fields.add]) || 0;
  return upperBandValue && upperBandValue > 0 ? upperBandValue : priceOnly;
}

function caseloadPanelValue(row, spec) {
  const fields = FIGURE_HORIZONS[spec.horizon];
  if (!fields) return 0;
  if (spec.band === "upper_band") return caseloadUpperValue(row, spec.horizon);
  return numericValue(row?.[fields.add]) || 0;
}

function caseloadPanelPct(row, spec) {
  const totalPop = numericValue(row?.total_population) || numericValue(row?.total_pop);
  if (!totalPop) return 0;
  return (caseloadPanelValue(row, spec) / totalPop) * 100;
}

function caseloadPanelRows(spec, metric = "people") {
  return caseloadRowsForScenario(spec.scenario)
    .map((row) => {
      const value = metric === "population_pct"
        ? caseloadPanelPct(row, spec)
        : caseloadPanelValue(row, spec);
      return {
        ...row,
        value,
        chartValue: metric === "people_log" ? Math.max(value, 1000) : value,
      };
    })
    .sort((a, b) => (b.value || 0) - (a.value || 0));
}

function caseloadPanelTotal(scenario, horizonKey, band = "price_only") {
  const spec = { scenario, horizon: horizonKey, band };
  return caseloadRowsForScenario(scenario).reduce((total, row) => total + caseloadPanelValue(row, spec), 0);
}

function selectedFigurePanel(selectId) {
  const selected = document.getElementById(selectId)?.value;
  return FIGURE_PANEL_SPECS.find((spec) => spec.id === selected) || FIGURE_PANEL_SPECS[0];
}

function genderPanelValue(row, spec) {
  const fields = FIGURE_HORIZONS[spec.horizon];
  if (!fields) return 0;
  if (spec.band === "upper_band") {
    const upper = numericValue(row?.[fields.womenUpper]);
    if (upper !== null && upper !== undefined && upper > 0) return upper;
  }
  return numericValue(row?.[fields.women]) || 0;
}

function genderPanelRows(spec) {
  return caseloadGenderRows()
    .filter((row) => row.scenario === spec.scenario)
    .map((row) => ({
      ...row,
      value: genderPanelValue(row, spec),
      shareValue: numericValue(row.women_girls_burden_pp_from_parity),
    }))
    .filter((row) => row.value !== null && row.value !== undefined)
    .sort((a, b) => (b.value || 0) - (a.value || 0));
}

function caseloadMethodColor(row) {
  const method = String(row?.method || "").toLowerCase();
  if (method.includes("ipc")) return COLORS.teal;
  if (method.includes("cross")) return "#9858e5";
  if (method.includes("fallback")) return COLORS.red;
  return COLORS.gold;
}

function caseloadMethodLabel(method) {
  const value = String(method || "").replaceAll("_", " ");
  return value ? value.replace(/\b\w/g, (match) => match.toUpperCase()) : "Method n/a";
}

function caseloadMetricCard(label, value, note) {
  const item = document.createElement("article");
  item.className = "caseload-metric";
  appendText(item, "span", label, "metric-label");
  appendText(item, "strong", value);
  appendText(item, "p", note);
  return item;
}

function renderCaseloadSummary() {
  const caseload = scenarioCaseloadData();
  if (el.caseloadBoundaryNote) {
    el.caseloadBoundaryNote.textContent = caseload.methodBoundary || "Scenario/counterfactual planning estimates; not observed impact.";
  }
  if (el.caseloadSourceNote) {
    el.caseloadSourceNote.textContent = caseload.sourceNote || "";
  }
  if (!el.caseloadSummaryList) return;
  el.caseloadSummaryList.innerHTML = "";
  if (!caseload.available) {
    el.caseloadSummaryList.appendChild(caseloadMetricCard("Data status", "Not available", "Scenario-caseload estimates are not available in the current dashboard dataset."));
    return;
  }
  if (el.caseloadSummaryList.dataset.mode === "figure-intro") {
    const hasGender = caseloadGenderRows().length > 0;
    [
      ["1", "Scenario scale", "Range chart shows estimated additional caseloads across +6m and +9m."],
      ["2", "Largest caseloads", "Central September country estimates show where the largest caseloads sit."],
      ["3", "Income losses", "Waterfall shows how income-channel losses can widen the severe-case estimate."],
      ["4", "Gender distribution", hasGender ? "Estimated women/girls and men/boys distribution is included for scenario planning." : "Gender-distribution estimates are not available."],
    ].forEach(([label, value, note]) => el.caseloadSummaryList.appendChild(caseloadMetricCard(label, value, note)));
    return;
  }
  const headline = caseload.headline || {};
  [
    [
      "Central Sep 2026",
      fmtMillions(headline.centralSep26),
      "Additional people, price-only central scenario",
    ],
    [
      "Central Dec 2026",
      fmtMillions(headline.centralDec26),
      "Additional people, price-only central scenario",
    ],
    [
      "Severe Dec 2026",
      fmtMillions(headline.severeDec26),
      "Additional people, price-only severe scenario",
    ],
    [
      "Severe + income",
      fmtMillions(headline.severeUpperDec26),
      "Severe scenario with income-channel effects",
    ],
  ].forEach(([label, value, note]) => el.caseloadSummaryList.appendChild(caseloadMetricCard(label, value, note)));
}

function renderCaseloadRangeChart() {
  if (!window.Chart) return;
  destroyChart("caseloadRange");
  const ctx = document.getElementById("caseload-range-chart");
  if (!ctx) return;
  const caseload = scenarioCaseloadData();
  const headline = caseload.headline || {};
  const labels = ["Sep 2026 (+6m)", "Dec 2026 (+9m)"];
  const datasets = [
    {
      label: "Mild price-only",
      data: [headline.mildSep26, headline.mildDec26],
      borderColor: COLORS.teal,
      backgroundColor: "rgba(92, 127, 120, 0.12)",
      pointBackgroundColor: COLORS.teal,
      borderDash: [6, 4],
      borderWidth: 2,
      tension: 0.22,
    },
    {
      label: "Central estimate",
      data: [headline.centralSep26, headline.centralDec26],
      borderColor: COLORS.navy,
      backgroundColor: "rgba(31, 35, 38, 0.08)",
      pointBackgroundColor: COLORS.navy,
      pointRadius: 5,
      pointHoverRadius: 6,
      borderWidth: 4,
      tension: 0.22,
    },
    {
      label: "Severe price-only",
      data: [headline.severeSep26, headline.severeDec26],
      borderColor: COLORS.gold,
      backgroundColor: "rgba(199, 138, 44, 0.12)",
      pointBackgroundColor: COLORS.gold,
      borderDash: [6, 4],
      borderWidth: 2,
      tension: 0.22,
    },
    {
      label: "Severe + income effects",
      data: [headline.severeUpperSep26, headline.severeUpperDec26],
      borderColor: COLORS.red,
      backgroundColor: "rgba(232, 74, 95, 0.1)",
      pointBackgroundColor: COLORS.red,
      borderDash: [3, 4],
      borderWidth: 2,
      tension: 0.22,
    },
  ];

  charts.caseloadRange = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: baseChartOptions({
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: COLORS.navy, font: chartFont(), boxWidth: 14 },
        },
        tooltip: {
          backgroundColor: COLORS.navy,
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${fmtMillions(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
        y: {
          min: 0,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont(), callback: (value) => fmtCompact(value) },
          title: { display: true, text: "Additional food-insecure people", color: COLORS.muted, font: chartFont() },
        },
      },
    }),
  });
}

function renderFigureMetricCards() {
  const container = document.getElementById("figure-summary-list");
  if (!container) return;
  const centralSep = caseloadPanelTotal("central", "6m");
  const centralDec = caseloadPanelTotal("central", "9m");
  const severeDec = caseloadPanelTotal("severe", "9m");
  const severeUpperDec = caseloadPanelTotal("severe", "9m", "upper_band");
  const incomeAdd = severeUpperDec - severeDec;
  container.innerHTML = "";
  [
    ["Central +6m", fmtMillions(centralSep), "Additional people, price-only central scenario"],
    ["Central +9m", fmtMillions(centralDec), "Additional people, price-only central scenario"],
    ["Severe + income +9m", fmtMillions(severeUpperDec), "Severe scenario with income-channel effects"],
    ["Added income-loss effect", fmtMillions(incomeAdd), `${fmtPct(incomeAdd / severeDec * 100)} above severe price-only +9m`],
  ].forEach(([label, value, note]) => container.appendChild(caseloadMetricCard(label, value, note)));
}

function renderFigureRangeChart() {
  if (!window.Chart) return;
  const ctx = document.getElementById("figure-range-chart");
  if (!ctx) return;
  destroyChart("figureRange");
  const labels = [FIGURE_HORIZONS["6m"].label, FIGURE_HORIZONS["9m"].label];
  const datasets = [
    {
      label: "Mild price-only",
      data: [caseloadPanelTotal("mild", "6m"), caseloadPanelTotal("mild", "9m")],
      borderColor: COLORS.teal,
      backgroundColor: "rgba(92, 127, 120, 0.14)",
      borderDash: [6, 4],
      pointBackgroundColor: COLORS.teal,
      borderWidth: 2,
      tension: 0.22,
    },
    {
      label: "Central estimate",
      data: [caseloadPanelTotal("central", "6m"), caseloadPanelTotal("central", "9m")],
      borderColor: COLORS.navy,
      backgroundColor: "rgba(31, 35, 38, 0.08)",
      pointBackgroundColor: COLORS.navy,
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 4,
      tension: 0.22,
    },
    {
      label: "Severe price-only",
      data: [caseloadPanelTotal("severe", "6m"), caseloadPanelTotal("severe", "9m")],
      borderColor: COLORS.gold,
      backgroundColor: "rgba(199, 138, 44, 0.12)",
      borderDash: [6, 4],
      pointBackgroundColor: COLORS.gold,
      borderWidth: 2,
      tension: 0.22,
    },
    {
      label: "Severe + income effects",
      data: [caseloadPanelTotal("severe", "6m", "upper_band"), caseloadPanelTotal("severe", "9m", "upper_band")],
      borderColor: COLORS.red,
      backgroundColor: "rgba(232, 74, 95, 0.1)",
      borderDash: [3, 4],
      pointBackgroundColor: COLORS.red,
      borderWidth: 2,
      tension: 0.22,
    },
  ];

  charts.figureRange = new Chart(ctx, {
    type: "line",
    data: { labels, datasets },
    options: baseChartOptions({
      interaction: { mode: "nearest", intersect: false },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: { color: COLORS.navy, font: chartFont(), boxWidth: 14 },
        },
        tooltip: {
          backgroundColor: COLORS.navy,
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${fmtMillions(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
        y: {
          min: 0,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont(), callback: (value) => fmtCompact(value) },
          title: { display: true, text: "Additional food-insecure people", color: COLORS.muted, font: chartFont() },
        },
      },
    }),
  });
}

function renderFigureWaterfallChart() {
  if (!window.Chart) return;
  const ctx = document.getElementById("figure-waterfall-chart");
  if (!ctx) return;
  destroyChart("figureWaterfall");
  const priceOnly = caseloadPanelTotal("severe", "9m");
  const upperBand = caseloadPanelTotal("severe", "9m", "upper_band");
  const incomeAdd = Math.max(0, upperBand - priceOnly);
  const metrics = document.getElementById("figure-waterfall-metrics");
  if (metrics) {
    metrics.innerHTML = "";
    [
      ["Price-only", fmtMillions(priceOnly)],
      ["Income-loss effect", fmtMillions(incomeAdd)],
      ["Severe + income", fmtMillions(upperBand)],
    ].forEach(([label, value]) => metrics.appendChild(caseloadMetricCard(label, value, "Severe scenario, Dec 2026")));
  }

  charts.figureWaterfall = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Price only", "+ Income losses", "Severe + income"],
      datasets: [
        {
          label: "Additional food-insecure people",
          data: [[0, priceOnly], [priceOnly, upperBand], [0, upperBand]],
          actualValues: [priceOnly, incomeAdd, upperBand],
          backgroundColor: [COLORS.navy, COLORS.gold, COLORS.red],
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      plugins: {
        tooltip: {
          backgroundColor: COLORS.navy,
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (context) => `${context.label}: ${fmtMillions(context.dataset.actualValues[context.dataIndex])}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
        y: {
          min: 0,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont(), callback: (value) => fmtCompact(value) },
          title: { display: true, text: "Additional food-insecure people", color: COLORS.muted, font: chartFont() },
        },
      },
    }),
  });
}

function renderFigureCountryBarChart({
  chartKey,
  canvasId,
  rows,
  axisTitle,
  datasetLabel,
  logScale = false,
  percent = false,
  maxLabels = 12,
  dynamicHeight = false,
}) {
  if (!window.Chart) return;
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  destroyChart(chartKey);
  if (!rows.length) return;
  if (dynamicHeight) setFigureChartHeight(canvasId, rows.length);
  const values = rows.map((row) => row.value || 0);
  const chartValues = rows.map((row) => logScale ? Math.max(row.value || 0, 1000) : row.value || 0);
  const maxValue = Math.max(...values);
  charts[chartKey] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.country),
      datasets: [
        {
          label: datasetLabel,
          data: chartValues,
          actualValues: values,
          backgroundColor: rows.map((row, index) => index === 0 ? COLORS.navy : caseloadMethodColor(row)),
          borderColor: rows.map((row) => row.low_confidence ? COLORS.navy : "rgba(0, 0, 0, 0)"),
          borderWidth: rows.map((row) => row.low_confidence ? 1 : 0),
          borderRadius: 2,
        },
      ],
    },
    plugins: [barValueLabelPlugin],
    options: baseChartOptions({
      indexAxis: "y",
      layout: { padding: { right: maxLabels ? 62 : 10 } },
      plugins: {
        barValueLabel: {
          maxLabels,
          formatter: (_value, index) => percent ? fmtPct(values[index]) : fmtCompact(values[index]),
          insideColor: "#fff",
        },
        tooltip: {
          backgroundColor: COLORS.navy,
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (context) => {
              const row = rows[context.dataIndex];
              const value = context.dataset.actualValues[context.dataIndex];
              const method = caseloadMethodLabel(row.method);
              const confidence = row.low_confidence ? "low confidence" : "standard confidence";
              return `${datasetLabel}: ${percent ? fmtPct(value) : fmtCompact(value)} | ${method} | ${confidence}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: logScale ? "logarithmic" : "linear",
          min: logScale ? 1000 : 0,
          suggestedMax: logScale ? undefined : maxValue * 1.15,
          grid: { color: COLORS.grid },
          ticks: {
            color: COLORS.muted,
            font: chartFont(),
            maxTicksLimit: logScale ? 6 : percent ? 5 : 7,
            callback: (value) => percent ? `${value}%` : fmtCompact(value),
          },
          title: { display: true, text: axisTitle, color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont(), autoSkip: false },
        },
      },
    }),
  });
}

function renderFigureTopCountryCharts() {
  const centralSepSpec = { scenario: "central", horizon: "6m", band: "price_only" };
  const centralRows = caseloadPanelRows(centralSepSpec);
  renderFigureCountryBarChart({
    chartKey: "figureTopCountries",
    canvasId: "figure-top-countries-chart",
    rows: centralRows.slice(0, 15),
    axisTitle: "Additional food-insecure people, central +6m",
    datasetLabel: "Additional people",
    maxLabels: 15,
    dynamicHeight: true,
  });
}

function renderFigureAllCountryPanels() {
  const peopleSpec = selectedFigurePanel("figure-all-country-people-select");
  const peopleRowsAll = caseloadPanelRows(peopleSpec, "people_log");
  const peopleLimit = selectedFigureRowLimit("figure-all-country-people-limit-select", 15);
  const peopleRows = applyFigureRowLimit(peopleRowsAll, peopleLimit);
  const peopleTitle = document.getElementById("figure-all-country-people-title");
  if (peopleTitle) peopleTitle.textContent = `${peopleSpec.label} | ${figureRowLimitLabel(peopleLimit, peopleRowsAll.length)}`;
  renderFigureCountryBarChart({
    chartKey: "figureAllCountriesPeople",
    canvasId: "figure-all-countries-people-chart",
    rows: peopleRows,
    axisTitle: "Additional food-insecure people, log scale",
    datasetLabel: "Additional people",
    logScale: true,
    maxLabels: peopleLimit.all ? 12 : peopleRows.length,
    dynamicHeight: true,
  });

  const populationSpec = selectedFigurePanel("figure-all-country-population-select");
  const populationRowsAll = caseloadPanelRows(populationSpec, "population_pct");
  const populationLimit = selectedFigureRowLimit("figure-all-country-population-limit-select", 10);
  const populationRows = applyFigureRowLimit(populationRowsAll, populationLimit);
  const populationTitle = document.getElementById("figure-all-country-population-title");
  if (populationTitle) populationTitle.textContent = `${populationSpec.label} | ${figureRowLimitLabel(populationLimit, populationRowsAll.length)}`;
  renderFigureCountryBarChart({
    chartKey: "figureAllCountriesPopulation",
    canvasId: "figure-all-countries-population-chart",
    rows: populationRows,
    axisTitle: "Additional people as % of total population",
    datasetLabel: "Population share",
    percent: true,
    maxLabels: populationLimit.all ? 12 : populationRows.length,
    dynamicHeight: true,
  });
}

function renderFigureGenderShareChart(rows) {
  if (!window.Chart) return;
  const ctx = document.getElementById("figure-gender-share-chart");
  if (!ctx) return;
  destroyChart("figureGenderShare");
  const sorted = [...rows]
    .filter((row) => row.shareValue !== null && row.shareValue !== undefined)
    .sort((a, b) => (b.shareValue || 0) - (a.shareValue || 0));
  if (!sorted.length) return;
  const values = sorted.map((row) => row.shareValue || 0);
  const maxAbs = Math.max(...values.map((value) => Math.abs(value)), 1);
  charts.figureGenderShare = new Chart(ctx, {
    type: "bar",
    data: {
      labels: sorted.map((row) => row.country),
      datasets: [
        {
          label: "Women/girls share vs parity",
          data: values,
          backgroundColor: values.map((value) => value >= 0 ? COLORS.red : COLORS.blue),
          borderRadius: 2,
        },
      ],
    },
    plugins: [barValueLabelPlugin],
    options: baseChartOptions({
      indexAxis: "y",
      layout: { padding: { right: 58, left: 8 } },
      plugins: {
        barValueLabel: {
          maxLabels: 18,
          formatter: (value) => `${value > 0 ? "+" : ""}${fmt(value, 1)} pp`,
          color: COLORS.navy,
          insideColor: "#fff",
        },
        tooltip: {
          backgroundColor: COLORS.navy,
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          callbacks: {
            label: (context) => {
              const row = sorted[context.dataIndex];
              const share = numericValue(row.women_girls_share_pct);
              return `Women/girls share: ${fmtPct(share)} (${context.parsed.x > 0 ? "+" : ""}${fmt(context.parsed.x, 1)} pp vs 50%)`;
            },
          },
        },
      },
      scales: {
        x: {
          min: -Math.ceil(maxAbs + 1),
          max: Math.ceil(maxAbs + 1),
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont(), callback: (value) => `${value} pp` },
          title: { display: true, text: "Percentage points above / below 50% women/girls share", color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont(), autoSkip: false },
        },
      },
    }),
  });
}

function renderFigureGenderCharts() {
  const ctx = document.getElementById("figure-women-girls-absolute-chart");
  const shareCtx = document.getElementById("figure-gender-share-chart");
  if (!ctx && !shareCtx) return;
  const spec = selectedFigurePanel("figure-gender-panel-select");
  const title = document.getElementById("figure-gender-panel-title");
  if (title) title.textContent = spec.label;
  const rows = genderPanelRows(spec);
  renderFigureCountryBarChart({
    chartKey: "figureWomenGirlsAbsolute",
    canvasId: "figure-women-girls-absolute-chart",
    rows: rows.slice(0, 15),
    axisTitle: `Additional women/girls, ${spec.label}`,
    datasetLabel: "Women/girls",
    maxLabels: 15,
  });
  renderFigureGenderShareChart(rows);
}

function renderFigurePage() {
  const hasFigureCanvas = [
    "figure-range-chart",
    "figure-waterfall-chart",
    "figure-top-countries-chart",
    "figure-all-countries-people-chart",
    "figure-all-countries-population-chart",
    "figure-women-girls-absolute-chart",
    "figure-gender-share-chart",
  ].some((id) => document.getElementById(id));
  if (!hasFigureCanvas) return;
  renderFigureMetricCards();
  renderFigureRangeChart();
  renderFigureWaterfallChart();
  renderFigureTopCountryCharts();
  renderFigureAllCountryPanels();
  renderFigureGenderCharts();
}

function renderCaseloadTable() {
  const caseload = scenarioCaseloadData();
  if (!el.caseloadEstimatesTableBody) return;
  const rows = Array.isArray(caseload.estimates) ? [...caseload.estimates] : [];
  const scenarioRank = { mild: 1, central: 2, severe: 3 };
  rows.sort((a, b) => String(a.country).localeCompare(String(b.country)) || (scenarioRank[a.scenario] || 99) - (scenarioRank[b.scenario] || 99));
  el.caseloadEstimatesTableBody.innerHTML = "";
  if (el.caseloadEstimatesCardList) el.caseloadEstimatesCardList.innerHTML = "";
  if (el.caseloadTableSummary) {
    const countries = new Set(rows.map((row) => row.iso3)).size;
    const genderRows = caseloadGenderRows().length;
    el.caseloadTableSummary.textContent = `${fmtInt(rows.length)} country-scenario rows across ${fmtInt(countries)} countries. Values are planning estimates; ${fmtInt(genderRows)} gender-distribution rows are available for scenario planning.`;
  }

  rows.forEach((row) => {
    if (el.caseloadEstimatesCardList) {
      el.caseloadEstimatesCardList.appendChild(createMobileTableCard(
        `${row.country} - ${caseloadScenarioLabel(row.scenario)}`,
        `${row.method || "method n/a"} | ${row.low_confidence ? "Low confidence" : "Standard confidence"}`,
        [
          ["Sep 2026", fmtCompact(row.add_6m_sep26)],
          ["Sep %", fmtPct(row.pct_6m_sep26)],
          ["Sep upper", fmtCompact(row.add_6m_sep26_upper)],
          ["Dec 2026", fmtCompact(row.add_9m_dec26)],
          ["Dec %", fmtPct(row.pct_9m_dec26)],
          ["Dec upper", fmtCompact(row.add_9m_dec26_upper)],
          ["Baseline", row.baseline_ipc3plus ? `IPC ${fmtCompact(row.baseline_ipc3plus)}` : `PoU ${fmtCompact(row.baseline_pou)}`],
        ]
      ));
    }

    const tr = document.createElement("tr");
    [
      row.country,
      caseloadScenarioLabel(row.scenario),
      row.method || "n/a",
      row.low_confidence ? "Yes" : "No",
      row.baseline_ipc3plus ? fmtCompact(row.baseline_ipc3plus) : "n/a",
      row.baseline_pou ? fmtCompact(row.baseline_pou) : "n/a",
      fmtCompact(row.add_6m_sep26),
      fmtPct(row.pct_6m_sep26),
      fmtCompact(row.add_6m_sep26_upper),
      fmtCompact(row.add_9m_dec26),
      fmtPct(row.pct_9m_dec26),
      fmtCompact(row.add_9m_dec26_upper),
    ].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      tr.appendChild(cell);
    });
    el.caseloadEstimatesTableBody.appendChild(tr);
  });
}

function renderCaseloadPage() {
  if (!el.caseloadSummaryList && !document.getElementById("caseload-range-chart")) return;
  renderCaseloadSummary();
  renderCaseloadRangeChart();
  renderCaseloadTable();
}

function renderAll() {
  renderMeta();
  renderFilterSummary();
  renderMessages();
  renderBeforeAfter();
  renderCountryProfile();
  renderRankingChart();
  renderRankingConfidence();
  renderRawEvidenceTable();
  renderComponentChart();
  renderRegionChart();
  renderGenderChart();
  renderFemaleVulnerableChart();
  renderFemaleLabourForceChart();
  renderFemaleAgricultureChart();
  renderGenderDriverChart();
  renderIndexDecompositionChart();
  renderGenderLensList();
  renderGenderMonitoringList();
  renderDisplacementClarity();
  renderSourceCoverageHeatmap();
  renderCountryGenderLens();
  renderCountryGenderIndicators();
  renderReadiness();
  renderCoverage();
  renderCountrySourceEvidence();
  renderTable();
  renderCountryComparisonList();
  renderCaseloadPage();
  renderFigurePage();
}

function bindEvents() {
  if (el.mobileFilterToggle) el.mobileFilterToggle.addEventListener("click", () => {
    const expanded = el.mobileFilterToggle.getAttribute("aria-expanded") === "true";
    setMobileFiltersExpanded(!expanded);
  });
  if (el.regionFilter) el.regionFilter.addEventListener("change", () => {
    state.region = el.regionFilter.value;
    populateCountrySelect();
    renderAll();
  });
  if (el.geographyFilter) el.geographyFilter.addEventListener("change", () => {
    state.geography = el.geographyFilter.value;
    populateControls();
    renderAll();
  });
  if (el.countrySelect) el.countrySelect.addEventListener("change", () => {
    state.selectedIso = el.countrySelect.value;
    renderAll();
  });
  if (el.scenarioGroupSelect) el.scenarioGroupSelect.addEventListener("change", () => {
    state.scenarioGroup = el.scenarioGroupSelect.value;
    populateScenarioSelect();
    renderAll();
  });
  if (el.scenarioSelect) el.scenarioSelect.addEventListener("change", () => {
    state.scenario = el.scenarioSelect.value;
    state.scenarioGroup = scenarioGroupFor(state.scenario)?.id || state.scenarioGroup;
    renderAll();
  });
  const figurePeopleSelect = document.getElementById("figure-all-country-people-select");
  if (figurePeopleSelect) figurePeopleSelect.addEventListener("change", renderFigureAllCountryPanels);
  const figurePopulationSelect = document.getElementById("figure-all-country-population-select");
  if (figurePopulationSelect) figurePopulationSelect.addEventListener("change", renderFigureAllCountryPanels);
  const figurePeopleLimitSelect = document.getElementById("figure-all-country-people-limit-select");
  if (figurePeopleLimitSelect) figurePeopleLimitSelect.addEventListener("change", renderFigureAllCountryPanels);
  const figurePopulationLimitSelect = document.getElementById("figure-all-country-population-limit-select");
  if (figurePopulationLimitSelect) figurePopulationLimitSelect.addEventListener("change", renderFigureAllCountryPanels);
  const figureGenderSelect = document.getElementById("figure-gender-panel-select");
  if (figureGenderSelect) figureGenderSelect.addEventListener("change", renderFigureGenderCharts);
  window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    el.progressBar.style.width = `${clamp(progress)}%`;
  });
}

function init() {
  if (!data || !Array.isArray(data.countries)) {
    document.body.innerHTML = "<main><p>Dashboard data did not load.</p></main>";
    return;
  }
  populateControls();
  bindEvents();
  renderAll();
}

init();
