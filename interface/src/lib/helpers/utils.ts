import BigNumber from "bignumber.js";
import mixinChains from "$lib/constants/mixinChains.json"
import moment from "moment";

const toFixed = (amount: string | number, decimalPlaces: number): string => {
  const parts = `${amount}`.split('.')
  const integerPart = parts[0];
  const decimalPart = parts[1] || ''
  const paddedDecimalPart = decimalPart.padEnd(decimalPlaces, '0').slice(0, decimalPlaces)
  return `${integerPart}.${paddedDecimalPart}`
}

export const BN = BigNumber.clone({ DECIMAL_PLACES: 8 })
export const BN2 = BigNumber.clone({ DECIMAL_PLACES: 2 })

export const formatTimestampToTime = (t: string | number, showMinutes: boolean = false, showSeconds: boolean = false) => {
  return moment(t).format(showMinutes? showSeconds ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm": "YYYY-MM-DD");
}

export const formatUsUnit = (x: string | number) => {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(x));
}
export const formatUSNumber = (x: string | number) => {
  return new Intl.NumberFormat('en-US').format(Number(x))
}
export const formatUSMoney = (x: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 10 }).format(Number(x))
}
export const formatUSMoneyUnit = (x: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(Number(x))
}
export const formatDecimals = (s: string | number, n: number) => {
  if (Number(s) == undefined || Number(s) == null || Number(s) == 0) return 0

  const strValue = Number(s).toString();
  if (strValue.includes('.')) {
    const [integerPart, decimalPart] = strValue.split('.');
    if (decimalPart.length > n) {
      return parseFloat(`${integerPart}.${decimalPart.slice(0, n)}`);
    }
    if (n === 0) {
      return parseFloat(integerPart)
    }
  }
  const final = Math.floor(Math.abs(Number(s)) * 10 ** n) / 10 ** n
  if (final === 0) return 0
  return Number(s) > 0 ? final : -final
}
export const formatChartPrice = (s: string | number) => {
  const numValue = Number(s);
  const strValue = numValue.toString();

  // Handle the case when there is no decimal point
  if (!strValue.includes('.')) {
    return numValue;
  }

  if (numValue < 0.0001) return numValue;
  const [integerPart, decimalPart] = strValue.split('.');
  let finalDecimalLength = 0;

  // s >= 100, 2 decimals
  if (integerPart.length > 2) finalDecimalLength = 2;

  // 10 <= s < 100, 3 decimals
  else if (integerPart.length == 2) finalDecimalLength = 3;

  // 1 <= s < 10, 8 decimals
  else if (integerPart.length == 1) finalDecimalLength = 8;

  // 0.0001 <= s < 1, 8 decimals
  else if (numValue >= 0.0001 && numValue < 1) finalDecimalLength = 8;

  // s < 0.0001, all decimals
  else if (numValue < 0.0001) finalDecimalLength = decimalPart.length;

  return parseFloat(`${integerPart}.${decimalPart.slice(0, finalDecimalLength)}`);
}

export const formatWalletBalance = (num: number, lang: string = 'en') => {
  lang;

  if (num < 1 && num.toString().split('.')[1]?.length > 8) {
    return formatDecimals(num, 8);
  } else if (num >= 10000000) {
    return formatDecimals(num, 0);
  } else if (num.toString().includes('.')) {
    const [integerPart, decimalPart] = num.toString().split('.');
    const truncatedDecimal = decimalPart.slice(0, 8 - integerPart.length);
    return Number(`${integerPart}.${truncatedDecimal}`)
  } else {
    return num;
  }
}

export const formatWalletBalanceFull = (num: number, lang: string = 'en') => {
  console.log('lang:', lang)
  if (num < 1 && num.toString().split('.')[1]?.length > 8) {
    return formatDecimals(num, 9);
  } else {
    return num;
  }
}

export const formatOrderBookPrice = (s: string | number) => {
  // 10000.00
  // 1000.00
  // 100.00
  // 10.00
  // 1.000
  // 0.1000
  // 0.010000
  // 0.001000
  // 0.0001000
  // 0.00001000

  const numValue = Number(s);
  const strValue = numValue.toString();

  // Handle the case when there is no decimal point
  if (!strValue.includes('.')) {
    return numValue;
  }

  if (numValue < 0.0001) return numValue;
  const [integerPart, decimalPart] = strValue.split('.');
  let finalDecimalLength = 0;

  // s >= 10, 2 decimals
  if (integerPart.length > 1) finalDecimalLength = 2;

  // 1 <= s < 10, 3 decimals
  else if (integerPart.length == 1) finalDecimalLength = 3;

  // 0.0001 <= s < 1, 8 decimals
  else if (numValue >= 0.0001 && numValue < 1) finalDecimalLength = 8;

  // s < 0.0001, all decimals
  else if (numValue < 0.0001) finalDecimalLength = decimalPart.length;

  return BN(`${integerPart}.${decimalPart.slice(0, finalDecimalLength)}`).toString();

  // Format determined by decimal places
  // return BN(Number(x)).toFixed(2)
}

export const formatOrderBookAmount = (x: string | number) => {
  return formatDecimals(x, 4)
}

export const formatFixedOrderBookAmount = (x: string | number) => {
  return toFixed(formatOrderBookAmount(x), 4);
}

export const formatFixedOrderBookPrice = (x: string | number) => {
  return toFixed(formatOrderBookPrice(x), 1)
}

export const getAssetPercentage = (balance: string | number, total: string | number) => {
  return formatDecimals(BN(balance).dividedBy(total).multipliedBy(100).toNumber(), 1)
}

export const roundToDigits = (number:number, precision: number) => {
  function customRound(number:number, precision: number) {
    const multiplier = 10 ** precision;
    const rounded = Math.round(number * multiplier) / multiplier;
    return rounded.toFixed(precision).replace(/\.?0+$/, ''); // Remove trailing zeros
  }

  if (precision === 0) {
      return Math.round(number);
  } else if (precision > 0) {
      return customRound(number, precision);
  } else {
      const divisor = 10 ** Math.abs(precision);
      return Math.round(number / divisor) * divisor;
  }
}

export const findChainIcon = (chainId: string) => {
  for (let i = 0; i < mixinChains.length; i++) {
    if (mixinChains[i]["chain_id"] === chainId) {
      return mixinChains[i].icon_url;
    }
  }
  return '';
}

export const daysBetweenToday = (d1: string) => {
  const date1 = new Date(d1);
  const date2 = new Date();
  const diff = date2.getTime() - date1.getTime();

  return Math.round(diff / (1000 * 3600 * 24)).toString()
}

export const toggleItemInArray = (array: Array<object>, field: string, item: object) => {
  const index = array.findIndex(obj => obj[field] === item[field]);

  if (index === -1) {
    // If the object isn't found, push it to the array
    array.push(item);
  } else {
    // If the object is found, remove it from the array
    array.splice(index, 1);
  }
}

export const itemInArray = (array: Array<object>, field: string, item: object) => {
  const index = array.findIndex(obj => obj[field] === item[field]);

  if (index === -1) {
    return false
  }
  return true
}

export const numberInArray = (array: Array<number>, item: number) => {
  return  array.includes(item)
}
export const toggleNumberInArray = (array: Array<number>, item: number) => {
  const index = array.indexOf(item);

  if (index === -1) {
    // If the number isn't found, push it to the array
    array.push(item);
  } else {
    // If the number is found, remove it from the array
    array.splice(index, 1);
  }
}