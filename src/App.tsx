import { useEffect, useState } from "react";

function App() {
  const gridInit = [
    ["A", " ", " ", " ", " ", "#", " ", " ", " ", " ", " ", "#", " ", " "],
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
  const [cameFrom, setCameFrom] = useState<Record<string, string>>({});
  // const [costSoFar, setCostSoFar] = useState<number[]>([0]);
  const endAddress = grid
    .reduce(
      (acc, row, i) => (row.includes("Z") ? `${row.indexOf("Z")},${i}` : acc),
      ""
    )
    .toString()
    .replace(/,/g, ",");

  const [goal, setGoal] = useState<string>(endAddress);
  const [start, setStart] = useState<string>(startInit);
  const [frontier, setFrontier] = useState<string[]>([start]);
  const [currentTile, setCurrentTile] = useState<string>("");
  const [hasFoundGoal, setHasFoundGoal] = useState<boolean>(false);
  const [neighbors, setNeighbors] = useState<Location<string>[]>([]);

  const [tick, setTick] = useState<number>(0);
  const [mode, setMode] = useState<string>("");
  const [timeMode, setTimeMode] = useState<string>("play");
  const [speed, setSpeed] = useState<number>(500);

  //   const dijkstra = <T= string>(
  //     graph: WeightedGrid<T>,
  //     start: string = '0,0',
  //     goal?: string
  //   ): [Record<string, string>, Record<string, number>] => {
  //     const djFrontier = new Set<string>()
  //     const dfCameFrom = {} as Record<string, string>
  //     const dfCostSoFar = {} as Record<string, number>
  //     // just started, no previous point
  //     djFrontier.add(start)
  //     dfCameFrom[start] = ''
  //     dfCostSoFar[start] = 0

  //     while (djFrontier.size > 0) {
  //       const current = djFrontier.values().next().value as string

  //       if (current === goal) {
  //         break
  //       }

  //       const neighbors = Object.values(graph.neighbors(current)) //.map((n) => n.id)
  //       const fromLocation = graph.nodes[current]
  //       for (const next of neighbors) {
  //         const toLocation = neighbors.find((n) => n === next) as Location<string>
  //         const newCost =
  //           dfCostSoFar[current] +
  //           graph.cost(fromLocation, toLocation)
  //         if (!(next.id in dfCostSoFar) || newCost < dfCostSoFar[next.id]) {
  //           dfCostSoFar[next.id] = newCost
  //           djFrontier.add(next.id)
  //           dfCameFrom[next.id] = current
  //         }
  //       }

  //       djFrontier.delete(current)
  //     }

  //     return [dfCameFrom, dfCostSoFar]
  //   }

  //   const isInBounds = (point: Location<string>, width: number, height: number) =>
  //   point.col >= 0 && point.col < width && point.row >= 0 && point.row < height

  // const islocationValid = (location: {row: string, col: string}, walls: Set<string>) =>
  //   !walls.has(`${location.col},${location.row}`)

  //   const getNeighbors = (
  //     point: string,
  //     nodes: string[][],
  //     inBounds: (point: Pick<Location<string>, "col" | "row">) => boolean,
  //     isValid: (pointID: string) => boolean,
  //     ignoreWalls?: boolean
  //   ) => {
  //     const tempNeighbors: Record<string, Location<string>> = {...neighbors}
  //     const [col, row] = point.split(',').map((n) => Number(n))
  //     const cardinalNeighbors = [
  //       { col: col - 1, row: row },
  //       { col: col + 1, row: row },
  //       { col: col, row: row - 1 },
  //       { col: col, row: row + 1 },
  //     ]
  //     const results = cardinalNeighbors
  //       .filter(inBounds)
  //       .map((p) => nodes[p.col][p.row])
  //     const filtered = results.filter(isValid)
  //     const dfNeighbors = ignoreWalls ? results : filtered
  //     dfNeighbors.forEach((p) => {
  //       tempNeighbors[p] =
  //     })
  //     return tempNeighbors
  //   }

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

  useEffect(() => {
    const localFrontier = [...frontier];
    const localCameFrom = { ...cameFrom };
    let localNeighbors: Location<string>[] = [...neighbors];
    // const localCostSoFar = {...costSoFar}

    // debugger;
    if (localFrontier.length > 0) {
      let current = currentTile || "";
      if (mode !== "neighbors") {
        current = localFrontier.shift() as string;
        const [col, row] = current.split(",").map((n) => Number(n));
        setCurrentTile(`${col},${row}`);

        if (`${col},${row}` === goal) {
          setHasFoundGoal(true);
          setGoal(current); // is this necessary?
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
        ); //.filter((n) => localCameFrom.some((s) => `${s[0]}:${s[1]}` !== n.id));
      }
      const next = localNeighbors.shift();
      setNeighbors(localNeighbors);
      setMode(localNeighbors.length > 0 ? "neighbors" : "frontier");
      if (next !== undefined) {
        if (
          // !localFrontier.includes(next.id) &&
          !(next.id in cameFrom)
          // !localCameFrom.some((lcf) => `${lcf[0]}:${lcf[1]}` === next.id)
        ) {
          localFrontier.push(next.id);
          localCameFrom[next.id] = current;
          setCameFrom(localCameFrom);
        }
      }
      setFrontier(localFrontier);
    } else {
      setTimeMode("pause");
    }

    const timeout = setTimeout(() => {
      timeMode === "play" && setTick(tick + 1);
    }, speed);
    return () => clearTimeout(timeout);
  }, [tick]);

  const getStyles = (col: number, row: number) => {
    const styles: string[] = [];

    frontier.includes(`${col},${row}`)
      ? styles.push("bg-blue-400")
      : Object.keys(cameFrom).some((cf) => cf.split(":")[0] === `${col},${row}`)
      ? styles.push("bg-orange-400")
      : "";

    neighbors.map((n) => n.id).includes(`${col},${row}`)
      ? styles.push("border-4 border-green-600")
      : "";

    currentTile === `${col},${row}` ? styles.push("bg-red-200") : "";

    return styles.join(" ");
  };

  const buttonStyles =
    "flex items-center justify-center mr-4 my-2 p-2 bg-gray-400 border border-gray-500 rounded-md hover:bg-gray-500 hover:text-slate-200";
  return (
    <div className="p-4 m-8 text-blue-600">
      {/* Buttons */}
      {hasFoundGoal && <p>Found Goal</p>}
      <div className="flex">
        <button
          className={buttonStyles}
          onClick={() => {
            setTick(tick + 1);
          }}
        >
          {tick}
        </button>
        <button
          className={buttonStyles}
          onClick={() => {
            setTimeMode(timeMode === "play" ? "pause" : "play");
            setTick(tick + 1);
          }}
        >
          {timeMode === "play" ? "pause" : "play"}
        </button>

        <button
          className={buttonStyles}
          onClick={() => {
            setSpeed(speed + 100);
          }}
        >
          +
        </button>
        <p className={"flex mr-1 -ml-3 items-center"}>{speed}</p>
        <button
          className={buttonStyles}
          onClick={() => {
            setSpeed(speed - 100);
          }}
        >
          -
        </button>
      </div>

      {/* Grid */}
      {grid.map((row, i) => (
        <div key={i} className="flex bg-gray-400">
          {row.map((col, j) => (
            <button
              key={j}
              title={`col: ${j}, row: ${i}`}
              className={`flex  text-3xl items-center justify-center w-8 h-8 border border-gray-500 hover:bg-gray-500 hover:text-slate-200 ${
                getStyles(j, i) || ""
              }
              `}
              onClick={() => {
                const newGrid = [...grid];
                newGrid[i][j] = newGrid[i][j] === "#" ? " " : "#";
                setGrid(newGrid);
              }}
            >
              {col}
            </button>
          ))}
        </div>
      ))}

      {/* Data Columns */}
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
