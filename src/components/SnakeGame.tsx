import { useState, useEffect, useCallback, useRef } from "react";

const GRID = 20;
const CELL = 12;
const TICK_MS = 120;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const dirRef = useRef<Dir>("RIGHT");
  const containerRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    const initial = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(randomFood(initial));
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setGameOver(false);
    setScore(0);
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        const d = dirRef.current;
        if (d === "UP") head.y--;
        if (d === "DOWN") head.y++;
        if (d === "LEFT") head.x--;
        if (d === "RIGHT") head.x++;

        // Wall collision
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          setGameOver(true);
          return prev;
        }
        // Self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(randomFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [started, gameOver, food]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if ((e.key === "ArrowUp" || e.key === "w") && d !== "DOWN") { dirRef.current = "UP"; setDir("UP"); }
      if ((e.key === "ArrowDown" || e.key === "s") && d !== "UP") { dirRef.current = "DOWN"; setDir("DOWN"); }
      if ((e.key === "ArrowLeft" || e.key === "a") && d !== "RIGHT") { dirRef.current = "LEFT"; setDir("LEFT"); }
      if ((e.key === "ArrowRight" || e.key === "d") && d !== "LEFT") { dirRef.current = "RIGHT"; setDir("RIGHT"); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Touch controls
  const touchStart = useRef<Point | null>(null);

  const SIZE = GRID * CELL;

  return (
    <div className="flex flex-col items-center gap-2" ref={containerRef}>
      <div className="flex justify-between w-full px-1">
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: 14, color: "#0f0" }}>
          Score: {score}
        </span>
        {gameOver && (
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: 14, color: "#f00" }}>
            GAME OVER
          </span>
        )}
      </div>
      <div
        className="win-sunken relative"
        style={{ width: SIZE, height: SIZE, backgroundColor: "#000" }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          if (!touchStart.current) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - touchStart.current.x;
          const dy = t.clientY - touchStart.current.y;
          const d = dirRef.current;
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 20 && d !== "LEFT") { dirRef.current = "RIGHT"; setDir("RIGHT"); }
            if (dx < -20 && d !== "RIGHT") { dirRef.current = "LEFT"; setDir("LEFT"); }
          } else {
            if (dy > 20 && d !== "UP") { dirRef.current = "DOWN"; setDir("DOWN"); }
            if (dy < -20 && d !== "DOWN") { dirRef.current = "UP"; setDir("UP"); }
          }
          touchStart.current = null;
        }}
      >
        {/* Food */}
        <div
          className="absolute"
          style={{
            left: food.x * CELL,
            top: food.y * CELL,
            width: CELL,
            height: CELL,
            backgroundColor: "#f00",
          }}
        />
        {/* Snake */}
        {snake.map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: s.x * CELL,
              top: s.y * CELL,
              width: CELL,
              height: CELL,
              backgroundColor: i === 0 ? "#0f0" : "#0a0",
            }}
          />
        ))}
      </div>

      <div className="flex gap-1">
        {!started || gameOver ? (
          <button className="win-button" onClick={reset}>
            {gameOver ? "Play Again" : "Start Game"}
          </button>
        ) : (
          <span style={{ fontFamily: "var(--font-system)", fontSize: 10, color: "#666" }}>
            Arrow keys or WASD • Swipe on mobile
          </span>
        )}
      </div>
    </div>
  );
}
