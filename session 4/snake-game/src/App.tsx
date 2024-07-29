import React, { useEffect, useReducer, useRef } from "react";
import "./App.css";
import * as lg from "./Logic";

function App() {
  const [state, dispatch] = useReducer(lg.reducer, lg.setInitialState(-1));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    document.addEventListener("keydown", (event) =>
      lg.handleKeyDown(event.key, dispatch)
    );
  }, [state.gameOver]);
  useEffect(() => {
    lg.drawGame(canvasRef as React.MutableRefObject<HTMLCanvasElement>, state);
  }, [state]);

  useEffect(() => {
    const id = setInterval(
      () => dispatch({ type: "setFrame" }),
      Math.floor(1000 / state.fps)
    );
    dispatch({ type: "setInterval", id: Number(id) });
  }, [state.fps]);

  useEffect(() => {
    dispatch({ type: "move" });
  }, [state.frame]);

  return (
    <div className="App">
      {state.start ? (
        <canvas
          width={lg.playground.width * lg.drawFactor}
          height={lg.playground.height * lg.drawFactor}
          ref={canvasRef}
        ></canvas>
      ) : (
        <Start dispatch={dispatch} />
      )}

      <button onClick={() => dispatch({ type: "retry" })}>Retry</button>
      {state.gameOver ? <Result scores={state.scores}></Result> : null}
    </div>
  );
}

const Result = ({ scores }: { scores: number[] }) => {
  return (
    <>
      <div className="result">
        <p>Score: {scores.at(-1)}</p>
        <p>Best Score of All Time: {Math.max(...scores)}</p>
      </div>
    </>
  );
};

const Start = ({ dispatch }: { dispatch: React.Dispatch<lg.action> }) => {
  return (
    <div className="start">
      <span onClick={(e) => dispatch({ type: "start", fps: 4 })}>Easy</span>
      <span onClick={(e) => dispatch({ type: "start", fps: 7 })}>Medium</span>
      <span onClick={(e) => dispatch({ type: "start", fps: 10 })}>Hard</span>
    </div>
  );
};

export default App;
