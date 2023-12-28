import { useContext, useEffect, useState } from "react";
import GridTile from "./GridTile";
import { ConfigContext, GameContext } from "./Context";
import { useKeyPress } from "./Hooks";
import parents from "./parents.json";
import { breadthSearch, reconstructPath } from "./utils";

const Grid = () => {
  const { isControlled, speed, pathMode } = useContext(ConfigContext);
  const { grid, walls } = useContext(GameContext);
  const isPressUp = useKeyPress("ArrowUp");
  const isPressDown = useKeyPress("ArrowDown");
  const isPressLeft = useKeyPress("ArrowLeft");
  const isPressRight = useKeyPress("ArrowRight");
  const [player, setPlayer] = useState({ col: 0, row: 0 });
  const [ghost, setGhost] = useState({ col: 0, row: 0 });
  const [ghostPath, setGhostPath] = useState<string[]>([]);
  const [tick, setTick] = useState<number>(0);

  const pathParents = parents as Record<string, string>;
  const isCaught = JSON.stringify(ghost) === JSON.stringify(player);

  const isInBounds = (col: number, row: number) => {
    return (
      col >= 0 &&
      row >= 0 &&
      col < grid[0].length &&
      row < grid.length &&
      grid[row][col] !== "#"
    );
  };

  useEffect(() => {
    if (isPressDown && isInBounds(player.col, player.row + 1)) {
      setPlayer((prev) => ({ ...prev, row: prev.row + 1 }));
    }
    if (isPressUp && isInBounds(player.col, player.row - 1)) {
      setPlayer((prev) => ({ ...prev, row: prev.row - 1 }));
    }
    if (isPressLeft && isInBounds(player.col - 1, player.row)) {
      setPlayer((prev) => ({ ...prev, col: prev.col - 1 }));
    }
    if (isPressRight && isInBounds(player.col + 1, player.row)) {
      setPlayer((prev) => ({ ...prev, col: prev.col + 1 }));
    }
    // const [col, row] = localGhostPath.shift()?.split(",").map(Number) || [0, 0];
    // setGhost({ col, row } || "");
    // setTick((prev) => prev + 1);
    // if (isPressDown) console.log("down");
    // if (isPressUp) console.log("up");
    // if (isPressLeft) console.log("left");
    // if (isPressRight) console.log("right");
  }, [isPressDown, isPressUp, isPressLeft, isPressRight]);

  // move ghost
  useEffect(() => {
    if (isControlled) {
      const localGhostPath = [...ghostPath];
      const localGhost = localGhostPath.shift() || "";
      const [col, row] = localGhost!.split(",").map(Number);
      setGhost({ col, row });
      localGhostPath.length > 0 && setGhostPath(localGhostPath);

      const timeout = setTimeout(() => {
        !isCaught && setTick((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [tick, isCaught]);

  // re-routes path when player moves
  useEffect(() => {
    const ghostID = `${ghost.col},${ghost.row}`;
    const playerID = `${player.col},${player.row}`;
    const useWalls = pathMode === "walls" ? walls : undefined;
    const search = breadthSearch(grid, ghostID, playerID, useWalls);
    const localGhostPath = reconstructPath(ghostID, playerID, search);
    setGhostPath(localGhostPath);
    setTick(tick + 1);
  }, [player]);

  useEffect(() => {
    console.log("ghost", ghost);
  }, [ghost]);

  return (
    <>
      <div className="flex ml-8">
        {grid[0].map((_, n) => (
          <div key={`top-key-${n}`} className="w-4 mx-2 text-white">
            {n}
          </div>
        ))}
      </div>

      {grid.map((row, i) => (
        <div key={`row-key-${i}`} className={`flex bg-gray-400`}>
          <div key="leavemealone" className="flex w-4 mx-2 text-white">
            {i}
          </div>
          {row.map((value, j) => (
            <>
              <GridTile
                key={j}
                col={isControlled ? player.col : j}
                row={isControlled ? player.row : i}
                value={value}
                isPlayer={isControlled && player.col === j && player.row === i}
                isGhost={isControlled && ghost.col === j && ghost.row === i}
                // onClick={() => {
                //   setIsControlled((prev) => !prev);
                // }}
              />
            </>
          ))}
        </div>
      ))}
      {isControlled && isCaught && (
        <div className="flex items-center justify-center text-4xl">
          <p className="text-red-500">Tag, You're It!</p>
        </div>
      )}
    </>
  );
};

export default Grid;
