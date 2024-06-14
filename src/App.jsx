import { ThirdwebProvider } from "thirdweb/react";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";
import Roles from "./pages/Roles";
import Navbar from "./components/Navbar";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "./pages/Error404";
import { useActiveAccount } from "thirdweb/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roles />,
    errorElement: <Error404 />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <Error404 />,
  },
]);

export default function App() {
  const smartAccount = useActiveAccount();

  return (
    <ThirdwebProvider>
      <ChakraProvider>
        {
          smartAccount !== null ? <Navbar visible={true} /> : <Navbar visible={false} />
        }
        <RouterProvider router={router} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
