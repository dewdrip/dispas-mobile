import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNetwork } from './useNetwork';

const COINGECKO_PRICE_API_ROUTE =
  'https://api.coingecko.com/api/v3/simple/price';

type PriceData = {
  [key: string]: {
    usd: number;
  };
};

type CryptoPriceState = {
  price: number | null;
  loading: boolean;
  error: string | null;
};

type UseCryptoPriceParams = {
  priceID?: string; // Coingecko price identifier - ethereum(DEFAULT), arbitrum, e.t.c
  decimalPlaces?: number;
  enabled?: boolean;
};

export const useCryptoPrice = ({
  priceID = 'ethereum',
  decimalPlaces = 2,
  enabled = true
}: UseCryptoPriceParams = {}) => {
  const [state, setState] = useState<CryptoPriceState>({
    price: null,
    loading: true,
    error: null
  });

  const fetchPrice = async () => {
    try {
      const response = await axios.get<PriceData>(COINGECKO_PRICE_API_ROUTE, {
        params: {
          ids: priceID,
          vs_currencies: 'usd'
        }
      });

      if (response.data[priceID]) {
        const price = parseFloat(
          response.data[priceID].usd.toFixed(decimalPlaces)
        );
        setState({ price, loading: false, error: null });
      } else {
        throw new Error('Invalid Price ID');
      }
    } catch (error: any) {
      setState({ price: null, loading: false, error: error.message });
    }
  };

  const network = useNetwork();

  useEffect(() => {
    if (!enabled) return;

    fetchPrice();
  }, [priceID, decimalPlaces, network]);

  return {
    ...state,
    fetchPrice
  };
};
