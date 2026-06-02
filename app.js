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

const state = {
  region: "All regions",
  selectedIso: data.summary.topCountry?.iso3 || data.countries[0]?.iso3,
  scenario: "assistance_cut_50pct",
};

const charts = {
  ranking: null,
  component: null,
  scenario: null,
  region: null,
  gender: null,
};

let map;
let markers = [];

const el = {
  progressBar: document.getElementById("reading-progress-bar"),
  metaCountryCount: document.getElementById("meta-country-count"),
  metaGenerated: document.getElementById("meta-generated"),
  kpiCountries: document.getElementById("kpi-countries"),
  kpiTopCountry: document.getElementById("kpi-top-country"),
  kpiTopScore: document.getElementById("kpi-top-score"),
  kpiHighCount: document.getElementById("kpi-high-count"),
  kpiSadd: document.getElementById("kpi-sadd"),
  methodBoundary: document.getElementById("method-boundary"),
  regionFilter: document.getElementById("region-filter"),
  countrySelect: document.getElementById("country-select"),
  scenarioSelect: document.getElementById("scenario-select"),
  messageList: document.getElementById("message-list"),
  countryRegion: document.getElementById("country-region"),
  countryName: document.getElementById("country-name"),
  countryScore: document.getElementById("country-score"),
  countryScoreFill: document.getElementById("country-score-fill"),
  countryTier: document.getElementById("country-tier"),
  countryRank: document.getElementById("country-rank"),
  countryProxyRank: document.getElementById("country-proxy-rank"),
  countryMissing: document.getElementById("country-missing"),
  pathwayList: document.getElementById("pathway-list"),
  countryFocus: document.getElementById("country-focus"),
  map: document.getElementById("country-map"),
  mapReset: document.getElementById("map-reset"),
  scenarioTitle: document.getElementById("scenario-title"),
  scenarioNote: document.getElementById("scenario-note"),
  readinessList: document.getElementById("readiness-list"),
  coverageList: document.getElementById("coverage-list"),
  weightsList: document.getElementById("weights-list"),
  countryTableBody: document.getElementById("country-table-body"),
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

function fmtShare(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "n/a";
  const number = Number(value);
  return fmtPct(Math.abs(number) <= 1 ? number * 100 : number, digits);
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function countryByIso(iso3) {
  return data.countries.find((country) => country.iso3 === iso3) || data.countries[0];
}

function regions() {
  return ["All regions", ...Array.from(new Set(data.countries.map((country) => country.region))).sort()];
}

function filteredCountries() {
  const countries = state.region === "All regions" ? data.countries : data.countries.filter((country) => country.region === state.region);
  return [...countries].sort((a, b) => (a.rank || 999) - (b.rank || 999));
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

function availableScenarios() {
  const present = new Set(data.scenarios.map((row) => row.scenario));
  const ordered = SCENARIO_ORDER.filter((scenario) => present.has(scenario));
  const extras = Array.from(present).filter((scenario) => !ordered.includes(scenario)).sort();
  return [...ordered, ...extras];
}

function chartFont() {
  return {
    family: '"Source Sans 3", "Segoe UI", Arial, sans-serif',
    size: 12,
    weight: "700",
  };
}

function baseChartOptions(extra = {}) {
  return {
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
    ...extra,
  };
}

function destroyChart(name) {
  if (charts[name]) {
    charts[name].destroy();
    charts[name] = null;
  }
}

function renderMeta() {
  el.metaCountryCount.textContent = `${data.summary.countryCount} countries`;
  el.metaGenerated.textContent = `Generated ${data.metadata.generated}`;
  el.kpiCountries.textContent = data.summary.countryCount;
  el.kpiTopCountry.textContent = data.summary.topCountry?.country || "n/a";
  el.kpiTopScore.textContent = `Score ${fmt(data.summary.topCountry?.score)} / 100`;
  el.kpiHighCount.textContent = data.summary.veryHighOrHighCount;
  el.kpiSadd.textContent = data.summary.sexDisaggregatedOutcomeCountries;
  el.methodBoundary.textContent = data.metadata.methodBoundary;
  el.footerSource.textContent = `Source workbook: ${data.metadata.sourceWorkbook}`;
}

function populateControls() {
  el.regionFilter.innerHTML = "";
  regions().forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    el.regionFilter.appendChild(option);
  });
  el.regionFilter.value = state.region;

  el.scenarioSelect.innerHTML = "";
  availableScenarios().forEach((scenario) => {
    const option = document.createElement("option");
    option.value = scenario;
    option.textContent = scenarioLabel(scenario);
    el.scenarioSelect.appendChild(option);
  });
  if (!availableScenarios().includes(state.scenario)) state.scenario = availableScenarios()[0];
  el.scenarioSelect.value = state.scenario;

  populateCountrySelect();
}

function populateCountrySelect() {
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

function renderMessages() {
  el.messageList.innerHTML = "";
  data.keyMessages.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    el.messageList.appendChild(item);
  });
}

