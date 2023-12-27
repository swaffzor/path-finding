import { useContext } from "react";
import GridTile from "./GridTile";
import { ConfigContext, GameContext } from "./Context";

const Grid = () => {
  const { gameMode } = useContext(ConfigContext);
  const { grid } = useContext(GameContext);

  return (
    <>
      {grid.map((row, i) => (
        <div
          key={i}
          className={`flex bg-gray-400 ${
            gameMode === "pick-start" ? "opacity-50" : ""
          }`}
        >
          {row.map((value, j) => (
            <GridTile key={j} col={j} row={i} value={value} />
          ))}
        </div>
      ))}
    </>
  );
};

export default Grid;
