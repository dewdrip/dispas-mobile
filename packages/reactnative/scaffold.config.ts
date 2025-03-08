export type Config = {
  networks: NetworkConfig;
};

export type Network = {
  name: string;
  provider: string;
  id: number;
  currencySymbol: string;
  coingeckoPriceId: string;
  blockExplorer: string | null;
};

export type NetworkConfig = {
  [key: string]: Network;
};

// This is our default Alchemy API key.
// You can get your own at https://dashboard.alchemyapi.io
export const ALCHEMY_KEY = 'K18rs5rCTi1A-RDyPUw92tvL7I2cGVUB';

const config: Config = {
  // The networks on which your DApp is live
  networks: {
    localhost: {
      name: 'Lukso Local',
      provider: 'http://192.168.0.124:8545',
      id: 1337,
      currencySymbol: 'LYX',
      coingeckoPriceId: 'lukso-token-2',
      blockExplorer: 'https://explorer.execution.mainnet.lukso.network'
    },
    arbitrum: {
      name: 'Arbitrum',
      provider: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      id: 42161,
      currencySymbol: 'ARB',
      coingeckoPriceId: 'arbitrum',
      blockExplorer: 'https://arbiscan.io'
    },
    lukso: {
      name: 'Lukso',
      provider: 'https://rpc.mainnet.lukso.network',
      id: 42,
      currencySymbol: 'LYX',
      coingeckoPriceId: 'lukso-token-2',
      blockExplorer: 'https://explorer.execution.mainnet.lukso.network'
    }
  }
};

export default config satisfies Config;
