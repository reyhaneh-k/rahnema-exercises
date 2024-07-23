import React from "react";
export default function Result({
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
