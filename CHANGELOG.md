# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-06

### Added

- Initial release.
- Datasets covering 153 circulating currencies (`currencies`), their symbols
  (`currencySymbolMap`), and 246 countries/territories (`countryCurrencyMap`),
  each importable as a subpath export.
- Lookup API:
  - `getCurrencyFromCurrencyCode`, `getCurrencyFromCurrencyNumber`,
    `getCurrencyFromCountryCode`, `getCurrencyFromCountry`,
    `getCurrenciesFromSymbol`
  - `getCountryFromCountryCode`, `getCountryFromCountry`,
    `getCountriesFromCurrencyCode`, `getCountriesFromCurrencyNumber`,
    `getCountriesFromSymbol`
  - `getSymbolFromCurrencyCode`, `getSymbolFromCurrencyNumber`,
    `getSymbolFromCountryCode`, `getSymbolFromCountry`
- Bundled TypeScript declarations (`Currency`, `Country`, `CurrencySymbol`).
- Case-insensitive code/name lookups and numeric codes accepted as number,
  string, or zero-padded string.

### Notes

- Currency data reflects changes current as of June 2026, including
  Bulgaria adopting the euro (2026) and the Caribbean guilder (`XCG`)
  replacing the Netherlands Antillean guilder (`ANG`).
- Non-circulating ISO 4217 codes (precious metals, bond market units, fund /
  unit-of-account codes, and testing/placeholder codes) are excluded.

[1.0.0]: https://github.com/blueprint1985/country-currency-symbols/releases/tag/v1.0.0
