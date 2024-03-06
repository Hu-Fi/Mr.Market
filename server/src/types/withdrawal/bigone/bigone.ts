export interface FeeResponse {
  code: number;
  message: string;
  data: AssetData;
}

interface AssetData {
  name: string;
  symbol: string;
  contract_address: string;
  is_deposit_enabled: boolean;
  is_withdrawal_enabled: boolean;
  is_stub: boolean;
  withdrawal_fee: string;
  is_fiat: boolean;
  is_memo_required: boolean;
  logo: Logo;
  info_link: string | null;
  scale: number;
  default_gateway: Gateway;
  gateways: Gateway[];
  payments: any[];
  uuid: string;
  binding_gateways: BindingGateway[];
}

interface Logo {
  default: string;
  white: string;
}

interface Gateway {
  uuid: string;
  name: string;
  kind: string;
  required_confirmations: number;
  is_graphene: boolean;
}

interface BindingGateway {
  guid: string;
  contract_address: string;
  is_deposit_enabled: boolean;
  display_name: string;
  gateway_name: string;
  min_withdrawal_amount: string;
  min_internal_withdrawal_amount: string;
  withdrawal_fee: string;
  is_withdrawal_enabled: boolean;
  min_deposit_amount: string;
  is_memo_required: boolean;
  withdrawal_scale: number;
  sort_index: number;
  gateway: Gateway;
  scale: number;
}
