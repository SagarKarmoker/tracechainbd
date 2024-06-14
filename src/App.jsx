import { ThirdwebProvider} from "thirdweb/react";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <ThirdwebProvider>
      <ChakraProvider>

        <Dashboard />

      </ChakraProvider>
    </ThirdwebProvider>
  );
}
