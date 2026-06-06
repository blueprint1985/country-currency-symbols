export interface Currency {
  /** ISO 4217 alphabetic code, e.g. "SEK". */
  code: string;
  /** ISO 4217 numeric code, e.g. 752. */
  number: number;
  /** Number of minor-unit digits, e.g. 2. */
  digits: number;
  /** Currency name, e.g. "Swedish Krona". */
  currency: string;
}

export interface Country {
  /** ISO 3166-1 alpha-2 code, e.g. "SE". */
  code: string;
  /** Country name, e.g. "Sweden". */
  country: string;
  /** ISO 4217 alphabetic code of the country's currency, e.g. "SEK". */
  currencyCode: string;
}

export interface CurrencySymbol {
  /** ISO 4217 alphabetic code, e.g. "SEK". */
  code: string;
  /** Currency symbol, e.g. "kr". */
  symbol: string;
}
