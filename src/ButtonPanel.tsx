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
      <Button
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
        title="Controlled"
        extraStyles={`${
          isControlled ? "border-4 border-blue-500 opacity-75" : ""
        }`}
        onClick={() => {
          setGameMode(gameMode === "controlled" ? "regular" : "controlled");
          localStorage.setItem("isControlled", (!isControlled).toString());
          setIsControlled(!isControlled);
        }}
      />
      <Button
        title={`${hideData ? "Show" : "Hide"} Data`}
        onClick={() => {
          localStorage.setItem("hideData", (!hideData).toString());
          setHideData(!hideData);
        }}
      />
      <Button
        title={`Wall Mode (${pathMode})`}
        onClick={() => {
          setPathMode(pathMode === "no-walls" ? "walls" : "no-walls");
        }}
      />
    </div>
  );
};

export default ButtonPanel;
