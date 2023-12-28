import { useContext, useState } from "react";
import Draggable from "react-draggable";
import { gridInit } from "./constants";
import { gridToLocation } from "./utils";
import { ConfigContext, GameContext } from "./Context";

interface Props {
  col: number;
  row: number;
  value: string;
  isGhost: boolean;
  onClick?: () => void;
  isPlayer?: boolean;
}

const GridTile = ({ col, row, value, isGhost, isPlayer, onClick }: Props) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  const { gameMode, setGameMode } = useContext(ConfigContext);
  const { walls, grid, setWalls, setGrid, setStart, getStyles } =
    useContext(GameContext);

  return (
    <div>
      {/* <Draggable
        key={col}
        grid={[13, 12]}
        onStart={(_, data) => {
          console.log("start", data);
        }}
        onStop={(_, data) => {
          console.log("stop", data);
        }}
        onDrag={(_, data) => {
          setDeltaPosition((prev) => {
            return { x: prev.x + data.deltaX, y: prev.y + data.deltaY };
          });
        }}
      > */}
      <button
        title={`col: ${col}, row: ${row}`}
        className={`flex text-sm items-center justify-center w-8 h-8 border border-gray-500 hover:bg-gray-500 hover:text-slate-200 hover:opacity-10 ${
          getStyles(col, row) || ""
        }
          ${isPlayer ? " bg-purple-600 text-white" : ""} ${
          isGhost ? " opacity-50 bg-green-600" : ""
        }
            `}
        onClick={() => {
          const newGrid = [...grid];
          const newVal =
            gameMode === "pick-start"
              ? "A"
              : newGrid[row][col] === "#"
              ? " "
              : "#";
          newGrid[row][col] = newVal;

          if (newVal === "#") {
            const newWalls = new Set([...walls, `${col},${row}`]);
            localStorage.setItem("walls", JSON.stringify([...newWalls]));
            setWalls(new Set(newWalls));
          } else if (newVal === "A") {
            localStorage.setItem("start", `${col},${row}`);
            setStart(`${col},${row}`);
            setGameMode("regular");
            const oldStart = gridToLocation(gridInit)
              .flat()
              .find((l) => l.value === "A" && l.id !== `${col},${row}`);
            newGrid[oldStart?.row as number][oldStart?.col as number] = " ";
          } else {
            const newWalls = new Set([...walls]);
            newWalls.delete(`${col},${row}`);
            localStorage.setItem("walls", JSON.stringify([...newWalls]));
            setWalls(new Set(newWalls));
          }

          setGrid(newGrid);
          onClick && onClick();
        }}
      >
        {value}
      </button>
      {/* </Draggable> */}
    </div>
  );
};

export default GridTile;
