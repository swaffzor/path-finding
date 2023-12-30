import { useContext } from "react";
// import Draggable from "react-draggable";
// import { gridInit } from "./constants";
// import { gridToLocation } from "./utils";
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
  const styles: string[] = [];
  if (/^\d+$/.test(value)) {
    switch (value) {
      case "5":
        styles.push("bg-green-600");
        break;
      case "4":
        styles.push("bg-green-500");
        break;
      case "3":
        styles.push("bg-green-400");
        break;
      case "2":
        styles.push("bg-green-300");
        break;
      case "1":
        styles.push("bg-green-200");
        break;

      default:
        break;
    }
  }
  return (
    <div>
      <button
        title={`col: ${col}, row: ${row}`}
        className={`${styles.join(" ")} ${getStyles(col, row)}
          ${isPlayer ? " bg-purple-600 text-orange-400 text-3xl" : ""} ${
          isGhost ? " bg-green-600 text-4xl" : ""
        }
            `}
        onClick={() => {
          const newVal =
            gameMode === "pick-start"
              ? "A"
              : walls.has(`${col},${row}`)
              ? " "
              : "#";

          if (newVal === "#") {
            const newWalls = new Set([...walls, `${col},${row}`]);
            localStorage.setItem("walls", JSON.stringify([...newWalls]));
            setWalls(new Set(newWalls));
          } else if (newVal === "A") {
            localStorage.setItem("start", `${col},${row}`);
            setStart(`${col},${row}`);
            setGameMode("regular");
          } else {
            const newWalls = new Set([...walls]);
            newWalls.delete(`${col},${row}`);
            localStorage.setItem("walls", JSON.stringify([...newWalls]));
            setWalls(new Set(newWalls));
          }

          onClick && onClick();
        }}
      >
        {walls.has(`${col},${row}`)
          ? "#"
          : isPlayer
          ? winner === "ghost"
            ? "🪦"
            : winner === "player"
            ? "🏆"
            : value
          : isGhost
          ? winner === "player"
            ? "💀"
            : "👻"
          : /^\d+$/.test(value) // is number
          ? " "
          : value === "1"
          ? "?"
          : value}
      </button>
    </div>
  );
};

export default GridTile;
