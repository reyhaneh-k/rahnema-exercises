import React from "react";
export default function Timer({ remainingTime }: { remainingTime: number }) {
  return <span className="timerDisplay">{remainingTime}</span>;
}
