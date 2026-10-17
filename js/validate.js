// Field rules for the demo registration form. Each returns an error message, or "" when valid.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const rules = {
  name: (v) => (v.trim() ? "" : "Enter your name."),
  email: (v) =>
    !v.trim() ? "Enter your email address."
    : EMAIL.test(v.trim()) ? ""
    : "Enter an email address like name@example.com.",
  team: (v) =>
    !v.trim() ? "Enter a team name."
    : v.trim().length > 20 ? "Team name must be 20 characters or fewer."
    : "",
  format: (v) => (v ? "" : "Choose a format."),
  rules: (checked) => (checked ? "" : "Confirm you'll follow the league rules."),
};
