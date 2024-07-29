type CoordinateType = { x: number; y: number };
interface State {
  snake: Array<CoordinateType>;
  appleCoordinates: CoordinateType;
  gameOver: boolean;
  scores: number[];
  direction: DirectionType;
  arrowDirection: DirectionType;
  intervalID: number;
  start: boolean;
  fps: number;
  frame: number;
}

type DirectionType = "up" | "down" | "right" | "left";

type action =
  | { type: "move" }
  | { type: "retry" }
  | { type: "setInterval"; id: number }
  | { type: "start"; fps: number }
  | { type: "setFrame" }
  | { type: "arrowDirection"; key: DirectionType };
const playground = {
  width: 30,
  height: 30,
} as const;
const drawFactor = 20;
const isCoordinateValid = (
  coordinate: CoordinateType,
  snake: State["snake"]
): boolean => {
  return !snake.find((dot) => dot.x === coordinate.x && dot.y === coordinate.y);
};
const setAppleCoordinates = (snake: State["snake"]): CoordinateType => {
  let coor: CoordinateType = { x: -1, y: -1 };
  do {
    coor.x = Math.floor(Math.random() * playground.width);
    coor.y = Math.floor(Math.random() * playground.height);
  } while (!isCoordinateValid(coor, snake));
  return coor;
};
const setInitialState = (id: number): State => {
  const center: CoordinateType = {
    x: Math.floor(playground.width / 2),
    y: Math.floor(playground.height / 2),
  };
  const snake = [
    { x: center.x - 1, y: center.y },
    { ...center },
    { x: center.x + 1, y: center.y },
  ];
  const apple = setAppleCoordinates(snake);
  clearInterval(id);
  return {
    snake: snake,
    appleCoordinates: apple,
    gameOver: false,
    scores: [],
    direction: "right",
    arrowDirection: "right",
    intervalID: -1,
    start: false,
    fps: 0.0000000001,
    frame: 0,
  };
};
const isEatingApple = (
  apple: CoordinateType,
  head: CoordinateType
): boolean => {
  return apple.x === head.x && apple.y === head.y;
};
const updateSnake = (state: State) => {
  let newSnake = state.snake.slice();
  let head: CoordinateType = state.snake.at(-1)!;
  let direction: DirectionType = state.direction;
  let newHead: CoordinateType = state.snake.at(-1)!;

  if (
    (state.direction === "up" && state.arrowDirection === "down") ||
    (state.direction === "down" && state.arrowDirection === "up") ||
    (state.direction === "left" && state.arrowDirection === "right") ||
    (state.direction === "right" && state.arrowDirection === "left")
  ) {
    direction = state.direction;
  } else {
    direction = state.arrowDirection;
  }
  newHead = calculateNewHead(head, direction);
  if (isCoordinateValid(newHead, newSnake.slice(1))) {
    if (isEatingApple(state.appleCoordinates, newHead)) {
      newSnake.push(newHead);
      return {
        ...state,
        direction: state.arrowDirection,
        appleCoordinates: setAppleCoordinates(state.snake),
        snake: newSnake,
      };
    }
    newSnake = state.snake.slice(1);
    newSnake.push(newHead);
    return {
      ...state,
      direction: state.arrowDirection,

      appleCoordinates: state.appleCoordinates,
      snake: newSnake,
    };
  } else {
    return {
      ...state,
      intervalID: -1,
      direction: state.arrowDirection,
      gameOver: true,
      scores: [...state.scores, state.snake.length],
    };
  }
};
const calculateNewHead = (
  head: CoordinateType,
  direction: DirectionType
): CoordinateType => {
  let newHead: CoordinateType = { ...head };
  switch (direction) {
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
      return newHead;
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
      return newHead;
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
      return newHead;
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
      return newHead;
  }
};
const reducer = (state: State, action: action): State => {
  switch (action.type) {
    case "move":
      return updateSnake(state);
    case "arrowDirection":
      return { ...state, arrowDirection: action.key };
    case "setFrame":
      return { ...state, frame: state.frame + 1 };
    case "retry":
      return setInitialState(state.intervalID);
    case "setInterval":
      return { ...state, intervalID: action.id };
    case "start":
      clearInterval(state.intervalID);
      return { ...state, start: true, fps: action.fps };
  }
};
const handleKeyDown = (key: string, dispatch: React.Dispatch<action>) => {
  if (
    key === "ArrowUp" ||
    key === "ArrowDown" ||
    key === "ArrowRight" ||
    key === "ArrowLeft"
  )
    dispatch({
      type: "arrowDirection",
      key: key.slice(5).toLowerCase() as DirectionType,
    });
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
      for (const coor of state.snake) {
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
        state.snake.at(-1)!.x * drawFactor,
        state.snake.at(-1)!.y * drawFactor,
        drawFactor,
        drawFactor
      );
      context.fill();
      context.stroke();
    }
  }
};

export {
  playground,
  drawFactor,
  isCoordinateValid,
  setAppleCoordinates,
  setInitialState,
  isEatingApple,
  updateSnake,
  reducer,
  handleKeyDown,
  drawGame,
};
export type { State, DirectionType, action, CoordinateType };
