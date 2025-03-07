import { JsonRpcProvider } from 'ethers';
import { Address } from 'viem';
import { ALCHEMY_KEY } from '../../../scaffold.config';

export function useENSProvider() {
  const ensProvider = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`;
  const provider = new JsonRpcProvider(ensProvider);

  const resolve = async (ens: string): Promise<Address | null> => {
    const address = await provider.resolveName(ens);

    return address as Address | null;
  };

  return { ensProvider: provider, resolve };
}
