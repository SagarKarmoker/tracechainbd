import { getContract, defineChain } from "thirdweb";
import { client } from "./contants";
import { ABI } from "./contractABI";


export const contract = getContract({
  client,
  chain: defineChain({
    id: 148460,
    rpc: "https://vercel-blockchain-proxy-nine.vercel.app/",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  }),
  address: "0xacb653cB3DE904756353C1a7291E5a82e0746605",
  // abi: ABI
});
