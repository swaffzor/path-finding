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
  const { gameMode, setGameMode, isControlled } = useContext(ConfigContext);
  const { walls, setWalls, setStart, currentTile, start, cameFrom, grid } =
    useContext(GameContext);

  const getStyles = (col: number, row: number) => {
    const styles: string[] = [
      "flex items-center justify-center w-8 h-8 border border-gray-500 hover:bg-gray-500 hover:text-slate-200 hover:opacity-10",
    ];

    if (currentTile === `${col},${row}` && !isControlled) {
      styles.push("border-2 border-red-400");
    }
    if (
      (start === `${col},${row}` || grid[row][col] === "X") &&
      !isControlled
    ) {
      styles.push("text-red-600");
    }

    // if (frontier.includes(`${col},${row}`) && !isControlled) {
    //   styles.push("bg-blue-400");
    // }
    if (Object.values(walls).includes(`${col},${row}`)) {
      styles.push("text-slate-700 bg-slate-500");
    }

    if (
      Object.keys(cameFrom).some(
        (cf) => cf.split(":")[0] === `${col},${row}`
      ) &&
      !isControlled
    ) {
      styles.push("bg-blue-500");
    }

    // if (neighbors.map((n) => n.id).includes(`${col},${row}`)) {
    //   styles.push("border-4 border-green-600");
    // }

    if (gameMode === "pick-start" && start === `${col},${row}`) {
      styles.push(
        "hover:opacity-75 opacity-50 shadow-inner hover:bg-green-600"
      );
    }

    return styles.join(" ").trim();
  };

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
