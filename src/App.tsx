import { useEffect, useState } from "react";
import { getPointNeighbors, gridToLocation, reconstructPath } from "./utils";
import { Location } from "./types";
import DataPanel from "./DataPanel";
import Grid from "./Grid";
import ButtonPanel from "./ButtonPanel";
import { gridInit } from "./constants";
import { ConfigProvider, GameProvider } from "./Context";
import { useKeyPress } from "./Hooks";

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
  const [pathMode, setPathMode] = useState<string>("walls");

  const [tick, setTick] = useState<number>(0);
  const [gameMode, setGameMode] = useState<string>("regular");
  const [searchMode, setSearchMode] = useState<string>("");
  const [timeMode, setTimeMode] = useState<string>(
    localStorage.getItem("timeMode") || "animate"
  );
  const [speed, setTheSpeed] = useState<number>(
    Number(localStorage.getItem("speed")) || 0
  );
  const [hasFoundGoal, setHasFoundGoal] = useState<boolean>(false);
  const [hideData, setHideData] = useState<boolean>(
    !!localStorage.getItem("hideData") || false
  );
  const [lastPosition, setLastPosition] = useState<string>("");
  const [isControlled, setIsControlled] = useState<boolean>(
    JSON.parse(localStorage.getItem("isControlled") || "false") || false
  );
  const isEscPressed = useKeyPress("Escape");

  const setSpeed = (speed: number) => {
    setTheSpeed(speed);
    localStorage.setItem("speed", JSON.stringify(speed));
  };

  useEffect(() => {
    if (pathMode === "clear-walls") {
      setWalls(new Set());
      localStorage.setItem("walls", JSON.stringify([]));
      setGameMode("regular");
    }
  }, [pathMode]);

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

    setTick(1);
  }, []);

  useEffect(() => {
    if (isEscPressed && timeMode === "animate") {
      setTimeMode("pause");
    } else if (isEscPressed && timeMode === "pause") {
      setTimeMode("animate");
      setTick(tick + 1);
    }
    console.log("isEscPressed", isEscPressed);
    console.log("timeMode", timeMode);
  }, [isEscPressed]);

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
        if (pathMode === "dynamic") {
          const [tempCol, tempRow] = lastPosition
            .split(",")
            .map((n) => Number(n));
          localGrid[tempRow][tempCol] = " ";
          setLastPosition(`${temp[0]},${temp[1]}`);
        }
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
        timeMode === "animate" && setTick(tick + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [tick]);

  return (
    <ConfigProvider
      value={{
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
        isControlled,
        setIsControlled,
      }}
    >
      <GameProvider
        value={{
          grid,
          setGrid,
          cameFrom,
          setCameFrom,
          walls,
          setWalls,
          start,
          setStart,
          goal,
          setGoal,
          currentTile,
        }}
      >
        <div className={`p-4 m-8 text-blue-600`}>
          {hasFoundGoal && <p>Found Goal</p>}
          <ButtonPanel />

          <Grid />

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
      </GameProvider>
    </ConfigProvider>
  );
}

export default App;
