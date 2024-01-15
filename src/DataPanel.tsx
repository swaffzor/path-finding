import { useContext } from "react";
import { GameContext } from "./Context";
import { Location } from "./types";

interface Props {
  frontier: string[];
  neighbors: Location<string>[];
}

const DataPanel = ({ frontier, neighbors }: Props) => {
  const { cameFrom, currentTile } = useContext(GameContext);

  return (
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
  );
};

export default DataPanel;
