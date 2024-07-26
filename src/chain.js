import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./contants";
import { ABI } from "./contractABI";

export const contract = getContract({
    client,
    chain: defineChain(80002),
    address: "0xC5962D17D16208dAC9E566bB2869b4C44Ca29092",
    // abi: ABI
});
