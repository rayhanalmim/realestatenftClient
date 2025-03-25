import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import { PROPERTY_NFT_ADDRESS, rpcProvider } from "../Config";

import propertyAbi from '../PropertyNFTAbi.json';

export const PropertyContext = createContext();

export function useProperty() {
  return useContext(PropertyContext);
}

export const PropertyProvider = ({ children }) => {
  const { data: signer } = useSigner();
  const [propertyContract, setPropertyContract] = useState(null)

  useEffect(() => {
    const property = new ethers.Contract(PROPERTY_NFT_ADDRESS, propertyAbi, signer || rpcProvider);
    setPropertyContract(property);
  }, [signer])
  

  return (
    <PropertyContext.Provider value={{ propertyContract }}>
      {children}
    </PropertyContext.Provider>
  );
};
