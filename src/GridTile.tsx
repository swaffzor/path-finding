import { useContext } from "react";
// import Draggable from "react-draggable";
import { gridInit } from "./constants";
import { gridToLocation } from "./utils";
import { ConfigContext, GameContext } from "./Context";

interface Props {
  col: number;
  row: number;
  value: string;
  isGhost: boolean;
  winner?: string;
  isPlayer?: boolean;
  onClick?: () => void;
}

const GridTile = ({
  col,
  row,
  value,
  isGhost,
  winner,
  isPlayer,
  onClick,
}: Props) => {
  const { gameMode, setGameMode } = useContext(ConfigContext);
  const { walls, grid, setWalls, setGrid, setStart, getStyles } =
    useContext(GameContext);

  return (
    <div>
      <button
        title={`col: ${col}, row: ${row}`}
        className={`${getStyles(col, row)}
          ${isPlayer ? " bg-purple-600 text-orange-400 text-3xl" : ""} ${
          isGhost ? " bg-green-600 text-4xl" : ""
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
        {isPlayer
          ? winner === "ghost"
            ? "🪦"
            : winner === "player"
            ? "🏆"
            : value
          : isGhost
          ? winner === "player"
            ? "💀"
            : "👻"
          : value}
      </button>
    </div>
  );
};

export default GridTile;
