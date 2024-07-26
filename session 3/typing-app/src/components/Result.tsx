import React from "react";

export default function Result({
  finalState,
}: {
  finalState: { correctWords: number; totalWords: number; time: number };
}) {
  return (
    <div className="Result">
      <span>
        WPM: {Math.floor((finalState.totalWords * 60) / finalState.time)}
      </span>
      <span>Correct Words: {finalState.correctWords}</span>
      <span>
        Wrong Words: {finalState.totalWords - finalState.correctWords}
      </span>
      <span>Time: {finalState.time}</span>
    </div>
  );
}
