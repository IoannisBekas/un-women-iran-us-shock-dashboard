(function () {
  function removeLock() {
    document.documentElement.classList.remove("auth-locked");
    const gate = document.getElementById("auth-gate");
    if (gate) gate.remove();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", removeLock);
  } else {
    removeLock();
  }
})();
