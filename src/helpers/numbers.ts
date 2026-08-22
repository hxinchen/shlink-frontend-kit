// TODO Do not hardcode the locale
let formatter = new Intl.NumberFormat('en-US');

/** Change the locale used by `formatNumber`. Host apps call this when their language changes. */
export const setNumberFormatLocale = (locale: string) => {
  formatter = new Intl.NumberFormat(locale);
};

export const formatNumber = (number: number | string) => formatter.format(Number(number));

const TEN_ROUNDING_NUMBER = 10;

export const roundTen = (number: number) => Math.ceil(number / TEN_ROUNDING_NUMBER) * TEN_ROUNDING_NUMBER;