function renderRankingChart() {
  if (!window.Chart) return;
  destroyChart("ranking");
  const countries = filteredCountries();
  const selected = state.selectedIso;
  const ctx = document.getElementById("ranking-chart");
  charts.ranking = new Chart(ctx, {
    type: "bar",
    data: {
      labels: countries.map((country) => country.country),
      datasets: [
        {
          label: "Shock Exposure Index",
          data: countries.map((country) => country.score),
          backgroundColor: countries.map((country) => (country.iso3 === selected ? COLORS.navy : tierColor(country.riskTier))),
          borderWidth: 0,
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

function renderCountryProfile() {
  const country = countryByIso(state.selectedIso);
  el.countryRegion.textContent = country.region;
  el.countryName.textContent = country.country;
  el.countryScore.textContent = fmt(country.score);
  el.countryScoreFill.style.width = `${clamp(country.score)}%`;
  el.countryTier.textContent = country.riskTier || "n/a";
  el.countryRank.textContent = country.rank ? `#${country.rank}` : "n/a";
  el.countryProxyRank.textContent = country.genderProxy?.rank ? `#${country.genderProxy.rank}` : "n/a";
  el.countryMissing.textContent = fmtInt(country.componentMissingCount);
  el.countryFocus.textContent = country.technicalFocus || "No technical focus note available.";

  el.pathwayList.innerHTML = "";
  country.pathways
    .filter((pathway) => pathway.label)
    .forEach((pathway) => {
      const item = document.createElement("div");
      item.className = "pathway-item";

      const text = document.createElement("div");
      const label = document.createElement("div");
      label.className = "pathway-label";
      label.textContent = pathway.label;
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

function renderComponentChart() {
  if (!window.Chart) return;
  destroyChart("component");
  const country = countryByIso(state.selectedIso);
  const entries = Object.entries(data.componentLabels).map(([key, label]) => ({
    key,
    label,
    value: country.components[key],
  }));
  const ctx = document.getElementById("component-chart");
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
  const scenarioRows = data.scenarios
    .filter((row) => row.scenario === state.scenario)
    .filter((row) => state.region === "All regions" || countryByIso(row.countryiso3)?.region === state.region)
    .sort((a, b) => (b.risk_delta_0_100 || 0) - (a.risk_delta_0_100 || 0))
    .slice(0, 10);

  el.scenarioTitle.textContent = `${scenarioLabel(state.scenario)}: largest risk deltas`;
  const selectedRow = data.scenarios.find((row) => row.scenario === state.scenario && row.countryiso3 === state.selectedIso);
  el.scenarioNote.textContent = selectedRow
    ? `${countryByIso(state.selectedIso).country}: delta ${fmt(selectedRow.risk_delta_0_100)} points; scenario score ${fmt(selectedRow.scenario_score_0_100)}.`
    : "No scenario row available for the selected country.";

  const ctx = document.getElementById("scenario-chart");
  charts.scenario = new Chart(ctx, {
    type: "bar",
    data: {
      labels: scenarioRows.map((row) => row.country),
      datasets: [
        {
          label: "Risk delta",
          data: scenarioRows.map((row) => row.risk_delta_0_100),
          backgroundColor: scenarioRows.map((row) => (row.countryiso3 === state.selectedIso ? COLORS.navy : COLORS.gold)),
          borderRadius: 2,
        },
      ],
    },
    options: baseChartOptions({
      indexAxis: "y",
      scales: {
        x: {
          grid: { color: COLORS.grid },
          ticks: { color: COLORS.muted, font: chartFont() },
          title: { display: true, text: "Score movement, points", color: COLORS.muted, font: chartFont() },
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
  const rows = [...data.regionCounts].sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0));
  const ctx = document.getElementById("region-chart");
  charts.region = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.region),
      datasets: [
        {
          data: rows.map((row) => row.averageScore),
          backgroundColor: rows.map((row) => (row.region === state.region ? COLORS.navy : COLORS.teal)),
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
  const rows = filteredCountries()
    .filter((country) => country.genderProxy?.score !== null && country.genderProxy?.score !== undefined)
    .sort((a, b) => (b.genderProxy.score || 0) - (a.genderProxy.score || 0))
    .slice(0, 10);
  const ctx = document.getElementById("gender-chart");
  charts.gender = new Chart(ctx, {
    type: "bar",
    data: {
      labels: rows.map((row) => row.country),
      datasets: [
        {
          data: rows.map((row) => row.genderProxy.score),
          backgroundColor: rows.map((row) => (row.iso3 === state.selectedIso ? COLORS.navy : COLORS.red)),
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

function renderReadiness() {
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
  const country = countryByIso(state.selectedIso);
  const c = country.additionalCoverage;
  const items = [
    ["IDMC annual internal displacement", c.idmcAnnualAvailable ? `${fmtCompact(c.idmcConflictTotalDisplacement)} conflict IDPs, ${c.idmcLatestYear || "latest year n/a"}` : "Not available in public pull"],
    ["IDMC 2026 displacement events", c.idmcEventsAvailable ? `${fmtCompact(c.idmcPostShockFigureTotal)} post-shock figure total` : "Not available in public pull"],
    ["IOM DTM public summary", c.iomDtmAvailable ? `${fmtCompact(c.iomLatestIdpSum)} latest selected IDP sum` : "Not available in public pull"],
    ["WFP public food-security outcomes", c.wfpFsiAvailable ? `${fmtShare(c.wfpPoorBorderlineFoodConsumptionPct)} poor/borderline food consumption` : "Not available in public pull"],
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

function renderWeights() {
  el.weightsList.innerHTML = "";
  Object.entries(data.indexWeights).forEach(([key, weight]) => {
    const item = document.createElement("div");
    item.className = "weight-item";

    const text = document.createElement("div");
    text.className = "weight-copy";
    const label = document.createElement("strong");
    label.textContent = data.componentLabels[key] || key;
    const definition = document.createElement("p");
    definition.textContent = data.componentDefinitions?.[key] || "Documented model component used in the composite index.";
    text.appendChild(label);
    text.appendChild(definition);

    const body = document.createElement("span");
    body.className = "weight-value";
    const value = document.createElement("b");
    value.textContent = `${fmt(weight * 100, 0)}%`;
    const meter = document.createElement("div");
    meter.className = "weight-meter";
    const fill = document.createElement("span");
    fill.style.width = `${weight * 100 * 4}%`;
    meter.appendChild(fill);
    body.appendChild(value);
    body.appendChild(meter);
    item.appendChild(text);
    item.appendChild(body);
    el.weightsList.appendChild(item);
  });
}

function renderTable() {
  el.countryTableBody.innerHTML = "";
  filteredCountries().forEach((country) => {
    const row = document.createElement("tr");
    const values = [
      country.rank ? `#${country.rank}` : "n/a",
      country.country,
      country.region,
      fmt(country.score),
      country.riskTier || "n/a",
      country.pathways?.[0]?.label || "n/a",
      fmtPct(country.indicators.ipcPhase3PlusPct),
      fmt(country.genderProxy?.score),
      fmtPct(country.informality?.femaleInformalEmploymentPct),
      country.readiness?.mainGap || "n/a",
    ];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      if (index === 4) {
        const pill = document.createElement("span");
        pill.className = "risk-pill";
        pill.dataset.tier = country.riskTier || "";
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
  renderMessages();
  renderCountryProfile();
  renderRankingChart();
  renderComponentChart();
  renderScenarioChart();
  renderRegionChart();
  renderGenderChart();
  renderReadiness();
  renderCoverage();
  renderWeights();
  renderTable();
  if (map) renderMapMarkers();
}

function bindEvents() {
  el.regionFilter.addEventListener("change", () => {
    state.region = el.regionFilter.value;
    populateCountrySelect();
    renderAll();
  });
  el.countrySelect.addEventListener("change", () => {
    state.selectedIso = el.countrySelect.value;
    renderAll();
  });
  el.scenarioSelect.addEventListener("change", () => {
    state.scenario = el.scenarioSelect.value;
    renderAll();
  });
  el.mapReset.addEventListener("click", () => {
    state.region = "All regions";
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
