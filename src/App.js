import React, { useState, useEffect } from "react";
import randomWords from "random-words";
import {
  ChakraProvider,
  Container,
  Box,
  Heading,
  Center,
  Collapse,
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWorldIdx, setCurrentWordIdx] = useState(0);

  useEffect(() => {
    setWords(generateWords);
  }, []);

  const generateWords = () => {
    return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords());
  };

  const start = () => {
    setCountDown(SECONDS);
    setIsLoading(true);
    let intervalId = setInterval(() => {
      setCountDown(prevTime => {
        if (prevTime === 0) {
          clearInterval(intervalId);
          setIsLoading(false);

          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
  };

  const handleKeyDown = ({ keyCode }) => {
    //spacebar
    if (keyCode === 32) {
      checkMatch();
      setCurrentInput("");
      setCurrentWordIdx(currentIdx => currentIdx + 1);
    }
  };

  const checkMatch = () => {
    console.log(currentInput);
    const wordToCompare = words[currentWorldIdx];
    const doesItMatch = wordToCompare === currentInput.trim(); //remove blank spacebar
    console.log(doesItMatch);
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
          mb="6"
          w="100%"
          zIndex={1}
        >
          <Heading>Typing Speed App</Heading>
          <ColorModeSwitcher />
        </Box>
        <Center my="5">
          <Heading colorScheme="teal">{countDown}</Heading>
        </Center>
        <Box>
          <Input
            name="wordInput"
            type="text"
            variant="flushed"
            value={currentInput}
            onKeyDown={handleKeyDown}
            onChange={e => setCurrentInput(e.target.value)}
          />
        </Box>
        <Box marginY="5">
          <Button
            colorScheme="blue"
            w="100%"
            shadow="md"
            isLoading={isLoading}
            loadingText="Starting"
            onClick={start}
          >
            Start
          </Button>
        </Box>
        <Collapse in={isLoading} animateOpacity unmountOnExit>
          <Box padding="5" rounded="md" shadow="xl" textAlign="justify">
            {words.map((word, idx) => (
              //get every character of the word
              <React.Fragment key={idx}>
                <span>
                  {word.split("").map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </span>
                <span> </span>
              </React.Fragment>
            ))}
          </Box>
        </Collapse>
        <Box
          textColor="gray.500"
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          display="flex"
          w="100%"
          justifyContent="center"
          css={{ backdropFilter: "blur(10px)" }}
        >
          &copy; {new Date().getFullYear()} Tuan Vu.
        </Box>
      </Container>
    </ChakraProvider>
  );
}

export default App;
