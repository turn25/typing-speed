import React, { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import {
  Container,
  Box,
  Text,
  Heading,
  Center,
  Collapse,
  Input,
  Button,
  SimpleGrid,
  useColorModeValue,
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
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(-1);
  const [currentChar, setCurrentChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [completedWordsIdx, setCompletedWordsIdx] = useState([]);

  const inputRef = useRef(null);

  const correctClass = useColorModeValue(
    "bg-green-400 text-white",
    "bg-teal-500 text-gray-800"
  );
  const errorClass = useColorModeValue(
    "bg-red-400 text-white",
    "bg-violet-500 text-gray-800"
  );

  const backClass = useColorModeValue(
    "bg-gray-600 text-white",
    "bg-gray-200 text-gray-800"
  );

  const cardBg = useColorModeValue("#ebf8ff", "gray.700");

  useEffect(() => {
    //focus to input when click on start btn
    if (isStart) inputRef.current.focus();
  }, [isStart]);

  const generateWords = () => {
    return new Array(NUMBER_OF_WORDS).fill(null).map(() => randomWords());
  };

  const handleResetState = () => {
    setCompletedWordsIdx([]);
    setWords(generateWords);
    setCountDown(SECONDS);
    setCurrentChar("");
    setCurrentWordIdx(0);
    setCurrentCharIdx(-1);
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
          setCurrentInput("");
          setIsStart(false);
          setIsDone(true);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
  };

  const handleKeyDown = e => {
    if (e.keyCode === 229) return;

    if (e.keyCode === 32 || e.keyCode === 13) {
      checkMatch();
      setCurrentInput("");
      setCompletedWordsIdx(prevWordsIdx => [...prevWordsIdx, currentWordIdx]);
      setCurrentWordIdx(currentIdx => currentIdx + 1);
      setCurrentCharIdx(-1);
    } else if (e.keyCode === 8) {
      //backspace
      if (currentCharIdx === -1) return;
      setCurrentCharIdx(currentCharIdx => currentCharIdx - 1);
      setCurrentChar("");
    } else {
      setCurrentCharIdx(currentCharIdx => currentCharIdx + 1);
      setCurrentChar(e.key);
    }
  };

  const checkMatch = () => {
    const wordToCompare = words[currentWordIdx];
    const isMatch = wordToCompare === currentInput;
    if (isMatch) {
      setCorrect(correct => correct + 1);
    } else {
      setIncorrect(incorrect => incorrect + 1);
    }
  };

  const getWordClass = idx => {
    if (completedWordsIdx && completedWordsIdx.includes(idx)) {
      return "line-through opacity-50";
    } else return "opacity-100";
  };

  const getCharClass = (wordIdx, charIdx, char) => {
    if (
      wordIdx === currentWordIdx &&
      charIdx === currentCharIdx &&
      currentChar
    ) {
      if (
        currentChar === char &&
        // check if current input matches with the word
        currentInput.slice(0, charIdx) === words[wordIdx].slice(0, charIdx)
      )
        return correctClass;
      else return errorClass;
    }
    // show error when input word length > word length
    else if (
      wordIdx === currentWordIdx &&
      currentCharIdx > words[currentWordIdx].length - 1
    )
      return errorClass;
    else if (wordIdx === currentWordIdx && charIdx === currentCharIdx) {
      return backClass;
    }
    return "";
  };

  return (
    <Container maxW="container.xl" className="transition">
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
          onChange={e => setCurrentInput(e.target.value.split(" ").join(""))} //remove blank spacebar when reset value
          disabled={!isStart}
          ref={inputRef}
          autoComplete="off"
        />
      </Box>
      <Box marginY="5">
        <Button
          colorScheme={useColorModeValue("blue", "teal")}
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
        <Box
          padding="5"
          rounded="md"
          shadow="xl"
          bg={cardBg}
          textAlign="justify"
          fontSize="20"
        >
          {words.map((word, idx) => (
            //get every character of the word
            <React.Fragment key={idx}>
              <span className={`${getWordClass(idx)} transition `}>
                {word.split("").map((char, index) => (
                  <span key={index} className={getCharClass(idx, index, char)}>
                    {char}
                  </span>
                ))}
              </span>
              <span> </span>
            </React.Fragment>
          ))}
        </Box>
      </Collapse>

      <Collapse in={isDone} animateOpacity unmountOnExit>
        <SimpleGrid columns={[1, null, 3]} spacing={1} my={10}>
          <Box textAlign="center">
            <Text fontWeight="bold">Correct Word(s):</Text>
            <Heading textColor={useColorModeValue("blue.400", "cyan.400")}>
              {correct}
            </Heading>
          </Box>
          <Box textAlign="center">
            <Text fontWeight="bold">Incorect Word(s):</Text>
            <Heading textColor={useColorModeValue("red.400", "purple.400")}>
              {incorrect}
            </Heading>
          </Box>
          <Box textAlign="center">
            <Text fontWeight="bold">Accuracy:</Text>
            <Heading textColor={useColorModeValue("green.400", "teal.400")}>
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
  );
}

export default App;
