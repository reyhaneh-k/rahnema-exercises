import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

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
  const [startedTyping, setStartedTyping] = useState(false);
  const [intervalID, setIntervalID] = useState(0);
  const [remaining, setRemaining] = useState(testTime);
  const [totalWords, setTotalWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
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
    setIndex((index) => (index + 1 < words.length ? index + 1 : index));
  }, [words.length]);
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
          setCorrectWords((correctWords) => correctWords + 1);
          setTotalWords((totalWords) => totalWords + 1);
          incrmentIndex();
        } else {
          updateWordStaus("wrong", next);
          setTotalWords((totalWords) => totalWords + 1);
          incrmentIndex();
        }
      } else if (typedWord === words[index].text.slice(0, typedWord.length)) {
        updateWordStaus("right", next);
      } else {
        updateWordStaus("wrong", next);
      }
    },
    [updateWordStaus, incrmentIndex, words, index]
  );
  const handleChange = useCallback(
    (word: string) => {
      if (word.length === 0) {
        updateWordStaus("typing", false);
      } else if (word.at(-1) === " ") {
        if (word.length > 1) {
          updateWords(word.trim(), true);
          setStartedTyping(true);
        }
        setInputText("");
      } else {
        updateWords(word, false);
        setStartedTyping(true);
      }
    },
    [updateWordStaus, updateWords]
  );
  useEffect(() => handleChange(inputText), [inputText]);
  useEffect(() => {
    if (startedTyping) {
      const ID = setInterval(() => {
        countDown();
      }, 1000);
      setIntervalID(Number(ID));
    }
  }, [startedTyping, countDown]);
  useEffect(() => {
    if (remaining === 0) {
      clearInterval(intervalID);
    }
  }, [remaining, intervalID]);
  const Reset = () => {
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
        <TextDisplay remainingTime={remaining} words={words} />
        <InputWrapper
          inputText={inputText}
          setInputText={(arg: string) => setInputText(arg)}
          remaining={remaining}
          Reset={Reset}
        ></InputWrapper>
      </div>
      <Result
        remainingTime={remaining}
        correctWords={correctWords}
        totalWords={totalWords}
      />
    </>
  );
}
function InputWrapper({
  remaining,
  Reset,
  inputText,
  setInputText,
}: {
  remaining: number;
  Reset: () => void;
  inputText: string;
  setInputText: (arg: string) => void;
}) {
  return (
    <section className="InputWrap">
      <InputText inputText={inputText} setInputText={setInputText}></InputText>
      <Timer remainingTime={remaining} />
      <ResetButton Reset={Reset}></ResetButton>
    </section>
  );
}
function InputText({
  inputText,
  setInputText,
}: {
  inputText: string;
  setInputText: (arg: string) => void;
}) {
  return (
    <input
      value={inputText}
      type="text"
      className="inputForm"
      onChange={(event) => {
        setInputText(event.target.value);
      }}
    />
  );
}
function TextDisplay({
  remainingTime,
  words,
}: {
  remainingTime: number;
  words: CurrentWord[];
}) {
  const word2D = useCallback(
    (words: CurrentWord[], maxChar = 70): CurrentWord[][] => {
      const setWordLines = (
        prev: {
          arr: CurrentWord[];
          char: number;
        }[],
        cur: CurrentWord,
        index: number,
        array: CurrentWord[]
      ) => {
        if (prev.at(-1)!.char + cur.text.length < maxChar) {
          prev.at(-1)!.arr.push(cur);
          prev.at(-1)!.char += cur.text.length;
          return prev;
        }
        prev.push({
          arr: [cur],
          char: cur.text.length,
        });
        return prev;
      };
      return words
        .reduce(setWordLines, [
          {
            arr: [],
            char: 0,
          },
        ])
        .map((line) => line.arr);
    },
    []
  );
  const [wordLines, setWordLines] = useState(word2D(words));
  const [displayLines, setDisplayLines] = useState(0);
  const style = {
    display: remainingTime > 0 ? "block" : "none",
  };

  useEffect(() => {
    setWordLines(word2D(words));
  }, [words, word2D]);

  useEffect(() => {
    setDisplayLines((displayLines) => {
      if (
        (wordLines[displayLines].at(-1)?.status === "wrong" ||
          wordLines[displayLines].at(-1)?.status === "right") &&
        displayLines + 2 < wordLines.length &&
        wordLines[displayLines + 1][0].status === "typing"
      ) {
        return displayLines + 1;
      }
      return displayLines;
    });
  }, [words, wordLines]);

  return (
    <div className="TextDisplay" style={style}>
      {wordLines.slice(displayLines, displayLines + 2).map((line, i) => {
        return (
          <div style={{ lineHeight: "30px" }} key={i}>
            {line.map((word, j) => (
              <span
                className="word"
                key={word.id}
                style={{
                  backgroundColor:
                    word.status === "wrong"
                      ? "#F88379"
                      : word.status === "right"
                      ? "#ACE1AF"
                      : word.status === "typing"
                      ? "lightgray"
                      : word.status === "unchecked"
                      ? "none"
                      : "none",
                }}
              >
                {word.text}{" "}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
function Timer({ remainingTime }: { remainingTime: number }) {
  return <span className="timerDisplay">{remainingTime}</span>;
}
function ResetButton({ Reset }: { Reset: () => void }) {
  return (
    <button className="retryButton" onClick={Reset}>
      Reset
    </button>
  );
}
function Result({
  remainingTime,
  correctWords,
  totalWords,
}: {
  remainingTime: number;
  correctWords: number;
  totalWords: number;
}) {
  const style = {
    display: remainingTime === 0 ? "flex" : "none",
  };
  return (
    <div className="Result" style={style}>
      <span>WPM: {totalWords}</span>
      <span>Correct Words: {correctWords}</span>
      <span>Wrong Words: {totalWords - correctWords}</span>
    </div>
  );
}

export default App;
