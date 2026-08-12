export const CURRENCIES = [
  { code: 'INR', label: 'Indian Rupee (₹)', locale: 'en-IN' },
  { code: 'USD', label: 'US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', label: 'Euro (€)', locale: 'de-DE' },
  { code: 'GBP', label: 'British Pound (£)', locale: 'en-GB' },
  { code: 'AUD', label: 'Australian Dollar (A$)', locale: 'en-AU' },
  { code: 'CAD', label: 'Canadian Dollar (CA$)', locale: 'en-CA' },
  { code: 'JPY', label: 'Japanese Yen (¥)', locale: 'ja-JP' },
];

export const formatMoney = (value, currency = 'USD') => {
  const selected = CURRENCIES.find((item) => item.code === currency) || CURRENCIES[1];
  return new Intl.NumberFormat(selected.locale, { style: 'currency', currency: selected.code }).format(value || 0);
};
