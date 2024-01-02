import { createContext } from "react";

interface ConfigContextType {
  tick: number;
  speed: number;
  hideData: boolean;
  timeMode: string;
  gameMode: string;
  pathMode: string;
  isControlled: boolean;
  setIsControlled: (isControlled: boolean) => void;
  setTick: (tick: number) => void;
  setSpeed: (speed: number) => void;
  setHideData: (hideData: boolean) => void;
  setTimeMode: (timeMode: string) => void;
  setGameMode: (gameMode: string) => void;
  setPathMode: (pathMode: string) => void;
}

export const ConfigContext = createContext<ConfigContextType>({
  tick: 0,
  speed: 100,
  hideData: false,
  timeMode: "",
  gameMode: "",
  pathMode: "",
  isControlled: false,
  setTick: () => {},
  setSpeed: () => {},
  setHideData: () => {},
  setTimeMode: () => {},
  setGameMode: () => {},
  setPathMode: () => {},
  setIsControlled: () => {},
});

export const ConfigProvider = ConfigContext.Provider;

interface TileContextType {
  grid: string[][];
  walls: Set<string>;
  cameFrom: Record<string, string>;
  start: string;
  goal: string;
  currentTile: string;
  setGrid: (grid: string[][]) => void;
  setWalls: (values: Set<string>) => void;
  setCameFrom: (cameFrom: Record<string, string>) => void;
  setStart: (start: string) => void;
  setGoal: (goal: string) => void;
}

export const GameContext = createContext<TileContextType>({
  grid: [],
  cameFrom: {},
  walls: new Set(),
  start: "",
  goal: "",
  currentTile: "",
  setGrid: () => {},
  setCameFrom: () => {},
  setWalls: () => {},
  setStart: () => {},
  setGoal: () => {},
});

export const GameProvider = GameContext.Provider;
