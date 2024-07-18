import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "./contants";
import { ABI } from "./contractABI";

export const contract = getContract({
    client,
    chain: defineChain(80002),
    address: "0xE852de90A1EFc604D30b65c7a05Ef29eaf6B223e",
    abi: ABI
});
