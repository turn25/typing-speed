import React, { useState, useEffect } from "react";
import randomWords from "random-words";
import {
  ChakraProvider,
  Container,
  Box,
  Heading,
  Center,
  Input,
  Button,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const NUMBER_OF_WORDS = 200;
const SECONDS = 60;

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);

  useEffect(() => {
    setWords(generateWords);
  }, []);

  const generateWords = () => {
    return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords());
  };

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="container.xl">
        <Box
          as="nav"
          display="flex"
          wrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          p="4"
          w="100%"
          css={{ backdropFilter: "blur(10px)" }}
          zIndex={1}
        >
          <Heading>Typing Speed App</Heading>
          <ColorModeSwitcher />
        </Box>
        <Center>
          <Heading colorScheme="teal">60</Heading>
        </Center>
        <Box>
          <Input type="text" variant="flushed" />
        </Box>
        <Box marginY="5">
          <Button colorScheme="blue" w="100%">
            Start
          </Button>
        </Box>
        <Box
          padding="5"
          marginY="5"
          rounded="md"
          shadow="xl"
          textAlign="justify"
        >
          {words.map((word, idx) => (
            <span key={idx}>{word} </span>
          ))}
        </Box>
        <Center textColor="gray.500">
          &copy; {new Date().getFullYear()} Tuan Vu.
        </Center>
      </Container>
    </ChakraProvider>
  );
}

export default App;
