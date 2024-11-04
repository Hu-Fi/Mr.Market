// HSBC Fiat Rate
export interface FiatRateItem {
    ccyPair: string;
    latest: {
        open: number;
    };
}

// ChainLink USDT/USD Rate Oracle
interface ChainDataNode {
    inputs: {
        answer: number;
    };
}

interface ChainData {
    nodes: ChainDataNode[];
}

export interface ChainLinkResponseData {
    data: {
        chainData: ChainData;
    };
}