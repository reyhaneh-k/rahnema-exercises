import {
  useEffect,
  useState,
  createContext,
  useContext,
  KeyboardEvent,
  useCallback,
} from "react";
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
  color: "#F88379" | "#ACE1AF" | "lightgray" | "none";
}

const testTime = 60;
const TimeContext = createContext({
  startedTyping: false,
  remaining: testTime,
  intervalID: 0,
  setID: (id: number) => {},
  countDown: () => {},
});
const WordsContext = createContext<{
  words: CurrentWord[];
  correctWords: number;
  totalWords: number;
}>({
  words: typingWords.map((word, i) => {
    if (i === 0) {
      return {
        text: word,
        color: "lightgray",
      };
    }
    return {
      text: word,
      color: "none",
    };
  }),
  correctWords: 0,
  totalWords: 0,
});

function App() {
  interface State {
    index: number;
  }
  const [state, setState] = useState<State>({
    index: 0,
  });
  const [startedTyping, setStartedTyping] = useState(false);
  const [intervalID, setIntervalID] = useState(0);
  const setID = (id: number) => {
    setIntervalID(id);
  };
  const [remaining, setRemaining] = useState(testTime);
  const countDown = () => {
    setRemaining((remaining) => remaining - 1);
  };
  const shuffle = useCallback((array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, []);
  const [totalWords, setTotalWords] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [words, setWords] = useState<CurrentWord[]>(
    shuffle(typingWords).map((word, i) => {
      if (i === 0) {
        return {
          text: word,
          color: "lightgray",
        };
      }
      return {
        text: word,
        color: "none",
      };
    })
  );

  const updateWords = (color: CurrentWord["color"]) => {
    setWords((words) => {
      const newWords = JSON.parse(JSON.stringify(words));

      newWords[state.index].color = color;
      if (state.index + 1 < words.length) {
        newWords[state.index + 1].color = "lightgray";
      }
      return newWords;
    });
  };
  const checkCorrection = (typedWord: string) => {
    if (typedWord === words[state.index].text) {
      updateWords("#ACE1AF");
      setCorrectWords((correctWords) => correctWords + 1);
      setTotalWords((totalWords) => totalWords + 1);
      setState((state) =>
        state.index + 1 < words.length
          ? { index: state.index + 1 }
          : { index: state.index }
      );
    } else {
      updateWords("#F88379");
      setTotalWords((totalWords) => totalWords + 1);
      setState((state) =>
        state.index + 1 < words.length
          ? { index: state.index + 1 }
          : { index: state.index }
      );
    }
  };
  const checkCorrectionWhileTyping = (typedWord: string) => {
    if (typedWord === words[state.index].text.slice(0, typedWord.length)) {
      setWords((words) => {
        const newWords = JSON.parse(JSON.stringify(words));
        newWords[state.index].color = "lightgray";
        return newWords;
      });
    } else {
      setWords((words) => {
        const newWords = JSON.parse(JSON.stringify(words));
        newWords[state.index].color = "#F88379";
        return newWords;
      });
    }
  };
  const keyDown = (word: string) => {
    const key = word.at(-1);
    if (word === "") {
      setWords((words) => {
        const newWords = JSON.parse(JSON.stringify(words));
        newWords[state.index].color = "lightgray";
        return newWords;
      });
    }
    if (typeof key !== "undefined" && /^[A-Za-z]/.test(key)) {
      checkCorrectionWhileTyping(word.trim());
    } else if (key === " ") {
      if (word.trim().length >= 1) {
        checkCorrection(word.trim());
      }
    }
    setStartedTyping(true);
  };
  return (
    <WordsContext.Provider value={{ words, correctWords, totalWords }}>
      <TimeContext.Provider
        value={{
          startedTyping,
          remaining,
          intervalID,
          setID,
          countDown,
        }}
      >
        <div className="App">
          <TextDisplay />
          <section className="InputWrap">
            <input
              type="text"
              className="inputForm"
              onChange={(event) => {
                keyDown(event.target.value.trim());
              }}
            />
            <Timer />
            <button
              className="retryButton"
              onClick={() => window.location.reload()}
            >
              Reset
            </button>
          </section>{" "}
        </div>
        <Result />
      </TimeContext.Provider>
    </WordsContext.Provider>
  );
}

function TextDisplay() {
  const { remaining } = useContext(TimeContext);
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
  const style = {
    display: remaining > 0 ? "block" : "none",
  };
  const { words } = useContext(WordsContext);
  // if wordlines had its own state, its value would update one cycle after words and therefore the displayLines would update one word late!
  const wordLines = word2D(words);
  const [displayLines, setDisplayLines] = useState(0);

  useEffect(() => {
    setDisplayLines((displayLines) => {
      if (
        (wordLines[displayLines].at(-1)?.color === "#ACE1AF" ||
          wordLines[displayLines].at(-1)?.color === "#F88379") &&
        displayLines + 2 < wordLines.length
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
                key={j}
                style={{
                  background: word.color,
                  padding: "5px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  borderRadius: "5px",
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

function Timer() {
  const { startedTyping, remaining, intervalID, setID, countDown } =
    useContext(TimeContext);
  useEffect(() => {
    if (startedTyping) {
      const ID = setInterval(() => {
        countDown();
      }, 1000);
      // typescript threw an error that  ID is of type TIMER!!! therefore I had to do this to get rid of that error.
      setID(Number(ID));
    }
  }, [startedTyping]);
  if (remaining === 0) {
    clearInterval(intervalID);
  }
  return <span className="timerDisplay">{remaining}</span>;
}

function Result() {
  const { remaining } = useContext(TimeContext);
  const style = {
    display: remaining === 0 ? "flex" : "none",
  };
  const { correctWords, totalWords } = useContext(WordsContext);
  return (
    <div className="Result" style={style}>
      <span>WPM: {totalWords}</span>
      <span>Correct Words: {correctWords}</span>
      <span>Wrong Words: {totalWords - correctWords}</span>
    </div>
  );
}

export default App;
