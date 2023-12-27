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
  } = useContext(ConfigContext);

  return (
    <div className="flex">
      <Button
        title={timeMode === "play" ? "pause" : "play"}
        onClick={() => {
          const temp = timeMode === "play" ? "pause" : "play";
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
      />
      <Button
        title="+"
        onClick={() => {
          setSpeed(speed + SPEED_INCREMENT);
        }}
      />
      <p className={"flex mr-1 -ml-3 items-center"}>{speed}</p>
      <Button
        title="-"
        onClick={() => {
          setSpeed(speed - SPEED_INCREMENT);
        }}
      />
      <Button
        title="Pick Start"
        onClick={() => {
          setGameMode(gameMode === "pick-start" ? "regular" : "pick-start");
        }}
      />
      <Button
        title={`${hideData ? "Show" : "Hide"} Data`}
        onClick={() => {
          setHideData(!hideData);
        }}
      />
      <Button
        title={`${pathMode === "static" ? "Hide" : "Show"} Path`}
        onClick={() => {
          setPathMode(pathMode === "static" ? "dynamic" : "static");
        }}
      />
    </div>
  );
};

export default ButtonPanel;
