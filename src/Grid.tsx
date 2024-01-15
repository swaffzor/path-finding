import { useCallback, useContext, useEffect, useState } from "react";
import GridTile from "./GridTile";
import { ConfigContext, GameContext } from "./Context";
import { breadthSearch, reconstructPath } from "./utils";
import { useAnimationFrame } from "./useAnimationFrame";

interface Position {
  col: number;
  row: number;
}

enum Dir {
  UP = "↑",
  DOWN = "↓",
  LEFT = "←",
  RIGHT = "→",
}
type DirSprite = Dir.UP | Dir.DOWN | Dir.LEFT | Dir.RIGHT;

const Grid = () => {
  const { isControlled, pathMode } = useContext(ConfigContext);
  const {
    grid,
    walls,
    goal,
    isPressDown,
    isPressLeft,
    isPressRight,
    isPressSpace,
    isPressUp,
  } = useContext(GameContext);

  const [player, setPlayer] = useState<Position>({ col: 0, row: 0 });
  const [playerDirection, setPlayerDirection] = useState<DirSprite>(Dir.RIGHT);
  const [prevDirection, setPrevDirection] = useState<DirSprite>(Dir.RIGHT);
  const [playerSpeed, setPlayerSpeed] = useState<number>(175);
  const [ghost, setGhost] = useState<Position>({
    col: Number(goal.split(",")[0]) || 0,
    row: Number(goal.split(",")[1]) || 0,
  });
  const [ghostPath, setGhostPath] = useState<string[]>([]);
  const [tick, setTick] = useState<number>(0);
  const [cTick, setCTick] = useState<number>(0);

  const isCaught = JSON.stringify(ghost) === JSON.stringify(player);
  const ghostLost = ghostPath.length === 0;
  const grass = grid
    .map((row, rowIndex) =>
      row.map((value, colIndex) => [`${colIndex},${rowIndex}`, value])
    )
    .flat()
    .filter((v) => v[1] !== "");

  const isInBounds = (col: number, row: number) => {
    return (
      col >= 0 &&
      row >= 0 &&
      col < grid[0].length &&
      row < grid.length &&
      !walls.has(`${col},${row}`)
    );
  };

  const reRouteGhost = (
    ghostID: string,
    playerID: string,
    newGrid?: string[][],
    newWalls?: Set<string>
  ) => {
    // const ghostID = `${ghost.col},${ghost.row}`;
    // const playerID = `${player.col},${player.row}`;
    const useWalls = pathMode === "walls" ? newWalls ?? walls : undefined;
    const results = breadthSearch(newGrid ?? grid, ghostID, playerID, useWalls);
    const localGhostPath = reconstructPath(ghostID, playerID, results);
    setGhostPath(localGhostPath);
    setTick(tick + 1);
  };

  useEffect(() => {
    if (isControlled && ghostPath.length === 0) {
      const ghostID = `${ghost.col},${ghost.row}`;
      const playerID = `${player.col},${player.row}`;
      reRouteGhost(ghostID, playerID);
    }
  }, []);

  // useEffect(() => {
  // if (isPressDown && isInBounds(player.col, player.row + 1)) {
  //   setPlayer((prev) => ({ ...prev, row: prev.row + 1 }));
  //   setTimeout(() => {
  //     setCTick(cTick + 1);
  //   }, playerSpeed);
  // }
  // if (isPressUp && isInBounds(player.col, player.row - 1)) {
  //   setPlayer((prev) => ({ ...prev, row: prev.row - 1 }));
  //   setTimeout(() => {
  //     setCTick(cTick + 1);
  //   }, playerSpeed);
  // }
  // if (isPressLeft && isInBounds(player.col - 1, player.row)) {
  //   setPlayer((prev) => ({ ...prev, col: prev.col - 1 }));
  //   setTimeout(() => {
  //     setCTick(cTick + 1);
  //   }, playerSpeed);
  // }
  // if (isPressRight && isInBounds(player.col + 1, player.row)) {
  //   setPlayer((prev) => ({ ...prev, col: prev.col + 1 }));
  //   setTimeout(() => {
  //     setCTick(cTick + 1);
  //   }, playerSpeed);
  // }

  // setPlayerDirection(
  //   isPressUp
  //     ? Dir.UP
  //     : isPressDown
  //     ? Dir.DOWN
  //     : isPressLeft
  //     ? Dir.LEFT
  //     : isPressRight
  //     ? Dir.RIGHT
  //     : playerDirection
  // );
  // reRouteGhost();
  // }, [isPressDown, isPressUp, isPressLeft, isPressRight, cTick]);

  // break/build walls
  // useEffect(() => {
  //   if (isPressSpace) {
  //     let { col, row } = player;
  //     const localWalls = new Set([...walls]);
  //     switch (playerDirection) {
  //       case Dir.LEFT:
  //         col = player.col - 1;
  //         break;
  //       case Dir.UP:
  //         row = player.row - 1;
  //         break;
  //       case Dir.RIGHT:
  //         col = player.col + 1;
  //         break;
  //       case Dir.DOWN:
  //         row = player.row + 1;
  //         break;
  //       default:
  //         break;
  //     }
  //     if (localWalls.has(`${col},${row}`)) {
  //       localWalls.delete(`${col},${row}`);
  //     } else {
  //       localWalls.add(`${col},${row}`);
  //     }
  //     setWalls(localWalls);
  //     reRouteGhost(grid, localWalls);
  //   }

  //   setPrevDirection(playerDirection);
  //   setPlayerDirection(isPressSpace ? ("🔨" as DirSprite) : prevDirection);
  // }, [isPressSpace]);

  // move ghost
  // useEffect(() => {
  // if (isControlled) {
  //   const localGhostPath = [...ghostPath];
  //   const localGhost = localGhostPath.shift() || "";
  //   const [col, row] = localGhost!.split(",").map(Number);
  //   setGhost({ col: col || ghost.col, row: row || ghost.row });
  //   if (localGhostPath.length > 0) {
  //     setGhostPath(localGhostPath);
  //   }

  //   const ghostInForest = grass.find((g) => g[0] === localGhost) || [];
  //   const multiplier = 1;
  //   //ghostInForest.length > 0 ? Number(ghostInForest[1]) : 1;
  //   const timeout = setTimeout(() => {
  //     !isCaught && localGhostPath.length > 0 && setTick((prev) => prev + 1);
  //   }, speed * multiplier);
  //   return () => clearTimeout(timeout);
  // }
  // }, [tick, isCaught, walls]);
  // useEffect(() => {
  //   console.log("isPressUp: ", isPressUp);
  //   console.log("isPressDown: ", isPressDown);
  //   console.log("isPressLeft: ", isPressLeft);
  //   console.log("isPressRight: ", isPressRight);
  //   console.log("isPressSpace: ", isPressSpace);
  // }, [isPressUp, isPressDown, isPressLeft, isPressRight, isPressSpace]);

  // const animate = (time: number) => {
  // console.log("animate called");
  // console.log("isPressUp: ", isPressUp);
  // console.log("isPressDown: ", isPressDown);
  // console.log("isPressLeft: ", isPressLeft);
  // console.log("isPressRight: ", isPressRight);
  // console.log("isPressSpace: ", isPressSpace);

  // if (
  //   isPressSpace ||
  //   isPressUp ||
  //   isPressDown ||
  //   isPressLeft ||
  //   isPressRight
  // ) {
  //   debugger;
  // }
  // setPlayerDirection(
  //   isPressUp
  //     ? Dir.UP
  //     : isPressDown
  //     ? Dir.DOWN
  //     : isPressLeft
  //     ? Dir.LEFT
  //     : isPressRight
  //     ? Dir.RIGHT
  //     : playerDirection
  // );
  // reRouteGhost();

  // break/build walls
  // setWalls((localWalls: Set<string>) => {
  //   if (isPressSpace) {
  //     let { col, row } = prevPlayer;
  //     switch (playerDirection) {
  //       case Dir.LEFT:
  //         col = prevPlayer.col - 1;
  //         break;
  //       case Dir.UP:
  //         row = prevPlayer.row - 1;
  //         break;
  //       case Dir.RIGHT:
  //         col = prevPlayer.col + 1;
  //         break;
  //       case Dir.DOWN:
  //         row = prevPlayer.row + 1;
  //         break;
  //       default:
  //         break;
  //     }
  //     if (localWalls.has(`${col},${row}`)) {
  //       localWalls.delete(`${col},${row}`);
  //     } else {
  //       localWalls.add(`${col},${row}`);
  //     }
  //     reRouteGhost(grid, localWalls);
  //   }
  //   return localWalls;
  // });

  // setPrevDirection(playerDirection);
  // setPlayerDirection(isPressSpace ? ("🔨" as DirSprite) : prevDirection);

  // move ghost
  // setPlayer((prevPlayer) => {
  //   let localGhost = "";
  //   if (isControlled) {
  //     setGhostPath((localGhostPath) => {
  //       localGhost = localGhostPath.shift() || "";
  //       const [col, row] = localGhost!.split(",").map(Number);
  //       setGhost((prevGhost) => ({
  //         col: col || prevGhost.col,
  //         row: row || prevGhost.row,
  //       }));
  //       if (localGhostPath.length > 0) {
  //         return localGhostPath;
  //       } else {
  //         return [];
  //       }
  //     });
  //   }
  //   if (isPressDown && isInBounds(prevPlayer.col, prevPlayer.row + 1)) {
  //     return { ...prevPlayer, row: prevPlayer.row + 1 };
  //   }
  //   if (isPressUp && isInBounds(prevPlayer.col, prevPlayer.row - 1)) {
  //     return { ...prevPlayer, row: prevPlayer.row - 1 };
  //   }
  //   if (isPressLeft && isInBounds(prevPlayer.col - 1, prevPlayer.row)) {
  //     return { ...prevPlayer, col: prevPlayer.col - 1 };
  //   }
  //   if (isPressRight && isInBounds(prevPlayer.col + 1, prevPlayer.row)) {
  //     return { ...prevPlayer, col: prevPlayer.col + 1 };
  //   }
  //   reRouteGhost(localGhost, `${prevPlayer.col},${prevPlayer.row}`);
  //   return prevPlayer;
  // });

  // const ghostInForest = grass.find((g) => g[0] === localGhost) || [];
  // const multiplier = 1;
  //ghostInForest.length > 0 ? Number(ghostInForest[1]) : 1;
  // const timeout = setTimeout(() => {
  //   !isCaught && localGhostPath.length > 0 && setTick((prev) => prev + 1);
  // }, speed * multiplier);
  // return () => clearTimeout(timeout);
  // };

  const callback = useCallback(
    (time: number) => {
      // insert your animate function code here
      const animate = (time: number) => {
        // console.log(time);
        setPlayer((prevPlayer) => {
          if (isPressDown && isInBounds(prevPlayer.col, prevPlayer.row + 1)) {
            return { ...prevPlayer, row: prevPlayer.row + 1 };
          }
          if (isPressUp && isInBounds(prevPlayer.col, prevPlayer.row - 1)) {
            return { ...prevPlayer, row: prevPlayer.row - 1 };
          }
          if (isPressLeft && isInBounds(prevPlayer.col - 1, prevPlayer.row)) {
            return { ...prevPlayer, col: prevPlayer.col - 1 };
          }
          if (isPressRight && isInBounds(prevPlayer.col + 1, prevPlayer.row)) {
            return { ...prevPlayer, col: prevPlayer.col + 1 };
          }
          let localGhost = "";
          if (isPressDown || isPressUp || isPressLeft || isPressRight) {
            setGhostPath((localGhostPath) => {
              // debugger;
              localGhost = localGhostPath.shift() || "";
              const [col, row] = localGhost!.split(",").map(Number);
              setGhost((prevGhost) => ({
                col: col || prevGhost.col,
                row: row || prevGhost.row,
              }));
              if (localGhostPath.length > 0) {
                return localGhostPath;
              } else {
                return [];
              }
            });
          }
          reRouteGhost(localGhost, `${prevPlayer.col},${prevPlayer.row}`);
          return prevPlayer;
        });
      };

      animate(time); // now calling the animate function that we defined within this useCallback
    },
    [isPressUp, isPressDown, isPressLeft, isPressRight, isPressSpace, ghostPath]
  ); // Include all dependencies that were originally part of your animate function

  useAnimationFrame(callback);

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
            <GridTile
              key={j}
              col={isControlled && player.col === j ? player.col : j}
              row={isControlled && player.row === i ? player.row : i}
              isPlayer={isControlled && player.col === j && player.row === i}
              isGhost={isControlled && ghost.col === j && ghost.row === i}
              value={
                isControlled && player.col === j && player.row === i
                  ? playerDirection
                  : value
              }
              winner={isCaught ? "ghost" : ghostLost ? "player" : undefined}
            />
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
