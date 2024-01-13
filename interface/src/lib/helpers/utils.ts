import BigNumber from "bignumber.js";
import mixinChains from "$lib/constants/mixinChains.json"
import moment from "moment";

export const BN = BigNumber.clone({ DECIMAL_PLACES: 8 })
export const BN2 = BigNumber.clone({ DECIMAL_PLACES: 2 })

export const formatTimestampToTime = (t: string | number, showMinutes: boolean = false) => {
  return moment(t).format(showMinutes? "YYYY-MM-DD HH:mm": "YYYY-MM-DD");
}

export const formatUsUnit = (x: string | number) => {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(Number(x));
}
export const formatUSNumber = (x: string | number) => {
  return new Intl.NumberFormat('en-US').format(Number(x))
}
export const formatUSMoney = (x: string | number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 8 }).format(Number(x))
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
      return parseFloat(`${integerPart}.${decimalPart.slice(0, n+getNonZeroDecimalIndex(decimalPart)-1)}`);
    }
  }
  return Math.floor(Number(s) * 10 ** n) / 10 ** n
}
export const formatChartPrice = (s: string | number) => {
  const strValue = Number(s).toString();
  if (strValue.includes('.')) {
    const [integerPart, decimalPart] = strValue.split('.');

    let finalDecimalLength = 0;
    if (integerPart.length > 2) finalDecimalLength = 2;
    else if (integerPart.length == 2) finalDecimalLength = 3;
    else finalDecimalLength = 8 - integerPart.length;
    return parseFloat(`${integerPart}.${decimalPart.slice(0, finalDecimalLength)}`);
  }
}

export const formatAssetBalance = (s: string | number, n: number) => {
  if (Number(s) == undefined || Number(s) == null || Number(s) == 0) return 0
  
  if (Number(s) < 0.000001) return Number(s).toFixed(8)
  if (Number(s) < 1) return Math.floor(Number(s) * 10 ** 8) / 10 ** 8
  const strValue = Number(s).toString();
  if (strValue.includes('.')) {
    const [integerPart, decimalPart] = strValue.split('.');
    if (decimalPart.length > n) {
      return parseFloat(`${integerPart}.${decimalPart.slice(0, n+getNonZeroDecimalIndex(decimalPart)-1)}`);
    }
  }
  return Math.floor(Number(s) * 10 ** n) / 10 ** n
}

const getNonZeroDecimalIndex = (decimalPart: string) => {
  let index = 0
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] !== '0') {
      index = i;
      break;
    }
  }
  return index
}

export const formatWalletBalance = (num: number, lang: string = 'en') => {
  if (num < 1 && num.toString().split('.')[1]?.length > 8) {
    return formatDecimals(num, 9);
  } else if (num.toString().includes('.')) {
    const [integerPart, decimalPart] = num.toString().split('.');
    const truncatedDecimal = decimalPart.slice(0, 8 - integerPart.length);
    return `${integerPart}.${truncatedDecimal}`;
  } else {
    return num;
  }
}

export const formatWalletBalanceFull = (num: number, lang: string = 'en') => {
  if (num < 1 && num.toString().split('.')[1]?.length > 8) {
    return formatDecimals(num, 9);
  } else {
    return num;
  }
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
  return mixinChains[0].icon_url;
}

export const daysBetweenToday = (d1: string) => {
  let date1 = new Date(d1);
  let date2 = new Date();
  let diff = date2.getTime() - date1.getTime();

  return Math.round(diff / (1000 * 3600 * 24)).toString()
}