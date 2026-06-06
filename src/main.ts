import { currencies } from "./currencies.js";
import { currencySymbolMap } from "./currency-symbol-map.js";
import { countryCurrencyMap } from "./country-currency-map.js";
import type { Currency, Country } from "./types.js";

export type { Currency, Country, CurrencySymbol } from "./types.js";

// ---------------------------------------------------------------------------
// Lookup indexes (built once)
// ---------------------------------------------------------------------------

// currency code -> currency object
const currencyByCode = new Map<string, Currency>(
  currencies.map((c) => [c.code, c])
);

// currency number -> currency object
const currencyByNumber = new Map<number, Currency>(
  currencies.map((c) => [c.number, c])
);

// currency code -> symbol
const symbolByCode = new Map<string, string>(
  currencySymbolMap.map((s) => [s.code, s.symbol])
);

// symbol -> [currency code, ...] (a symbol such as "$" maps to many codes)
const codesBySymbol = new Map<string, string[]>();
for (const { code, symbol } of currencySymbolMap) {
  const list = codesBySymbol.get(symbol);
  if (list) list.push(code);
  else codesBySymbol.set(symbol, [code]);
}

// country code -> country object
const countryByCode = new Map<string, Country>(
  countryCurrencyMap.map((c) => [c.code, c])
);

// lowercased country name -> country object
const countryByName = new Map<string, Country>(
  countryCurrencyMap.map((c) => [c.country.toLowerCase(), c])
);

// currency code -> [country object, ...]
const countriesByCurrencyCode = new Map<string, Country[]>();
for (const c of countryCurrencyMap) {
  const list = countriesByCurrencyCode.get(c.currencyCode);
  if (list) list.push(c);
  else countriesByCurrencyCode.set(c.currencyCode, [c]);
}

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

const normCode = (v: string): string => v.trim().toUpperCase();
const normName = (v: string): string => v.trim().toLowerCase();
const normNumber = (v: number | string): number => Number(v);

// ---------------------------------------------------------------------------
// Currency lookups
// ---------------------------------------------------------------------------

/** Look up a currency by its ISO 4217 alphabetic code (e.g. "SEK"). */
export function getCurrencyFromCurrencyCode(currencyCode: string): Currency | undefined {
  return currencyByCode.get(normCode(currencyCode));
}

/** Look up a currency by its ISO 4217 numeric code (e.g. 752). */
export function getCurrencyFromCurrencyNumber(currencyNumber: number | string): Currency | undefined {
  return currencyByNumber.get(normNumber(currencyNumber));
}

/** Currency used by a country, by ISO 3166-1 alpha-2 code (e.g. "SE"). */
export function getCurrencyFromCountryCode(countryCode: string): Currency | undefined {
  const country = countryByCode.get(normCode(countryCode));
  return country ? currencyByCode.get(country.currencyCode) : undefined;
}

/** Currency used by a country, by country name (e.g. "Sweden"). */
export function getCurrencyFromCountry(country: string): Currency | undefined {
  const match = countryByName.get(normName(country));
  return match ? currencyByCode.get(match.currencyCode) : undefined;
}

/** All currencies that use the given symbol (e.g. "$" -> many). */
export function getCurrenciesFromSymbol(symbol: string): Currency[] {
  const codes = codesBySymbol.get(symbol) ?? [];
  return codes
    .map((code) => currencyByCode.get(code))
    .filter((c): c is Currency => c !== undefined);
}

// ---------------------------------------------------------------------------
// Country lookups
// ---------------------------------------------------------------------------

/** Country by ISO 3166-1 alpha-2 code (e.g. "SE"). */
export function getCountryFromCountryCode(countryCode: string): Country | undefined {
  return countryByCode.get(normCode(countryCode));
}

/** Country by name (e.g. "Sweden"). */
export function getCountryFromCountry(country: string): Country | undefined {
  return countryByName.get(normName(country));
}

/** All countries that use the given currency code (e.g. "EUR" -> many). */
export function getCountriesFromCurrencyCode(currencyCode: string): Country[] {
  return countriesByCurrencyCode.get(normCode(currencyCode)) ?? [];
}

/** All countries that use the currency with the given numeric code (e.g. 978). */
export function getCountriesFromCurrencyNumber(currencyNumber: number | string): Country[] {
  const currency = currencyByNumber.get(normNumber(currencyNumber));
  return currency ? getCountriesFromCurrencyCode(currency.code) : [];
}

/** All countries whose currency uses the given symbol (e.g. "$"). */
export function getCountriesFromSymbol(symbol: string): Country[] {
  const codes = codesBySymbol.get(symbol) ?? [];
  return codes.flatMap((code) => getCountriesFromCurrencyCode(code));
}

// ---------------------------------------------------------------------------
// Symbol lookups (return the symbol string only)
// ---------------------------------------------------------------------------

/** Symbol for a currency code (e.g. "SEK" -> "kr"). */
export function getSymbolFromCurrencyCode(currencyCode: string): string | undefined {
  return symbolByCode.get(normCode(currencyCode));
}

/** Symbol for a currency numeric code (e.g. 752 -> "kr"). */
export function getSymbolFromCurrencyNumber(currencyNumber: number | string): string | undefined {
  const currency = currencyByNumber.get(normNumber(currencyNumber));
  return currency ? symbolByCode.get(currency.code) : undefined;
}

/** Symbol for the currency of a country, by country code (e.g. "SE" -> "kr"). */
export function getSymbolFromCountryCode(countryCode: string): string | undefined {
  const country = countryByCode.get(normCode(countryCode));
  return country ? symbolByCode.get(country.currencyCode) : undefined;
}

/** Symbol for the currency of a country, by country name (e.g. "Sweden" -> "kr"). */
export function getSymbolFromCountry(country: string): string | undefined {
  const match = countryByName.get(normName(country));
  return match ? symbolByCode.get(match.currencyCode) : undefined;
}
