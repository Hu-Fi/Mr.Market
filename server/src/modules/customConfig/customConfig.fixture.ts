type CustomConfigEntity = {
  config_id: number;
  max_balance_mixin_bot: string;
  max_balance_single_api_key: string;
  funding_account: string;
  spot_fee: string;
};

function createMockCustomConfigEntity(
  overrides?: Partial<CustomConfigEntity>,
): CustomConfigEntity {
  return {
    config_id: 0,
    max_balance_mixin_bot: '1000',
    max_balance_single_api_key: '2000',
    funding_account: 'XYZ123',
    spot_fee: '0.02',
    ...overrides,
  };
}

export default createMockCustomConfigEntity;
