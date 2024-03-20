import { getMixinSafeFeeByID } from './mixinSafe';

describe('Get Fee from MixinSafe', () => {
  it('BTC fee', async () => {
    //console.log(
      await getMixinSafeFeeByID('c6d0c728-2624-429b-8e0d-d9d19b6592fa')
    //);
  });
  it('ETH fee', async () => {
    //console.log(
      await getMixinSafeFeeByID('43d61dcd-e413-450d-80b8-101d5e903357')
    // );
  });
  it('TRX fee', async () => {
    //console.log(
      await getMixinSafeFeeByID('25dabac5-056a-48ff-b9f9-f67395dc407c')
    // );
  });
});
