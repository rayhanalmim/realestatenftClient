import { ethers } from "ethers";

export const MARKETPLACE_ADDRESS = '0x0914AeB6f7875e6284015FE31d3ba757865EE4a6'
export const PROPERTY_NFT_ADDRESS = '0xf442A72628b9f85fb4A7c7470A1ACaE2649e63eD'
export const rpcProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RINKEBY_URL
);
