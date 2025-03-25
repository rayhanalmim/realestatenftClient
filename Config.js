import { ethers } from "ethers";

export const MARKETPLACE_ADDRESS = '0x6fF8Ffc5384D6B56e94B2254f63b234508378c0E'
export const PROPERTY_NFT_ADDRESS = '0xd852C4a292095f3d9a062C89C5985EA87d8c1008'
export const rpcProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_RINKEBY_URL
);