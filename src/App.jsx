import { ThirdwebProvider } from "thirdweb/react";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { useActiveAccount } from "thirdweb/react";

export default function App() {
  const smartAccount = useActiveAccount();

  return (
    <>
      <ThirdwebProvider>
        <ChakraProvider>
          {
            smartAccount && smartAccount.address ? <Navbar visible={true} /> : <Navbar visible={false} />
          }
          {/* <RouterProvider router={router} /> */}
        </ChakraProvider>
      </ThirdwebProvider>
    </>

  );
}
