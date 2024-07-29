import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./contants";
import { ABI } from "./contractABI";

export const contract = getContract({
    client,
    chain: defineChain(80002),
    address: "0x30599005715f8C9BDA7dd25FFD56909a16efa352",
    // abi: ABI
});
