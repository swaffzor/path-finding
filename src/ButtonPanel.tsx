import { useContext } from "react";
import Button from "./Button";
import { SPEED_INCREMENT } from "./constants";
import { ConfigContext } from "./Context";

const ButtonPanel = () => {
  const {
    timeMode,
    setTimeMode,
    setTick,
    tick,
    speed,
    setSpeed,
    gameMode,
    setGameMode,
    hideData,
    setHideData,
    pathMode,
    setPathMode,
    isControlled,
    setIsControlled,
  } = useContext(ConfigContext);

  return (
    <div className="flex">
      <div className="mx-4">
        <p className="text-3xl">Ghost Chase</p>
        <p>
          Stay away from 👻
          <br /> Build walls and trap 👻 to win
          <br /> Click/tap a grid square to
          <br /> build/break a #
          <br /> (the green tiles do nothing for now)
        </p>
      </div>
      <div className="mx-4">
        <p className="text-3xl">Controls</p>
        <p>
          <span className="font-bold">WASD/arrows:</span> move
        </p>
        <p>
          <span className="font-bold">SPACE:</span> 🔨 # (walls)
        </p>
        <p>
          <span className="font-bold">Easy:</span> 👻 obeys #
          <br />
          <span className="font-bold">Hard:</span> 👻 ignores #
        </p>
      </div>
      {/* <Button
        title={timeMode === "animate" ? "pause" : "Paused"}
        onClick={() => {
          const temp = timeMode === "animate" ? "pause" : "animate";
          setTimeMode(temp);
          localStorage.setItem("timeMode", temp);
          setTick(tick + 1);
        }}
      />
      <Button
        title={tick.toString()}
        extraStyles="w-12"
        onClick={() => {
          setTick(tick + 1);
        }}
      /> */}
      <Button
        title="👻 Slower"
        onClick={() => {
          setSpeed(speed + SPEED_INCREMENT);
        }}
      />
      <p className={"flex mr-1 -ml-3 items-center text-3xl"}>
        {speed === 0
          ? "🤬"
          : speed < 100
          ? "🥵"
          : speed > 200
          ? "😴"
          : speed > 100
          ? "🥱"
          : "🥸"}
      </p>
      <Button
        title="👻 Faster"
        onClick={() => {
          setSpeed(speed === 0 ? speed : speed - SPEED_INCREMENT);
        }}
      />
      {/* <Button
        title="Controlled"
        extraStyles={`${
          isControlled ? "border-4 border-blue-500 opacity-75" : ""
        }`}
        onClick={() => {
          setGameMode(gameMode === "controlled" ? "regular" : "controlled");
          localStorage.setItem("isControlled", (!isControlled).toString());
          setIsControlled(!isControlled);
        }}
      /> */}
      {/* <Button
        title={`${hideData ? "Show" : "Hide"} Data`}
        onClick={() => {
          localStorage.setItem("hideData", (!hideData).toString());
          setHideData(!hideData);
        }}
      /> */}
      <Button
        title={pathMode === "walls" ? "Easy" : "Hard"}
        onClick={() => {
          setPathMode(pathMode === "no-walls" ? "walls" : "no-walls");
        }}
      />
      <Button
        title={`Clear All #`}
        onClick={() => {
          setPathMode("clear-walls");
        }}
      />
    </div>
  );
};

export default ButtonPanel;
