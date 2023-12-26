import { useEffect, useState } from "react";

function App() {
  const gridInit = [
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
    [" ", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", "Z"],
  ];
  const startInit = "0,0";
  const [grid, setGrid] = useState(gridInit);

  const [cameFrom, setCameFrom] = useState<Record<string, string>>({
    ["0,0"]: "",
  });
  // const [costSoFar, setCostSoFar] = useState<number[]>([0]);
  const endAddress = grid
    .reduce(
      (acc, row, i) => (row.includes("Z") ? `${row.indexOf("Z")},${i}` : acc),
      ""
    )
    .toString()
    .replace(/,/g, ",");

  const [goal, setGoal] = useState<string>(endAddress);
  const [start, setStart] = useState<string>("");
  const [frontier, setFrontier] = useState<string[]>([start]);
  const [currentTile, setCurrentTile] = useState<string>("");
  const [neighbors, setNeighbors] = useState<Location<string>[]>([]);
  const [walls, setWalls] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<string[]>([]);
  const [pathMode, setPathMode] = useState<string>("static");

  const [tick, setTick] = useState<number>(0);
  const [gameMode, setGameMode] = useState<string>("regular");
  const [searchMode, setSearchMode] = useState<string>("");
  const [timeMode, setTimeMode] = useState<string>(
    localStorage.getItem("timeMode") || "play"
  );
  const [speed, setTheSpeed] = useState<number>(
    Number(localStorage.getItem("speed")) || 0
  );
  const [hasFoundGoal, setHasFoundGoal] = useState<boolean>(false);
  const [hideData, setHideData] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<string>("");

  const SPEED_INCREMENT = 50;

  const setSpeed = (speed: number) => {
    setTheSpeed(speed);
    localStorage.setItem("speed", JSON.stringify(speed));
  };

  const gridToLocation = (inGrid: string[][]) => {
    const localGrid: Location<string>[][] = [];
    for (let row = 0; row < inGrid.length; row++) {
      const tempRow: Location<string>[] = [];
      for (let col = 0; col < inGrid[row].length; col++) {
        tempRow.push({
          col,
          row,
          value: inGrid[row][col],
          id: `${col},${row}`,
        });
      }
      localGrid.push(tempRow);
    }
    return localGrid;
  };

  const getPointNeighbors = (
    point: Location<string>,
    grid: string[][],
    includeDiagonals = false
  ) => {
    const gpnNeighbors: Location<string>[] = [];

    const left = point.col - 1 >= 0 && grid[point.row][point.col - 1];
    const right =
      point.col + 1 < grid[point.row]?.length && grid[point.row][point.col + 1];
    const above = point.row - 1 >= 0 && grid[point.row - 1][point.col];
    const below =
      point.row + 1 < grid?.length && grid[point.row + 1][point.col];

    const leftAbove =
      left !== false && above !== false && grid[point.row - 1][point.col - 1];
    const rightAbove =
      right !== false && above !== false && grid[point.row - 1][point.col + 1];
    const leftBelow =
      left !== false && below !== false && grid[point.row + 1][point.col - 1];
    const rightBelow =
      right !== false && below !== false && grid[point.row + 1][point.col + 1];

    if (left !== false) {
      gpnNeighbors.push({
        col: point.col - 1,
        row: point.row,
        id: `${point.col - 1},${point.row}`,
        value: grid[point.row][point.col - 1],
      });
    }
    if (right !== false) {
      gpnNeighbors.push({
        col: point.col + 1,
        row: point.row,
        id: `${point.col + 1},${point.row}`,
        value: grid[point.row][point.col + 1],
      });
    }
    if (above !== false) {
      gpnNeighbors.push({
        col: point.col,
        row: point.row - 1,
        id: `${point.col},${point.row - 1}`,
        value: grid[point.row - 1][point.col],
      });
    }
    if (below !== false) {
      gpnNeighbors.push({
        col: point.col,
        row: point.row + 1,
        id: `${point.col},${point.row + 1}`,
        value: grid[point.row + 1][point.col],
      });
    }
    if (includeDiagonals && leftAbove !== false) {
      gpnNeighbors.push({
        col: point.col - 1,
        row: point.row - 1,
        id: `${point.col - 1},${point.row - 1}`,
        value: grid[point.row - 1][point.col - 1],
      });
    }
    if (includeDiagonals && rightAbove !== false) {
      gpnNeighbors.push({
        col: point.col + 1,
        row: point.row - 1,
        id: `${point.col + 1},${point.row - 1}`,
        value: grid[point.row - 1][point.col + 1],
      });
    }
    if (includeDiagonals && leftBelow !== false) {
      gpnNeighbors.push({
        col: point.col - 1,
        row: point.row + 1,
        id: `${point.col - 1},${point.row + 1}`,
        value: grid[point.row + 1][point.col - 1],
      });
    }
    if (includeDiagonals && rightBelow !== false) {
      gpnNeighbors.push({
        col: point.col + 1,
        row: point.row + 1,
        id: `${point.col + 1},${point.row + 1}`,
        value: grid[point.row + 1][point.col + 1],
      });
    }

    return gpnNeighbors;
  };

  const reconstructPath = (
    start: string,
    goal: string,
    cameFrom: Record<string, string>
  ) => {
    let current = goal;
    // A path is a sequence of edges, but often it’s easier to store the nodes
    const path: string[] = [];

    while (current !== start && current !== undefined) {
      path.push(current);
      current = cameFrom[current];
    }
    path.push(start); // optional
    path.reverse(); // optional
    return path;
  };

  useEffect(() => {
    const localWallsMaybe = localStorage.getItem("walls");
    const localWalls = localWallsMaybe ? JSON.parse(localWallsMaybe) : null;
    const tempWalls = gridToLocation(gridInit).flat();
    const filteredWallIds = tempWalls
      .filter((l) => l.value === "#")
      .map((l) => l.id);
    localStorage.setItem(
      "walls",
      JSON.stringify(localWalls ?? filteredWallIds)
    );
    setWalls(new Set(localWalls ?? filteredWallIds));

    const localStart = localStorage.getItem("start");
    setStart(localStart ?? startInit);
    setCameFrom({ [localStart ?? startInit]: "" });
    setCurrentTile(localStart ?? startInit);
    setFrontier([localStart ?? startInit]);
    if (localWalls) {
      const localGrid = grid.map((row, i) =>
        row.map((col, j) => {
          const id = `${j},${i}`;
          return {
            col: j,
            row: i,
            value:
              localStart && id === localStart
                ? "A"
                : localWalls.includes(id)
                ? "#"
                : col === "#"
                ? " "
                : col,
            id,
          };
        })
      );
      setGrid(localGrid.map((row) => row.map((col) => col.value)));
    }

    setTick(1);
  }, []);

  useEffect(() => {
    if (tick > 0) {
      const localFrontier = [...frontier];
      const localCameFrom = { ...cameFrom };
      let localNeighbors: Location<string>[] = [...neighbors];
      // const localCostSoFar = {...costSoFar}

      if (searchMode !== "find-path" && localFrontier.length > 0) {
        let current = currentTile || "";
        if (searchMode === "frontier") {
          current = localFrontier.shift() as string;
          const [col, row] = current.split(",").map((n) => Number(n));
          setCurrentTile(`${col},${row}`);

          if (`${col},${row}` === goal) {
            setHasFoundGoal(true);
            setSearchMode("find-path");

            setPath(reconstructPath(start, goal, cameFrom));
            pathMode === "dynamic" && setLastPosition(current);
            setTick(tick + 1);
            return;
          }

          localNeighbors = getPointNeighbors(
            {
              col: parseInt(current.split(",")[0]),
              row: parseInt(current.split(",")[1]),
              id: current,
              value: current,
            },
            grid
          ).filter((n) => !walls.has(n.id) && !(n.id in cameFrom));
        }
        setNeighbors(...[localNeighbors]);
        setSearchMode(localNeighbors.length > 1 ? "neighbors" : "frontier");
        const next = localNeighbors.shift();
        if (next !== undefined && !(next.id in cameFrom)) {
          localFrontier.push(next.id);
          localCameFrom[next.id] = current;
          setCameFrom(localCameFrom);
        }
        setFrontier(localFrontier);
      } else if (searchMode === "find-path") {
        const localPath = [...path];
        const temp = (localPath.shift() || "")
          ?.split(",")
          .map((n) => Number(n));
        const localGrid = [...grid];
        localGrid[temp[1]][temp[0]] = "X";
        const [tempCol, tempRow] = lastPosition
          .split(",")
          .map((n) => Number(n));
        if (pathMode === "dynamic") localGrid[tempRow][tempCol] = " ";
        pathMode === "dynamic" && setLastPosition(`${temp[0]},${temp[1]}`);
        setGrid(localGrid);
        if (localPath.length > 0) {
          setPath(localPath);
        } else {
          setSearchMode("finished");
          setTimeMode("pause");
          // setGameMode("regular");
        }
      }

      const timeout = setTimeout(() => {
        timeMode === "play" && setTick(tick + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [tick]);

  const getStyles = (col: number, row: number) => {
    const styles: string[] = [];

    currentTile === `${col},${row}`
      ? styles.push("border-2 border-red-400")
      : "";
    start === `${col},${row}` || grid[row][col] === "X"
      ? styles.push("text-red-600")
      : "";
    frontier.includes(`${col},${row}`)
      ? styles.push("bg-blue-400")
      : Object.keys(cameFrom).some((cf) => cf.split(":")[0] === `${col},${row}`)
      ? styles.push("bg-blue-500")
      : walls.has(`${col},${row}`)
      ? styles.push("text-slate-700 bg-slate-500")
      : "";

    neighbors.map((n) => n.id).includes(`${col},${row}`)
      ? styles.push("border-4 border-green-600")
      : "";

    styles.push(
      gameMode === "pick-start"
        ? "hover:opacity-75 opacity-50 shadow-inner hover:bg-green-600"
        : ""
    );

    return styles.join(" ").trim();
  };

  const buttonStyles =
    "flex items-center justify-center mr-4 my-2 p-2 bg-gray-400 border border-gray-500 rounded-md hover:bg-gray-500 hover:text-slate-200";
  return (
    <div className={`p-4 m-8 text-blue-600`}>
      {/* Buttons */}
      {hasFoundGoal && <p>Found Goal</p>}
      <div className="flex">
        <button
          className={buttonStyles}
          onClick={() => {
            const temp = timeMode === "play" ? "pause" : "play";
            setTimeMode(temp);
            localStorage.setItem("timeMode", temp);
            setTick(tick + 1);
          }}
        >
          {timeMode === "play" ? "pause" : "play"}
        </button>
        <button
          className={buttonStyles.concat(" w-12")}
          onClick={() => {
            setTick(tick + 1);
          }}
        >
          {tick}
        </button>

        <button
          className={buttonStyles}
          onClick={() => {
            setSpeed(speed + SPEED_INCREMENT);
          }}
        >
          +
        </button>
        <p className={"flex mr-1 -ml-3 items-center"}>{speed}</p>
        <button
          className={buttonStyles}
          onClick={() => {
            setSpeed(speed - SPEED_INCREMENT);
          }}
        >
          -
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            setGameMode(gameMode === "pick-start" ? "regular" : "pick-start");
          }}
        >
          Pick Start
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            setHideData(!hideData);
          }}
        >
          {hideData ? "Show " : "Hide "} Data
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            setPathMode(pathMode === "static" ? "dynamic" : "static");
          }}
        >
          {pathMode === "static" ? "Hide" : "Show"} Path
        </button>
      </div>

      {/* Grid */}
      {grid.map((row, i) => (
        <div
          key={i}
          className={`flex bg-gray-400 ${
            gameMode === "pick-start" ? "opacity-50" : ""
          }`}
        >
          {row.map((col, j) => (
            <button
              key={j}
              title={`col: ${j}, row: ${i}`}
              className={`flex  text-3xl items-center justify-center w-8 h-8 border border-gray-500 hover:bg-gray-500 hover:text-slate-200 hover:opacity-10 ${
                getStyles(j, i) || ""
              }
              `}
              onClick={() => {
                const newGrid = [...grid];
                const newVal =
                  gameMode === "pick-start"
                    ? "A"
                    : newGrid[i][j] === "#"
                    ? " "
                    : "#";
                newGrid[i][j] = newVal;

                if (newVal === "#") {
                  const newWalls = new Set([...walls, `${j},${i}`]);
                  localStorage.setItem("walls", JSON.stringify([...newWalls]));
                  setWalls(new Set(newWalls));
                } else {
                  const newWalls = new Set([...walls]);
                  newWalls.delete(`${j},${i}`);
                  localStorage.setItem("walls", JSON.stringify([...newWalls]));
                  setWalls(new Set(newWalls));
                }

                if (newVal === "A") {
                  localStorage.setItem("start", `${j},${i}`);
                  setStart(`${j},${i}`);
                  setGameMode("regular");
                  const oldStart = gridToLocation(gridInit)
                    .flat()
                    .find((l) => l.value === "A" && l.id !== `${j},${i}`);
                  newGrid[oldStart?.row as number][oldStart?.col as number] =
                    " ";
                }

                setGrid(newGrid);
              }}
            >
              {col}
            </button>
          ))}
        </div>
      ))}

      {/* Data Columns */}
      {!hideData && (
        <div className="flex *:mr-12">
          <div className="w-20">
            <h2 className="text-2xl">CameFrom</h2>
            <p className="bg-orange-400">
              {JSON.stringify(cameFrom, null, 2)
                .slice(0, -1)
                .slice(1)
                .replace(/["]/g, "")
                .replace(/",/g, "\n")}
            </p>
          </div>
          <div className="w-20">
            <h2 className="text-2xl">Frontier</h2>
            {frontier.map((front, i) => {
              return (
                <p key={i} className="bg-blue-400">
                  {front}
                </p>
              );
            })}
          </div>
          <div className="w-20">
            <h2 className="text-2xl">Neighbors</h2>
            {neighbors.map((neighbor, i) => {
              return (
                <p key={i} className="bg-green-400">
                  {neighbor.id}
                </p>
              );
            })}
          </div>
          <div className="w-20">
            <h2 className="text-2xl">Current</h2>
            <p className="bg-red-200">{currentTile}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

export interface Location<T> {
  id: string;
  value: T;
  col: number;
  row: number;
  cost?: number;
}
export interface Graph<T> {
  nodes: Record<string, Location<T>>;
  edges?: (pointID: string) => Record<string, Location<T>>;
  neighbors: (id: string, ignoreWalls?: boolean) => Record<string, Location<T>>; // id is a string of the form "col,row"
}
export interface SquareGrid<T> extends Graph<T> {
  width: number;
  height: number;
  walls: Set<string>;
  inBounds: (point: Location<T>) => boolean;
  isValid: (point: Location<T>) => boolean;
}
export interface WeightedGrid<T> extends SquareGrid<T> {
  weights: Record<string, number>;
}
