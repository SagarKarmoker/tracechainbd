import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./contants";
import { ABI } from "./contractABI";

export const contract = getContract({
    client,
    chain: defineChain(80002),
    address: "0x0EBEe52ECfB700299b611e716dDc297ec62F0017",
    // abi: ABI
});
