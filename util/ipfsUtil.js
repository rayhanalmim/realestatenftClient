export const ipfs = (cid) => {
  // If it's already a full URL, return it as is
  if (cid.startsWith('http')) {
    return cid;
  }
  
  // If it's a CID with ipfs:// prefix, extract the CID
  if (cid.startsWith('ipfs://')) {
    cid = cid.substring(7);
  }
  
  // Try to extract the CID if it's in a bafkreid format URL
  if (cid.includes('bafkreid')) {
    const match = cid.match(/bafkreid[a-zA-Z0-9]+/);
    if (match) {
      cid = match[0];
    }
  }

  // Use multiple gateways for better reliability
  // You can uncomment different gateways if one doesn't work
  const gateway = "https://ipfs.io/ipfs/";
  // const gateway = "https://gateway.pinata.cloud/ipfs/";
  // const gateway = "https://cloudflare-ipfs.com/ipfs/";
  // const gateway = "https://ipfs.infura.io/ipfs/";
  
  return `${gateway}${cid}`;
}