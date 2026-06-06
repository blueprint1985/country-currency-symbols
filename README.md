# country-currency-symbols

Look up **currencies**, **currency symbols** and **countries** by ISO 3166-1 / ISO 4217 codes, names or symbols.

The dataset covers 153 circulating currencies and 246 countries/territories, kept current with recent changes (e.g. Bulgaria → EUR in 2026, the Caribbean guilder `XCG` replacing `ANG`).

## Installation

```sh
npm install country-currency-symbols
```

## Usage

This package is published as an ES module.

```js
import {
  getCurrencyFromCountryCode,
  getSymbolFromCountry,
  getCountriesFromCurrencyCode,
} from "country-currency-symbols";

getCurrencyFromCountryCode("SE");
// { code: "SEK", number: 752, digits: 2, currency: "Swedish Krona" }

getSymbolFromCountry("Sweden");
// "kr"

getCountriesFromCurrencyCode("EUR").length;
// 36
```

Lookups are case-insensitive for codes and names; numeric codes accept `752`, `"752"` or `"0752"`. Single-result functions return `undefined` when nothing matches; list functions return `[]`.

You can also import the raw datasets directly:

```js
import { currencies } from "country-currency-symbols/currencies";
import { currencySymbolMap } from "country-currency-symbols/currency-symbol-map";
import { countryCurrencyMap } from "country-currency-symbols/country-currency-map";
```

## Data shapes

```ts
interface Currency { code: string; number: number; digits: number; currency: string }
interface Country  { code: string; country: string; currencyCode: string }
```

## API

### Currencies

| Function | Returns |
| --- | --- |
| `getCurrencyFromCurrencyCode(currencyCode)` | `Currency` |
| `getCurrencyFromCurrencyNumber(currencyNumber)` | `Currency` |
| `getCurrencyFromCountryCode(countryCode)` | `Currency` |
| `getCurrencyFromCountry(country)` | `Currency` |
| `getCurrenciesFromSymbol(symbol)` | `Currency[]` |

### Countries

| Function | Returns |
| --- | --- |
| `getCountryFromCountryCode(countryCode)` | `Country` |
| `getCountryFromCountry(country)` | `Country` |
| `getCountriesFromCurrencyCode(currencyCode)` | `Country[]` |
| `getCountriesFromCurrencyNumber(currencyNumber)` | `Country[]` |
| `getCountriesFromSymbol(symbol)` | `Country[]` |

### Symbols

| Function | Returns |
| --- | --- |
| `getSymbolFromCurrencyCode(currencyCode)` | `string` |
| `getSymbolFromCurrencyNumber(currencyNumber)` | `string` |
| `getSymbolFromCountryCode(countryCode)` | `string` |
| `getSymbolFromCountry(country)` | `string` |

A single symbol (such as `$` or `kr`) is shared by multiple currencies, so the symbol-based lookups return lists.

## TypeScript

Type definitions are bundled (`main.d.ts`); no extra `@types` package is required.

## License

[MIT](./LICENSE) © Martin Björling
