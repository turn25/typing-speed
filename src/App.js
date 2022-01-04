import React, { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import {
  ChakraProvider,
  Container,
  Box,
  Text,
  Heading,
  Center,
  Collapse,
  Input,
  Button,
  SimpleGrid,
  theme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

const NUMBER_OF_WORDS = 200;
const SECONDS = 60;

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [isStart, setIsStart] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [currentWorldIdx, setCurrentWordIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    //focus to input when click on start btn
    if (isStart) inputRef.current.focus();
  }, [isStart]);

  const generateWords = () => {
    return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords());
  };

  const handleResetState = () => {
    setWords(generateWords);
    setCountDown(SECONDS);
    setCurrentInput("");
    setCorrect(0);
    setIncorrect(0);
    setIsStart(true);
    setIsDone(false);
  };

  const start = () => {
    handleResetState();
    let intervalId = setInterval(() => {
      setCountDown(prevTime => {
        if (prevTime === 1) {
          clearInterval(intervalId);
          setIsStart(false);
          setIsDone(true);
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
    const wordToCompare = words[currentWorldIdx];
    const isMatch = wordToCompare === currentInput.trim(); //remove blank spacebar
    if (isMatch) {
      setCorrect(correct => correct + 1);
    } else {
      setIncorrect(incorrect => incorrect + 1);
    }
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
            disabled={!isStart}
            ref={inputRef}
          />
        </Box>
        <Box marginY="5">
          <Button
            colorScheme="blue"
            w="100%"
            shadow="md"
            isLoading={isStart}
            loadingText="Starting"
            onClick={start}
          >
            Start
          </Button>
        </Box>
        <Collapse in={isStart} animateOpacity unmountOnExit>
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

        <Collapse in={isDone} animateOpacity unmountOnExit>
          <SimpleGrid columns={2} spacing={1} my={10}>
            <Box textAlign="center">
              <Text fontWeight="bold">Word per minute:</Text>
              <Heading>{correct}</Heading>
            </Box>
            <Box textAlign="center">
              <Text fontWeight="bold">Accuracy:</Text>
              <Heading>
                {correct === 0
                  ? 0
                  : Math.floor((correct / (correct + incorrect)) * 100)}
                %
              </Heading>
            </Box>
          </SimpleGrid>
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
