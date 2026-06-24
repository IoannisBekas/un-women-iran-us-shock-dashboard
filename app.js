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
  { id: "combined", label: "Combined pathway", scenarios: ["combined_high", "combined_base", "combined_low"] },
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
  genderDrivers: null,
  genderDecomposition: null,
  indexDecomposition: null,
};

let map;
let markers = [];

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
  map: document.getElementById("country-map"),
  mapReset: document.getElementById("map-reset"),
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
  countryGenderIndicatorTable: document.getElementById("country-gender-indicator-table"),
  countryTableBody: document.getElementById("country-table-body"),
  countryTableCardList: document.getElementById("country-table-card-list"),
  countryTableSummary: document.getElementById("country-table-summary"),
  beforeAfterCardList: document.getElementById("before-after-card-list"),
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
      points: component === null || weight === null ? null : component * weight * 100,
      color: key === "gender_vulnerability_score" ? COLORS.red : key === "public_displacement_layer_score" ? COLORS.blue : COLORS.teal,
    };
  }).filter((row) => row.points !== null);
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
  if (!hasElement(el.geographyFilter, el.regionFilter, el.countrySelect, el.scenarioGroupSelect, el.scenarioSelect)) return;
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
    const scenarioGroup = scenarioGroupFor(state.scenario)?.label || "Stress lens";
    const scopeLabel = [
      state.region === "All regions" ? "All regions" : state.region,
      state.geography === "All geographies" ? "All geographies" : state.geography,
      `${scenarioGroup}: ${scenarioLevelLabel(state.scenario)}`,
    ];
    el.compactFilterSubtitle.textContent = scopeLabel.join(" · ");
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
      ? "Bars show each country's highest positive median food-price change against the same month in 2025. This is a headline price-rise view; flat, negative and unavailable comparisons stay in the table."
      : "No country in the current filtered view has a positive price increase against the same month in 2025.";
  }

  if (el.beforeAfterMessageList) {
    el.beforeAfterMessageList.innerHTML = "";
    [
      largestIncrease ? `${largestIncrease.country} is the strongest price story: ${fmtSignedPct(sameMonthYoY(largestIncrease).peakPositiveYoYPct)} in ${sameMonthYoY(largestIncrease).peakComparisonLabel}.` : "No positive price increase against the same month in 2025 is available in this filtered view.",
      `${positiveRows.length} of ${countries.length} countries show at least one positive post-shock price increase against the same month in 2025.`,
      noPositiveRows.length ? `${noPositiveRows.length} countries have comparable price data but no positive median increase, so they are treated as caution context rather than headline evidence.` : "No country with comparable price data is negative or flat across all available post-shock comparisons.",
      noMatchedRows.length ? `No comparable price record is available for ${compactCountryList(noMatchedRows)}.` : "All countries in this view have at least one comparable same-month price record.",
    ].forEach((message) => {
      const item = document.createElement("li");
      item.textContent = message;
      el.beforeAfterMessageList.appendChild(item);
    });
  }

  const supp = country.supplementalEvidence || {};
  const rankChange = numericValue(supp.rankChangeVsOfficial);
  if (el.beforeAfterSupplementalList) {
    el.beforeAfterSupplementalList.innerHTML = "";
    [
      ["Coverage count", `${supplementalLayerLabel(country)} across ACLED, CPI, food incidents, PortWatch and Findex; ${fmtInt(supp.missingLayerCount)} missing.`],
      ["Layer detail", `ACLED ${coverageStatusLabel(supp.acledCoverageStatus)}; CPI ${coverageStatusLabel(supp.cpiCoverageStatus)}; food incidents ${coverageStatusLabel(supp.foodIncidentCoverageStatus)}; PortWatch ${coverageStatusLabel(supp.portwatchCoverageStatus)}; Findex ${coverageStatusLabel(supp.findexCoverageStatus)}.`],
      ["Supplemental score check", supp.augmentedScore !== null && supp.augmentedScore !== undefined ? `Context-only score ${fmt(supp.augmentedScore)} / 100, rank ${supp.augmentedRank || "n/a"}${rankChange !== null ? `, rank change ${fmt(rankChange, 0)}` : ""}.` : "No context-only supplemental score is available."],
      ["How to use it", supp.interpretation || "Use supplemental coverage to explain context and data gaps. The published Shock Exposure Index remains the main ranking."],
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
      ? `Overview table shows the top ${tableRows.length} positive like-for-like price increases. Price records compared are WFP/HDX market, commodity and unit records matched between a 2026 post-shock month and the same month in 2025. Supplemental coverage means five public context layers: ACLED conflict events, CPI, food incidents, PortWatch port activity and Findex gender-finance data.`
      : `${tableRows.length} countries in this collapsed table after the active filters. Price records compared are like-for-like WFP/HDX market, commodity and unit records; supplemental coverage means ACLED conflict events, CPI, food incidents, PortWatch port activity and Findex gender-finance data. Rows with no positive rise or no comparable price record are kept as interpretation context.`;
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
          label: "Peak price increase vs 2025",
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
          borderWidth: 0,
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
  const limited = filteredCountries()
    .filter((country) => country.dataConfidence?.level === "Limited")
    .slice(0, 8);
  el.rankingConfidenceList.innerHTML = "";
  if (!limited.length) {
    const item = document.createElement("span");
    item.className = "confidence-pill";
    item.dataset.confidence = "Stronger";
    item.textContent = "No limited-data flags in this filtered view";
    el.rankingConfidenceList.appendChild(item);
    return;
  }
  const intro = document.createElement("span");
  intro.className = "confidence-label";
  intro.textContent = "Limited-data flags";
  el.rankingConfidenceList.appendChild(intro);
  limited.forEach((country) => {
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
  el.countryProxyRank.textContent = country.genderProxy?.rank ? `#${country.genderProxy.rank}` : "n/a";
  el.countryMissing.textContent = fmtInt(country.componentMissingCount);
  el.countryConfidence.textContent = country.dataConfidence?.level || "n/a";
  el.countryConfidence.parentElement.dataset.confidence = country.dataConfidence?.level || "";
  el.countryConfidence.parentElement.title = country.dataConfidence?.note || "";
  el.countryFocus.textContent = country.technicalFocus || "No technical focus note available.";

  renderImputationPanel(country);

  el.pathwayList.innerHTML = "";
  country.pathways
    .filter((pathway) => pathway.label)
    .forEach((pathway) => {
      const item = document.createElement("div");
      item.className = "pathway-item";

      const text = document.createElement("div");
      const label = document.createElement("div");
      label.className = "pathway-label";
      label.textContent = displayPathwayLabel(pathway.label);
      const meter = document.createElement("div");
      meter.className = "pathway-meter";
      const fill = document.createElement("span");
      fill.style.width = `${clamp((pathway.score || 0) * 100)}%`;
      meter.appendChild(fill);
      text.appendChild(label);
      text.appendChild(meter);

      const score = document.createElement("div");
      score.className = "pathway-score";
      score.textContent = fmt(pathway.score, 2);
      item.appendChild(text);
      item.appendChild(score);
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
          max: 1,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.navy, font: chartFont() },
        },
      },
    }),
  });
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
          label: "Risk delta",
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

