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
    address: "0x0EBEe52ECfB700299b611e716dDc297ec62F0017",
    // abi: ABI
});
