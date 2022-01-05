import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./lib/theme";
import MainApp from "./components/MainApp";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <MainApp />
    </ChakraProvider>
  );
}

export default App;
