import { BigNumber, ethers } from 'ethers';
import { ERC20_ABI } from '../abis';

export async function readDecimals(
  provider: ethers.providers.Provider,
  token: string,
) {
  if (token === ethers.constants.AddressZero) return 18;
  const erc = new ethers.Contract(token, ERC20_ABI, provider);
  return await erc.decimals();
}

export async function ensureAllowance(
  signer: ethers.Signer,
  token: string,
  owner: string,
  spender: string,
  needed: BigNumber,
) {
  const erc = new ethers.Contract(token, ERC20_ABI, signer);
  const allowance: BigNumber = await erc.allowance(owner, spender);
  if (allowance.lt(needed)) {
    const tx = await erc.approve(spender, ethers.constants.MaxUint256);
    await tx.wait();
  }
}
