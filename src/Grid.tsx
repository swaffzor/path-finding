import { gridInit } from "./constants";
import { gridToLocation } from "./utils";

interface Props {
  grid: string[][];
  gameMode: string;
  getStyles: (j: number, i: number) => string;
  walls: Set<string>;
  setWalls: (walls: Set<string>) => void;
  setStart: (start: string) => void;
  setGameMode: (gameMode: string) => void;
  setGrid: (grid: string[][]) => void;
}

const Grid = ({
  grid,
  gameMode,
  getStyles,
  walls,
  setWalls,
  setStart,
  setGameMode,
  setGrid,
}: Props) => {
  return (
    <>
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
    </>
  );
};

export default Grid;