function renderGenderChart() {
  if (!window.Chart) return;
  destroyChart("gender");
  const ctx = document.getElementById("gender-chart");
  if (!ctx) return;
  const rows = filteredCountries()
    .filter((country) => country.genderProxy?.score !== null && country.genderProxy?.score !== undefined)
    .sort((a, b) => (b.genderProxy.score || 0) - (a.genderProxy.score || 0))
    .slice(0, 10);
  charts.gender = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.country),
      datasets: [
        {
          data: rows.map((row) => row.genderProxy.score),
          backgroundColor: rows.map((row, index) => {
            if (row.iso3 === state.selectedIso) return COLORS.navy;
            return index < 3 ? COLORS.red : COLORS.neutralLight;
          }),
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
    }),
  });
}

function renderGenderDriverChart() {
  if (!window.Chart) return;
  destroyChart("genderDrivers");
  const ctx = document.getElementById("gender-driver-chart");
  if (!ctx) return;
  const country = countryByIso(state.selectedIso);
  if (el.genderDriverTitle) el.genderDriverTitle.textContent = `${country.country}: gender-lens drivers`;
  const entries = GENDER_DRIVER_COMPONENTS.map((entry) => ({
    ...entry,
    value: country.components?.[entry.key],
  }));
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
          max: 1,
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Bounded component score, 0-1", color: COLORS.muted, font: chartFont() },
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
          title: { display: true, text: "Points in gender proxy score", color: COLORS.muted, font: chartFont() },
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
  const rows = indexContributionRows(country)
    .sort((a, b) => (b.points || 0) - (a.points || 0));
  charts.indexDecomposition = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.label),
      datasets: [
        {
          label: "Weighted index points",
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
  const rows = filteredCountries()
    .filter((country) => country.genderProxy?.score !== null && country.genderProxy?.score !== undefined)
    .sort((a, b) => (b.genderProxy.score || 0) - (a.genderProxy.score || 0))
    .slice(0, 3);
  rows.forEach((country) => {
    appendLensItem(
      el.genderLensList,
      `#${country.genderProxy.rank || "n/a"} ${country.country}`,
      `${fmt(country.genderProxy.score)} gender proxy score`,
      country.genderProxy.boundary || "Proxy exposure priority only - not a measured outcome."
    );
  });
  const saddAvailable = data.countries.filter((country) => country.readiness?.sexDisaggregatedOutcomeAvailable).length;
  appendLensItem(
    el.genderLensList,
    "Measured women/girls outcome coverage",
    `${fmtInt(saddAvailable)}/${fmtInt(data.countries.length)} countries`,
    "Public IPC rows are total-population severity; the dashboard does not infer women/girls IPC counts."
  );
}

function renderGenderMonitoringList() {
  if (!el.genderMonitoringList) return;
  el.genderMonitoringList.innerHTML = "";
  const country = countryByIso(state.selectedIso);
  const topDrivers = genderProxyContributionRows(country)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 3)
    .map((row) => row.label.toLowerCase())
    .join(", ");
  appendLensItem(
    el.genderMonitoringList,
    "Use",
    "Prioritize monitoring",
    `${country.country}'s strongest gender-proxy drivers are ${topDrivers || "not available"}. Use them to decide which questions to validate with country teams.`
  );
  appendLensItem(
    el.genderMonitoringList,
    "Ask for",
    "SADD outcomes",
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

  const legacyWeight = fmtShare(data.indexWeights?.displacement_pressure_score, 0);
  const internalWeight = fmtShare(data.indexWeights?.public_displacement_layer_score, 0);
  const rule = document.createElement("div");
  rule.className = "displacement-rule-panel";
  const ruleCards = document.createElement("div");
  ruleCards.className = "displacement-rule-grid";
  [
    [
      "1. Legacy external/refugee proxy",
      `${legacyWeight} of the index`,
      "Continuity input from the earlier dashboard workflow. A 0.00 means the older proxy did not capture displacement pressure for that country."
    ],
    [
      "2. IDMC/IOM internal displacement layer",
      `${internalWeight} of the index`,
      "Current internal-displacement evidence layer. This is where internal displacement is counted for Palestine, Yemen and similar cases."
    ],
  ].forEach(([title, value, note]) => {
    const card = document.createElement("div");
    card.className = "displacement-rule-item";
    appendText(card, "strong", title);
    appendText(card, "span", value);
    appendText(card, "p", note);
    ruleCards.appendChild(card);
  });
  rule.appendChild(ruleCards);
  appendText(
    rule,
    "p",
    "Interpretation rule: if the legacy proxy is 0.00 but the IDMC/IOM layer is above 0.00, the country is not a zero-displacement case. It has internal displacement relevance through the separate IDMC/IOM layer.",
    "displacement-plain-language"
  );
  el.displacementClarityList.appendChild(rule);

  ["PSE", "YEM"].map((iso3) => data.countries.find((country) => country.iso3 === iso3)).filter(Boolean).forEach((country) => {
    const legacy = country.components?.displacement_pressure_score;
    const internal = country.components?.public_displacement_layer_score;
    const legacyPercent = clamp((numericValue(legacy) || 0) * 100, 0, 100);
    const internalPercent = clamp((numericValue(internal) || 0) * 100, 0, 100);
    const row = document.createElement("div");
    row.className = "displacement-country-row";

    const heading = document.createElement("div");
    heading.className = "displacement-country-heading";
    appendText(heading, "strong", country.country);
    appendText(
      heading,
      "span",
      `Readout: legacy ${fmt(legacy, 2)}, internal ${fmt(internal, 2)}`
    );
    row.appendChild(heading);

    appendText(
      row,
      "p",
      `${country.country} has a ${fmt(legacy, 2)} legacy proxy score, but a ${fmt(internal, 2)} IDMC/IOM internal-displacement score. Treat it as internally displacement-relevant, not as a zero-displacement case.`,
      "displacement-country-takeaway"
    );

    const metrics = document.createElement("div");
    metrics.className = "displacement-score-pair";
    [
      ["Legacy external/refugee proxy", legacy, legacyPercent, "legacy"],
      ["IDMC/IOM internal displacement layer", internal, internalPercent, "internal"],
    ].forEach(([label, value, percent, type]) => {
      const metric = document.createElement("div");
      metric.className = `displacement-score-line ${type}`;
      const header = document.createElement("div");
      header.className = "displacement-score-header";
      appendText(header, "span", label);
      appendText(header, "strong", fmt(value, 2));
      const track = document.createElement("div");
      track.className = "displacement-score-track";
      const fill = document.createElement("div");
      fill.className = "displacement-score-fill";
      fill.style.width = `${percent}%`;
      track.appendChild(fill);
      metric.append(header, track);
      metrics.appendChild(metric);
    });
    row.appendChild(metrics);

    const idmc = numericValue(country.indicators?.idmcConflictTotalDisplacement);
    const iom = numericValue(country.indicators?.iomLatestIdpSum);
    const idmcText = idmc === null ? "no IDMC conflict IDP value in the public pull" : `${fmtCompact(idmc)} IDMC conflict IDPs`;
    const iomText = iom === null ? "no IOM selected DTM IDP value in public summaries" : `${fmtCompact(iom)} IOM selected DTM IDPs`;
    appendText(row, "p", `Public evidence pulled: ${idmcText}; ${iomText}.`, "displacement-source-note");

    el.displacementClarityList.appendChild(row);
  });
}

function renderCountryGenderLens() {
  if (!el.countryGenderList) return;
  const country = countryByIso(state.selectedIso);
  el.countryGenderList.innerHTML = "";
  appendLensItem(
    el.countryGenderList,
    "Gender proxy priority",
    `${fmt(country.genderProxy?.score)} (${country.genderProxy?.tier || "tier n/a"})`,
    country.genderProxy?.boundary || "Proxy exposure priority only - not a measured before/after impact on girls or women."
  );
  appendLensItem(
    el.countryGenderList,
    "Gender vulnerability component",
    fmt(country.components?.gender_vulnerability_score, 2),
    "Structural gender/labour vulnerability input; it is separate from measured food-security outcomes."
  );
  appendLensItem(
    el.countryGenderList,
    "IPC input",
    `${fmtPct(country.indicators?.ipcPhase3PlusPct)} Phase 3+ total population`,
    "IPC is used, but the public IPC pull is not sex-disaggregated."
  );
  appendLensItem(
    el.countryGenderList,
    "Internal displacement layer",
    `IDMC/IOM score ${fmt(country.components?.public_displacement_layer_score, 2)}`,
    `${fmtCompact(country.indicators?.idmcConflictTotalDisplacement)} IDMC conflict IDPs; ${fmtCompact(country.indicators?.iomLatestIdpSum)} IOM selected DTM IDPs where available.`
  );
  appendLensItem(
    el.countryGenderList,
    "Legacy displacement proxy",
    fmt(country.components?.displacement_pressure_score, 2),
    "Continuity proxy from the earlier dashboard version; interpret separately from internal displacement."
  );
  appendLensItem(
    el.countryGenderList,
    "Assistance pressure",
    fmt(country.components?.assistance_pressure_score, 2),
    "Included in the gender proxy because assistance access and funding constraints can have differential gender effects."
  );
  appendLensItem(
    el.countryGenderList,
    "Female labour and household proxy",
    `${fmtPct(country.informality?.femaleInformalEmploymentPct)} informal employment | ${fmtPct(country.indicators?.femaleHeadedHouseholdsPct)} female-headed households`,
    "Use as structural vulnerability evidence and a prompt for field validation."
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
  el.countryGenderIndicatorTable.innerHTML = "";
  const table = document.createElement("table");
  table.className = "indicator-mini-table-inner";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Indicator</th><th>Value</th><th>How to read it</th></tr>";
  const tbody = document.createElement("tbody");
  rows.forEach(([label, value, note]) => {
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
    ["Gender causal model", country.readiness.genderCausal],
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

function renderTable() {
  if (!el.countryTableBody) return;
  el.countryTableBody.innerHTML = "";
  const countries = filteredCountries();
  if (el.countryTableSummary) {
    const geography = state.geography === "All geographies" ? "all geographies" : state.geography.toLowerCase();
    const region = state.region === "All regions" ? "all regions" : state.region;
    el.countryTableSummary.textContent = `${countries.length} countries shown for ${region}, ${geography}; table summarizes published ranking fields. Use data confidence and main gap to see where interpretation is weaker.`;
  }
  if (el.countryTableCardList) {
    el.countryTableCardList.innerHTML = "";
  }
  countries.forEach((country) => {
    if (el.countryTableCardList) {
      el.countryTableCardList.appendChild(createMobileTableCard(
        `${country.rank ? `#${country.rank} ` : ""}${country.country}`,
        `${country.region} · ${countryGeography(country)}`,
        [
          ["Score", fmt(country.score)],
          ["Tier", country.riskTier || "n/a"],
          ["Data confidence", country.dataConfidence?.level || "n/a"],
          ["Top pathway", displayPathwayLabel(country.pathways?.[0]?.label)],
          ["Gender proxy", fmt(country.genderProxy?.score)],
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
      displayPathwayLabel(country.pathways?.[0]?.label),
      fmtPct(country.indicators.ipcPhase3PlusPct),
      fmt(country.genderProxy?.score),
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

function markerSize(score) {
  return 12 + clamp(score, 0, 100) / 5;
}

function renderMapFallback() {
  if (!el.map) return;
  el.map.innerHTML = "";
  const fallback = document.createElement("div");
  fallback.className = "map-fallback";
  filteredCountries().forEach((country) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${country.country}: ${fmt(country.score)} (${country.riskTier})`;
    button.addEventListener("click", () => {
      state.selectedIso = country.iso3;
      populateCountrySelect();
      renderAll();
    });
    fallback.appendChild(button);
  });
  el.map.appendChild(fallback);
}

function initMap() {
  if (!el.map) return;
  if (!window.maplibregl || !el.map) {
    renderMapFallback();
    return;
  }
  map = new maplibregl.Map({
    container: el.map,
    style: {
      version: 8,
      sources: {
        carto: {
          type: "raster",
          tiles: [
            "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
            "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
            "https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution: "Map tiles by CARTO",
        },
      },
      layers: [
        {
          id: "carto",
          type: "raster",
          source: "carto",
        },
      ],
    },
    center: [45, 18],
    zoom: 1.4,
    attributionControl: false,
  });
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
  map.scrollZoom.disable();
  map.on("load", renderMapMarkers);
  map.on("idle", () => {
    if (!markers.length) renderMapMarkers();
  });
  setTimeout(() => {
    if (!markers.length) renderMapMarkers();
  }, 250);
  setTimeout(() => {
    if (!markers.length) renderMapMarkers();
  }, 1200);
}

function renderMapMarkers() {
  if (!map) return;
  markers.forEach((marker) => marker.remove());
  markers = [];
  const countries = filteredCountries().filter((country) => country.lat !== null && country.lon !== null);
  const bounds = new maplibregl.LngLatBounds();
  countries.forEach((country) => {
    const markerElement = document.createElement("button");
    markerElement.type = "button";
    markerElement.className = "map-marker";
    markerElement.dataset.tier = country.riskTier || "";
    const size = markerSize(country.score);
    markerElement.style.width = `${size}px`;
    markerElement.style.height = `${size}px`;
    markerElement.title = `${country.country}: ${fmt(country.score)} (${country.riskTier})`;
    if (country.iso3 === state.selectedIso) {
      markerElement.style.outline = `3px solid ${COLORS.navy}`;
      markerElement.style.outlineOffset = "2px";
    }
    markerElement.addEventListener("click", () => {
      state.selectedIso = country.iso3;
      populateCountrySelect();
      renderAll();
    });
    const marker = new maplibregl.Marker({ element: markerElement, anchor: "center" }).setLngLat([country.lon, country.lat]).addTo(map);
    markers.push(marker);
    bounds.extend([country.lon, country.lat]);
  });
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 44, maxZoom: 4.2, duration: 0 });
  }
}

function renderAll() {
  renderMeta();
  renderFilterSummary();
  renderMessages();
  renderBeforeAfter();
  renderCountryProfile();
  renderRankingChart();
  renderRankingConfidence();
  renderComponentChart();
  renderScenarioChart();
  renderRegionChart();
  renderGenderChart();
  renderGenderDriverChart();
  renderGenderDecompositionChart();
  renderIndexDecompositionChart();
  renderGenderLensList();
  renderGenderMonitoringList();
  renderDisplacementClarity();
  renderCountryGenderLens();
  renderCountryGenderIndicators();
  renderReadiness();
  renderCoverage();
  renderTable();
  if (map) renderMapMarkers();
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
  if (el.mapReset) el.mapReset.addEventListener("click", () => {
    state.region = "All regions";
    state.geography = "All geographies";
    state.selectedIso = data.summary.topCountry?.iso3 || data.countries[0]?.iso3;
    populateControls();
    renderAll();
  });
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
  initMap();
}

init();
