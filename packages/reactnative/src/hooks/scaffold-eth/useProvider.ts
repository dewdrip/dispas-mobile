import { JsonRpcProvider } from 'ethers';
import { useNetwork } from './useNetwork';

export function useProvider() {
  const network = useNetwork();

  const provider = new JsonRpcProvider(network.provider);

  return provider;
}
