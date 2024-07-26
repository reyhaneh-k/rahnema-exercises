import React, { useCallback, useState, useEffect } from "react";
interface CurrentWord {
  text: string;
  status: "right" | "wrong" | "typing" | "unchecked";
  id: number;
}
export default function TextDisplay({ words }: { words: CurrentWord[] }) {
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

  useEffect(() => {
    setWordLines(word2D(words));
  }, [words, word2D]);

  useEffect(() => {
    setDisplayLines((displayLines) => {
      if (
        displayLines + 2 < wordLines.length &&
        wordLines[displayLines + 1][0].status === "typing"
      ) {
        return displayLines + 1;
      }
      return displayLines;
    });
  }, [words, wordLines]);

  return (
    <div className="TextDisplay">
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
