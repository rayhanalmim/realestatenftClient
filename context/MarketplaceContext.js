import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import { MARKETPLACE_ADDRESS, rpcProvider } from "../Config";

import marketplaceABI from '../MarketplaceAbi.json';

export const MarketplaceContext = createContext();

export function useMarketplace() {
  return useContext(MarketplaceContext);
}

export const MarketplaceProvider = ({ children }) => {
  const { data: signer } = useSigner();
  const [marketplace, setMarketplace] = useState(null)
  useEffect(() => {
    const marketplaceContract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceABI, signer || rpcProvider);
    setMarketplace(marketplaceContract);
  }, [signer]);


  return (
    <MarketplaceContext.Provider value={{ marketplace }}>
      {children}
    </MarketplaceContext.Provider>
  );
};
