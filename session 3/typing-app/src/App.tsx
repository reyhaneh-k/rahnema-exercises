import { useEffect, useState, useCallback } from "react";
import "./App.css";
import InputText from "./components/InputText";
import InputWrapper from "./components/InputWrapper";
import ResetButton from "./components/ResetButton";
import Result from "./components/Result";
import TextDisplay from "./components/TextDisplay";
import Timer from "./components/Timer";

const typingWords = [
  "keyboard",
  "programming",
  "development",
  "algorithm",
  "function",
  "variable",
  "framework",
  "database",
  "interface",
  "application",
  "debugging",
  "syntax",
  "compiler",
  "execute",
  "network",
  "protocol",
  "encryption",
  "authentication",
  "authorization",
  "virtualization",
  "containerization",
  "deployment",
  "scalability",
  "performance",
  "optimization",
  "integration",
  "microservices",
  "continuous",
  "iteration",
  "abstraction",
];

interface CurrentWord {
  text: string;
  status: "right" | "wrong" | "typing" | "unchecked";
  id: number;
}
const testTime = 60;

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
function App() {
  const [index, setIndex] = useState<number>(0);
  const [inputText, setInputText] = useState("");
  const [intervalID, setIntervalID] = useState(0);
  const [remaining, setRemaining] = useState(testTime);
  const [finalState, setFinalState] = useState({
    totalWords: 0,
    correctWords: 0,
    time: testTime,
  });
  const [words, setWords] = useState<CurrentWord[]>(
    shuffle(typingWords).map((word, i) => {
      if (i === 0) {
        return {
          text: word,
          status: "typing",
          id: i,
        };
      }
      return {
        text: word,
        status: "unchecked",
        id: i,
      };
    })
  );
  const countDown = useCallback(() => {
    setRemaining((remaining) => remaining - 1);
  }, []);
  const incrmentIndex = useCallback(() => {
    if (index + 1 < words.length) {
      setIndex((index) => index + 1);
    } else {
      setFinalState((finalState) => ({
        ...finalState,
        time: testTime - remaining,
      }));
      setRemaining(0);
    }
  }, [words.length, index, remaining]);
  const updateWordStaus = useCallback(
    (status: CurrentWord["status"], next: boolean) => {
      setWords((words) => {
        const newWords = words.map((word) => ({ ...word }));
        newWords[index].status = status;

        if (next && index + 1 < words.length) {
          newWords[index + 1].status = "typing";
        }
        return newWords;
      });
    },
    [index]
  );
  const updateWords = useCallback(
    (typedWord: string, next: boolean) => {
      if (next) {
        if (typedWord === words[index].text) {
          console.log(typedWord, words[index].text);
          updateWordStaus("right", next);
          setFinalState((wordCount) => ({
            ...finalState,
            totalWords: wordCount.totalWords + 1,
            correctWords: wordCount.correctWords + 1,
          }));
          incrmentIndex();
        } else {
          updateWordStaus("wrong", next);
          setFinalState((wordCount) => ({
            ...wordCount,
            totalWords: wordCount.totalWords + 1,
          }));
          incrmentIndex();
        }
      } else if (typedWord === words[index].text.slice(0, typedWord.length)) {
        updateWordStaus("right", next);
      } else {
        updateWordStaus("wrong", next);
      }
    },
    [updateWordStaus, incrmentIndex, words, index, finalState]
  );
  const handleChange = useCallback(
    (word: string) => {
      if (word.length === 0) {
        updateWordStaus("typing", false);
      } else if (word.at(-1) === " ") {
        if (word.length > 1) {
          updateWords(word.trim(), true);
          if (intervalID === 0) {
            const ID = setInterval(() => {
              countDown();
            }, 1000);
            setIntervalID(Number(ID));
          }
        }
        setInputText("");
      } else {
        updateWords(word, false);
        if (intervalID === 0) {
          const ID = setInterval(() => {
            countDown();
          }, 1000);
          setIntervalID(Number(ID));
        }
      }
    },
    [updateWordStaus, updateWords, countDown, intervalID]
  );
  useEffect(() => handleChange(inputText), [inputText]);
  useEffect(() => {
    if (remaining === 0) {
      clearInterval(intervalID);
    }
  }, [remaining, intervalID]);
  const reset = () => {
    // setWords(
    //   shuffle(typingWords).map((word, i) => {
    //     if (i === 0) {
    //       return {
    //         text: word,
    //         status: "typing",
    //       };
    //     }
    //     return {
    //       text: word,
    //       status: "unchecked",
    //     };
    //   })
    // );
    // clearInterval(intervalID);
  };
  return (
    <>
      <div className="App">
        {remaining > 0 ? <TextDisplay words={words} /> : null}
        <InputWrapper>
          <InputText
            inputText={inputText}
            setInputText={setInputText}
          ></InputText>
          <Timer remainingTime={remaining} />
          <ResetButton onClick={reset}></ResetButton>
        </InputWrapper>
      </div>
      {remaining > 0 ? null : <Result finalState={finalState} />}
    </>
  );
}
export default App;
