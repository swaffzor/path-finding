import { useEffect, useState } from "react";
import { getPointNeighbors, gridToLocation, reconstructPath } from "./utils";
import { Location } from "./types";
import DataPanel from "./DataPanel";
import Grid from "./Grid";
import ButtonPanel from "./ButtonPanel";
import { gridInit } from "./constants";
import { ConfigProvider } from "./Context";

function App() {
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

  const setSpeed = (speed: number) => {
    setTheSpeed(speed);
    localStorage.setItem("speed", JSON.stringify(speed));
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

  return (
    <ConfigProvider
      value={{
        grid,
        setGrid,
        cameFrom,
        setCameFrom,
        gameMode,
        setGameMode,
        hideData,
        setHideData,
        pathMode,
        setPathMode,
        timeMode,
        setTimeMode,
        tick,
        setTick,
        speed,
        setSpeed,
      }}
    >
      <div className={`p-4 m-8 text-blue-600`}>
        {/* Buttons */}
        {hasFoundGoal && <p>Found Goal</p>}
        <ButtonPanel />

        {/* Grid */}
        <Grid
          grid={grid}
          gameMode={gameMode}
          getStyles={getStyles}
          walls={walls}
          setWalls={setWalls}
          setStart={setStart}
          setGameMode={setGameMode}
          setGrid={setGrid}
        />

        {/* Data Columns */}
        {!hideData && (
          <DataPanel
            cameFrom={cameFrom}
            frontier={frontier}
            neighbors={neighbors}
            currentTile={currentTile}
          />
        )}
      </div>
    </ConfigProvider>
  );
}

export default App;
