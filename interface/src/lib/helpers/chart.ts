import { sma } from "technicalindicators";
import { ColorType } from "lightweight-charts";
import { formatDecimals } from "$lib/helpers/utils";

// Coin single line Chart
export const coinChartOptions = {
  autoSize: true,
  height: 300,
  layout: {
    textColor: "#d1d4dc",
    background: {
      type: ColorType.Solid,
      color: "transparent",
    },
  },
  timeScale: {
    visible: false,
    borderVisible: false,
    timeVisible: false,
    lockVisibleTimeRangeOnResize: true,
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    visible: false,
  },
  grid: {
    vertLines: {
      color: "rgba(42, 46, 57, 0)",
    },
    horzLines: {
      color: "rgba(42, 46, 57, 0)",
    },
  },
  watermark: {
    visible: false,
  },
  handleScroll: {
    mouseWheel: false,
    pressedMouseMove: false,
    horzTouchDrag: false,
    vertTouchDrag: false,
  },
  handleScale: {
    axisPressedMouseMove: false,
    mouseWheel: false,
    pinch: false,
  },
};

// CandleStick Chart (lightweight chart)
export const candleChartOptions = {
  autoSize: true,
  height: 300,
  layout: {
    textColor: "#000000",
    background: {
      type: ColorType.Solid,
      color: "#ffffff",
    },
    fontSize: 10,
  },
  timeScale: {
    visible: true,
    borderVisible: false,
    timeVisible: false,
    lockVisibleTimeRangeOnResize: true,
  },
  rightPriceScale: {
    borderVisible: false,
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
    visible: true,
  },
  localization: {
    // dateFormat: "'dd MMM \'yyyy'"
  },
  crosshair: {
    // mode: CrosshairMode.Normal,

  },
  grid: {
    vertLines: {
      color: "rgba(42, 46, 57, 0)",
    },
    horzLines: {
      color: "rgba(42, 46, 57, 0)",
    },
  },
  watermark: {
    visible: false,
  },
  handleScroll: {
    mouseWheel: false,
    pressedMouseMove: false,
    vertTouchDrag: false,
  },
};

export const lineOptions = {
  lineWidth: 2,
  lineVisible: false,
  priceLineVisible: false,
  color: "#10b981" // green-500
};

export const candleLineOptions = {
  priceLineVisible: false,
  wickUpColor: "#15803d", // green-700
  upColor: "#15803d", // green-700
  wickDownColor: "#ef4444", // red-500
  downColor: "#ef4444", // red-500
  borderVisible: false,
}

export const MALineOptions = {
  priceLineVisible: false,
}

export const getMA = (source: any[], r: number = 5) => {
  const final = []
  const closes = source.map(item => item.close);
  const arr = sma({ period: r, values: closes })

  console.log('closes.length:', closes.length)
  console.log('arr.length:', arr.length)


  for (let i = 0; i < arr.length; i++) {
    final.push(
      {
        time: source[i + r - 1].time,
        value: formatDecimals(arr[i], 3)
      }
    )
  }
  console.log('correctness:', arr.length === final.length)
  console.log('arr:', arr)
  console.log('final:', final)
  console.log('\n')

  // for (let k=r, j=0; k<arr.length; k++, j++) {
  //   final.push({time: source[k].time, value: formatDecimals(arr[j], 3)})
  // }
  // console.log('final.length:', final.length)
  return final
}