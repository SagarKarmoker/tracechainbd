import { getContract, defineChain } from "thirdweb";
import { client } from "./contants";
import { ABI } from "./contractABI";


export const contract = getContract({
  client,
  chain: defineChain({
    id: 148460,
    rpc: "https://vercel-blockchain-proxy.vercel.app",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  }),
  address: "0xf2aC16BcF4647dA288D56c985c78739BEFAC45C3",
  // abi: ABI
});
