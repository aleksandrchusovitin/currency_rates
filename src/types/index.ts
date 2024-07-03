interface ICurrency {
  ticker: string;
  description: string;
  logoURL: string;
}

interface ICurrencyRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  dayGainPercent: number;
  price: number;
  description?: string;
  logoURL?: string;
}

export type { ICurrency, ICurrencyRate };
