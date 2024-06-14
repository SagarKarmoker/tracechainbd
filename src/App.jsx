import { ThirdwebProvider } from "thirdweb/react";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error404 from "./pages/Error404";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <Error404 />,
  },
  {
    path: "/home",
    element: <Dashboard />,
    errorElement: <Error404 />,
  },
]);

export default function App() {
  return (
    <ThirdwebProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </ThirdwebProvider>
  );
}
