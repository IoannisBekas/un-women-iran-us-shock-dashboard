(function () {
  const PASSWORD_HASH = "beccf0c91f56d418c84e5cb684eff4012e563863774a907f4e6c3f6e19f55fd3";
  const SESSION_KEY = "un_women_iran_us_shock_access";

  function removeLock() {
    document.documentElement.classList.remove("auth-locked");
    const gate = document.getElementById("auth-gate");
    if (gate) gate.remove();
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function buildGate() {
    const gate = document.createElement("div");
    gate.id = "auth-gate";
    gate.className = "auth-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "auth-title");
    gate.innerHTML = `
      <form class="auth-card" id="auth-form">
        <p class="auth-eyebrow">Restricted dashboard</p>
        <h1 id="auth-title">UN Women evidence dashboard</h1>
        <p class="auth-copy">Enter the access code to continue.</p>
        <label class="auth-label" for="auth-password">Access code</label>
        <input id="auth-password" class="auth-input" type="password" autocomplete="current-password" autofocus />
        <p class="auth-error" id="auth-error" aria-live="polite"></p>
        <button class="auth-button" type="submit">Open dashboard</button>
      </form>
    `;
    document.body.appendChild(gate);
    const input = document.getElementById("auth-password");
    if (input) input.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const input = document.getElementById("auth-password");
    const error = document.getElementById("auth-error");
    const value = input ? input.value.trim() : "";
    if ((await sha256(value)) === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, "granted");
      removeLock();
      return;
    }
    if (error) error.textContent = "Incorrect access code.";
    if (input) {
      input.value = "";
      input.focus();
    }
  }

  function init() {
    if (sessionStorage.getItem(SESSION_KEY) === "granted") {
      removeLock();
      return;
    }
    buildGate();
    const form = document.getElementById("auth-form");
    if (form) form.addEventListener("submit", handleSubmit);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
