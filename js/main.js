import { rules } from "./validate.js";

document.documentElement.classList.add("js");

/* Mobile navigation ------------------------------------------------------ */
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function setNav(open) {
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
  nav.classList.toggle("is-open", open);
}

navToggle.addEventListener("click", () => setNav(navToggle.getAttribute("aria-expanded") !== "true"));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    setNav(false);
    navToggle.focus();
  }
});

/* Format tabs (WAI-ARIA tabs pattern, automatic activation) -------------- */
const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(tab, focus = false) {
  for (const t of tabs) {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
  }
  if (focus) tab.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    selectTab(tabs[(next + tabs.length) % tabs.length], true);
  });
});
selectTab(tabs[0]); // panels stay visible if JS fails

/* Registration form (demo: values never leave the page) ------------------ */
const form = document.getElementById("register-form");
const status = document.getElementById("form-status");
const fields = ["name", "email", "team", "format", "rules"].map((id) => document.getElementById(id));

function checkField(input) {
  const message = rules[input.id](input.type === "checkbox" ? input.checked : input.value);
  input.setAttribute("aria-invalid", String(Boolean(message)));
  document.getElementById(`${input.id}-error`).textContent = message;
  return !message;
}

function showStatus(type, lines) {
  status.dataset.state = type;
  status.replaceChildren(...lines.map((text) => Object.assign(document.createElement("p"), { textContent: text })));
}

// Re-check a field as the visitor fixes it, but only after it has been flagged.
form.addEventListener("input", (e) => {
  if (e.target.getAttribute("aria-invalid") === "true") checkField(e.target);
});
form.addEventListener("change", (e) => {
  if (e.target.getAttribute("aria-invalid") === "true") checkField(e.target);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const invalid = fields.filter((f) => !checkField(f));

  if (invalid.length) {
    const n = invalid.length;
    showStatus("error", [`Please fix ${n} ${n === 1 ? "problem" : "problems"} below.`]);
    invalid[0].focus();
    return;
  }

  const team = form.elements.team.value.trim();
  const format = form.elements.format.selectedOptions[0].text;
  showStatus("success", [
    `Thanks! "${team}" is down for the ${format} format.`,
    "This is a demo, so nothing was sent and no email will arrive.",
  ]);
  form.reset();
  fields.forEach((f) => f.removeAttribute("aria-invalid"));
  status.focus();
});

/* "Choose this format" buttons pre-fill the form ------------------------- */
document.querySelectorAll("[data-choose]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const select = form.elements.format;
    select.value = btn.dataset.choose;
    checkField(select);
    document.getElementById("register").scrollIntoView();
    form.elements.name.focus({ preventScroll: true });
  });
});
