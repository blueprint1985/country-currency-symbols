import { test } from "node:test";
import assert from "node:assert/strict";

import * as api from "../src/main.js";
import { currencies } from "../src/currencies.js";
import { currencySymbolMap } from "../src/currency-symbol-map.js";
import { countryCurrencyMap } from "../src/country-currency-map.js";

// ---------------------------------------------------------------------------
// Currency lookups
// ---------------------------------------------------------------------------

test("getCurrencyFromCurrencyCode returns the currency object", () => {
  assert.deepEqual(api.getCurrencyFromCurrencyCode("SEK"), {
    code: "SEK",
    number: 752,
    digits: 2,
    currency: "Swedish Krona",
  });
});

test("getCurrencyFromCurrencyCode is case-insensitive and trims", () => {
  assert.equal(api.getCurrencyFromCurrencyCode("  sek  ").code, "SEK");
});

test("getCurrencyFromCurrencyNumber accepts number, string and zero-padded", () => {
  assert.equal(api.getCurrencyFromCurrencyNumber(752).code, "SEK");
  assert.equal(api.getCurrencyFromCurrencyNumber("752").code, "SEK");
  assert.equal(api.getCurrencyFromCurrencyNumber("0752").code, "SEK");
});

test("getCurrencyFromCountryCode resolves country -> currency", () => {
  assert.equal(api.getCurrencyFromCountryCode("SE").code, "SEK");
  assert.equal(api.getCurrencyFromCountryCode("se").code, "SEK");
});

test("getCurrencyFromCountry resolves by name, case-insensitive", () => {
  assert.equal(api.getCurrencyFromCountry("Sweden").code, "SEK");
  assert.equal(api.getCurrencyFromCountry("sweden").code, "SEK");
});

test("getCurrenciesFromSymbol returns every currency sharing the symbol", () => {
  const codes = api.getCurrenciesFromSymbol("kr").map((c) => c.code).sort();
  assert.deepEqual(codes, ["DKK", "ISK", "NOK", "SEK"]);
});

// ---------------------------------------------------------------------------
// Country lookups
// ---------------------------------------------------------------------------

test("getCountryFromCountryCode returns the country object", () => {
  assert.deepEqual(api.getCountryFromCountryCode("SE"), {
    code: "SE",
    country: "Sweden",
    currencyCode: "SEK",
  });
});

test("getCountryFromCountry returns the country object", () => {
  assert.equal(api.getCountryFromCountry("Sweden").code, "SE");
});

test("getCountriesFromCurrencyCode returns all euro countries", () => {
  const countries = api.getCountriesFromCurrencyCode("EUR");
  assert.equal(countries.length, 36);
  assert.ok(countries.some((c) => c.code === "DE"));
});

test("getCountriesFromCurrencyNumber matches the code-based lookup", () => {
  assert.equal(api.getCountriesFromCurrencyNumber(978).length, 36);
});

test("getCountriesFromSymbol fans out shared symbols", () => {
  const countries = api.getCountriesFromSymbol("$");
  assert.ok(countries.length > 1);
  assert.ok(countries.some((c) => c.code === "US"));
});

// ---------------------------------------------------------------------------
// Symbol lookups
// ---------------------------------------------------------------------------

test("getSymbolFromCurrencyCode returns the symbol", () => {
  assert.equal(api.getSymbolFromCurrencyCode("SEK"), "kr");
});

test("getSymbolFromCurrencyNumber returns the symbol", () => {
  assert.equal(api.getSymbolFromCurrencyNumber(752), "kr");
});

test("getSymbolFromCountryCode returns the symbol", () => {
  assert.equal(api.getSymbolFromCountryCode("SE"), "kr");
});

test("getSymbolFromCountry returns the symbol", () => {
  assert.equal(api.getSymbolFromCountry("Sweden"), "kr");
});

// ---------------------------------------------------------------------------
// Recent data corrections
// ---------------------------------------------------------------------------

test("Curaçao and Sint Maarten use the Caribbean guilder (XCG)", () => {
  assert.equal(api.getCurrencyFromCountryCode("CW").code, "XCG");
  assert.equal(api.getCurrencyFromCountryCode("SX").code, "XCG");
  assert.equal(api.getSymbolFromCurrencyCode("XCG"), "Cg");
});

test("Bulgaria uses the euro", () => {
  assert.equal(api.getCurrencyFromCountryCode("BG").code, "EUR");
});

test("retired codes are no longer present", () => {
  for (const code of ["ANG", "BGN", "CUC", "SVC", "VED"]) {
    assert.equal(api.getCurrencyFromCurrencyCode(code), undefined);
  }
});

// ---------------------------------------------------------------------------
// Not-found behaviour
// ---------------------------------------------------------------------------

test("unknown single lookups return undefined", () => {
  assert.equal(api.getCurrencyFromCountryCode("ZZ"), undefined);
  assert.equal(api.getCurrencyFromCountry("Atlantis"), undefined);
  assert.equal(api.getCountryFromCountryCode("ZZ"), undefined);
  assert.equal(api.getSymbolFromCurrencyCode("ZZZ"), undefined);
});

test("unknown list lookups return an empty array", () => {
  assert.deepEqual(api.getCountriesFromCurrencyCode("ZZZ"), []);
  assert.deepEqual(api.getCurrenciesFromSymbol("@@@"), []);
  assert.deepEqual(api.getCountriesFromSymbol("@@@"), []);
});

// ---------------------------------------------------------------------------
// Dataset integrity
// ---------------------------------------------------------------------------

test("currencies.js and currency-symbol-map.js cover identical codes", () => {
  const a = currencies.map((c) => c.code).sort();
  const b = currencySymbolMap.map((s) => s.code).sort();
  assert.deepEqual(a, b);
});

test("every country's currencyCode exists in currencies.js", () => {
  const known = new Set(currencies.map((c) => c.code));
  const orphans = countryCurrencyMap
    .filter((c) => !known.has(c.currencyCode))
    .map((c) => `${c.code}:${c.currencyCode}`);
  assert.deepEqual(orphans, []);
});

test("country and currency codes are unique", () => {
  const countryCodes = countryCurrencyMap.map((c) => c.code);
  const currencyCodes = currencies.map((c) => c.code);
  assert.equal(new Set(countryCodes).size, countryCodes.length);
  assert.equal(new Set(currencyCodes).size, currencyCodes.length);
});
