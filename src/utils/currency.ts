import { Currency } from '../types';

export const DEFAULT_USD_TO_LBP_RATE = 89500;

export function formatPrice(amountUSD: number, currency: Currency, rate: number = DEFAULT_USD_TO_LBP_RATE): string {
  if (currency === 'USD') {
    return `$${amountUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  
  const amountLBP = Math.round(amountUSD * rate);
  return `${amountLBP.toLocaleString('en-US')} L.L.`;
}

export function formatBothCurrencies(amountUSD: number, primaryCurrency: Currency, rate: number = DEFAULT_USD_TO_LBP_RATE): {
  primary: string;
  secondary: string;
} {
  if (primaryCurrency === 'USD') {
    return {
      primary: formatPrice(amountUSD, 'USD', rate),
      secondary: formatPrice(amountUSD, 'LBP', rate)
    };
  } else {
    return {
      primary: formatPrice(amountUSD, 'LBP', rate),
      secondary: formatPrice(amountUSD, 'USD', rate)
    };
  }
}
