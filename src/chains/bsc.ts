import { defineChain } from "viem";

export const bsc = /*#__PURE__*/ defineChain({
  id: 56,
  name: "BNB Smart Chain",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: [
        "https://bsc.blockpi.network/v1/rpc/cb875e94899d9a9114a3ddd4a2b624215d407ab7",
        "https://56.rpc.thirdweb.com",
        "https://go.getblock.io/bc841869c5bc477b8c57802853f6698a",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "BscScan",
      url: "https://bscscan.com",
      apiUrl: "https://api.bscscan.com/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 15921452,
    },
  },
});
