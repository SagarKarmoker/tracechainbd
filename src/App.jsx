import { ThirdwebProvider } from "thirdweb/react";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";
import Roles from "./pages/Roles";
import Navbar from "./components/Navbar";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "./pages/Error404";
import { useActiveAccount } from "thirdweb/react";
import Importer from "./pages/Importer.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roles />,

  },
  {
    path: "dashboard",
    element: <Dashboard />,

  },
  {
    path: "importer",
    element: <Importer />

  },
  {
    path: "*",
    element: <Error404 />,
  }
]);

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
