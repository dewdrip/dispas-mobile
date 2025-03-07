import { JsonRpcProvider } from 'ethers';
import { ALCHEMY_KEY } from '../../../scaffold.config';

export function useENSProvider() {
  const ensProvider = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`;
  const provider = new JsonRpcProvider(ensProvider);

  return provider;
}
