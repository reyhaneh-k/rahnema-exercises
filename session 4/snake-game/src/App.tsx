import React, { act, useEffect, useReducer, useRef } from "react";
import "./App.css";

type Coordinate = { x: number; y: number };
interface State {
  worm: Array<Coordinate>;
  appleCoordinates: Coordinate;
  gameOver: boolean;
  scores: number[];
  direction: direction;
  intervalID: number;
}
type direction = "up" | "down" | "right" | "left";
type action =
  | { type: direction }
  | { type: "retry" }
  | { type: "setInterval"; id: number };
const playground = {
  width: 30,
  height: 30,
} as const;
const drawFactor = 20;
const fps = 4;
const isCoordinateValid = (
  coordinate: Coordinate,
  worm: State["worm"]
): boolean => {
  return !worm.find((dot) => dot.x === coordinate.x && dot.y === coordinate.y);
};
const setAppleCoordinates = (worm: State["worm"]): Coordinate => {
  let coor: Coordinate = { x: -1, y: -1 };
  do {
    coor.x = Math.floor(Math.random() * playground.width);
    coor.y = Math.floor(Math.random() * playground.height);
  } while (!isCoordinateValid(coor, worm));
  return coor;
};
const setInitialState = (id: number): State => {
  const center: Coordinate = {
    x: Math.floor(playground.width / 2),
    y: Math.floor(playground.height / 2),
  };
  const worm = [
    { x: center.x - 1, y: center.y },
    { ...center },
    { x: center.x + 1, y: center.y },
  ];
  const apple = setAppleCoordinates(worm);
  clearInterval(id);
  return {
    worm: worm,
    appleCoordinates: apple,
    gameOver: false,
    scores: [],
    direction: "right",
    intervalID: -1,
  };
};
const isEatingApple = (apple: Coordinate, head: Coordinate): boolean => {
  return apple.x === head.x && apple.y === head.y;
};
const updateWorm = (
  state: State,
  newHead: Coordinate,
  newWorm: State["worm"],
  direction: direction
) => {
  if (
    (state.direction === "up" && direction === "down") ||
    (state.direction === "down" && direction === "up") ||
    (state.direction === "left" && direction === "right") ||
    (state.direction === "right" && direction === "left")
  ) {
    return state;
  }
  if (isCoordinateValid(newHead, newWorm.slice(1))) {
    if (state.direction !== direction) {
      clearInterval(state.intervalID);
    }
    if (isEatingApple(state.appleCoordinates, newHead)) {
      newWorm.push(newHead);
      return {
        ...state,
        direction: direction,
        appleCoordinates: setAppleCoordinates(state.worm),
        worm: newWorm,
      };
    }
    newWorm = state.worm.slice(1);
    newWorm.push(newHead);
    return {
      ...state,
      direction: direction,
      appleCoordinates: state.appleCoordinates,
      worm: newWorm,
    };
  } else {
    clearInterval(state.intervalID);
    return {
      ...state,
      intervalID: -1,
      direction: direction,
      gameOver: true,
      scores: [...state.scores, state.worm.length],
    };
  }
};
const reducer = (state: State, action: action): State => {
  let newWorm = state.worm.slice();
  let head: Coordinate = state.worm.at(-1)!;
  let newHead: Coordinate = { ...head };

  switch (action.type) {
    case "up":
      if (head.y === 0) {
        newHead = {
          x: head.x,
          y: playground.height,
        };
      } else {
        newHead = {
          x: head.x,
          y: head.y - 1,
        };
      }
      return updateWorm(state, newHead, newWorm, "up");
    case "down":
      if (head.y === playground.height - 1) {
        newHead = {
          x: head.x,
          y: 0,
        };
      } else {
        newHead = {
          x: head.x,
          y: head.y + 1,
        };
      }
      return updateWorm(state, newHead, newWorm, "down");
    case "right":
      if (head.x === playground.width - 1) {
        newHead = {
          x: 0,
          y: head.y,
        };
      } else {
        newHead = {
          x: head.x + 1,
          y: head.y,
        };
      }
      return updateWorm(state, newHead, newWorm, "right");

    case "left":
      if (head.x === 0) {
        newHead = {
          x: playground.width,
          y: head.y,
        };
      } else {
        newHead = {
          x: head.x - 1,
          y: head.y,
        };
      }
      return updateWorm(state, newHead, newWorm, "left");
    case "retry":
      return setInitialState(state.intervalID);
    case "setInterval":
      return { ...state, intervalID: action.id };
  }
};
const handleKeyDown = (key: string, dispatch: React.Dispatch<action>) => {
  switch (key) {
    case "ArrowUp":
      dispatch({ type: "up" });
      break;
    case "ArrowDown":
      dispatch({ type: "down" });
      break;
    case "ArrowRight":
      dispatch({ type: "right" });
      break;
    case "ArrowLeft":
      dispatch({ type: "left" });
      break;
  }
};

const drawGame = (
  canvasRef: React.MutableRefObject<HTMLCanvasElement>,
  state: State
) => {
  const canvas = canvasRef.current;
  let context;
  if (canvas) {
    context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (const coor of state.worm) {
        let x = coor.x * drawFactor;
        let y = coor.y * drawFactor;
        context.beginPath();
        context.fillStyle = "rgb(156, 186, 91)";
        context.strokeStyle = "rgb(48, 57, 28)";
        context.rect(x, y, drawFactor, drawFactor);
        context.fill();
        context.stroke();
      }
      context.beginPath();
      context.fillStyle = "red";
      context.fillRect(
        state.appleCoordinates.x * drawFactor,
        state.appleCoordinates.y * drawFactor,
        drawFactor,
        drawFactor
      );
      context.beginPath();
      context.fillStyle = "rgb(17, 143, 97)";
      context.strokeStyle = "rgb(48, 57, 28)";
      context.rect(
        state.worm.at(-1)!.x * drawFactor,
        state.worm.at(-1)!.y * drawFactor,
        drawFactor,
        drawFactor
      );
      context.fill();
      context.stroke();
    }
  }
};
function App() {
  const [state, dispatch] = useReducer(reducer, setInitialState(-1));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    document.addEventListener("keydown", (event) =>
      handleKeyDown(event.key, dispatch)
    );
  }, [state.gameOver]);
  useEffect(() => {
    drawGame(canvasRef as React.MutableRefObject<HTMLCanvasElement>, state);
  }, [state]);

  useEffect(() => {
    const id = setInterval(
      () => dispatch({ type: state.direction }),
      Math.floor(1000 / fps)
    );
    dispatch({ type: "setInterval", id: Number(id) });
  }, [state.direction]);

  return (
    <div className="App">
      <canvas
        width={playground.width * drawFactor}
        height={playground.height * drawFactor}
        ref={canvasRef}
      ></canvas>
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

export default App;
