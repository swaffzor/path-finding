interface Props {
  tick: number;
  speed: number;
  hideData: boolean;
  timeMode: string;
  gameMode: string;
  pathMode: string;
  setTick: (tick: number) => void;
  setSpeed: (speed: number) => void;
  setHideData: (hideData: boolean) => void;
  setTimeMode: (timeMode: string) => void;
  setGameMode: (gameMode: string) => void;
  setPathMode: (pathMode: string) => void;
}

const ButtonPanel = ({
  timeMode,
  setTimeMode,
  setTick,
  tick,
  setSpeed,
  speed,
  gameMode,
  setGameMode,
  setHideData,
  setPathMode,
  pathMode,
  hideData,
}: Props) => {
  const SPEED_INCREMENT = 50;

  const buttonStyles =
    "flex items-center justify-center mr-4 my-2 p-2 bg-gray-400 border border-gray-500 rounded-md hover:bg-gray-500 hover:text-slate-200";

  return (
    <div className="flex">
      <button
        className={buttonStyles}
        onClick={() => {
          const temp = timeMode === "play" ? "pause" : "play";
          setTimeMode(temp);
          localStorage.setItem("timeMode", temp);
          setTick(tick + 1);
        }}
      >
        {timeMode === "play" ? "pause" : "play"}
      </button>
      <button
        className={buttonStyles.concat(" w-12")}
        onClick={() => {
          setTick(tick + 1);
        }}
      >
        {tick}
      </button>

      <button
        className={buttonStyles}
        onClick={() => {
          setSpeed(speed + SPEED_INCREMENT);
        }}
      >
        +
      </button>
      <p className={"flex mr-1 -ml-3 items-center"}>{speed}</p>
      <button
        className={buttonStyles}
        onClick={() => {
          setSpeed(speed - SPEED_INCREMENT);
        }}
      >
        -
      </button>
      <button
        className={buttonStyles}
        onClick={() => {
          setGameMode(gameMode === "pick-start" ? "regular" : "pick-start");
        }}
      >
        Pick Start
      </button>
      <button
        className={buttonStyles}
        onClick={() => {
          setHideData(!hideData);
        }}
      >
        {hideData ? "Show " : "Hide "} Data
      </button>
      <button
        className={buttonStyles}
        onClick={() => {
          setPathMode(pathMode === "static" ? "dynamic" : "static");
        }}
      >
        {pathMode === "static" ? "Hide" : "Show"} Path
      </button>
    </div>
  );
};

export default ButtonPanel;
