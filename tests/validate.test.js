import { test } from "node:test";
import assert from "node:assert/strict";
import { rules } from "../js/validate.js";

test("required fields reject blank and whitespace-only input", () => {
  for (const key of ["name", "email", "team"]) {
    assert.notEqual(rules[key](""), "");
    assert.notEqual(rules[key]("   "), "");
  }
  assert.notEqual(rules.format(""), "");
  assert.notEqual(rules.rules(false), "");
});

test("email format", () => {
  assert.equal(rules.email("sam@example.com"), "");
  assert.notEqual(rules.email("sam@example"), "");
  assert.notEqual(rules.email("sam example.com"), "");
});

test("team name length limit", () => {
  assert.equal(rules.team("a".repeat(20)), "");
  assert.notEqual(rules.team("a".repeat(21)), "");
});

test("valid values pass", () => {
  assert.equal(rules.name("Sam"), "");
  assert.equal(rules.format("h2h"), "");
  assert.equal(rules.rules(true), "");
});
