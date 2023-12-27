import { createContext } from "react";

interface ConfigContextType {
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

export const ConfigContext = createContext<ConfigContextType>({
  tick: 0,
  speed: 100,
  hideData: false,
  timeMode: "",
  gameMode: "",
  pathMode: "",
  setTick: () => {},
  setSpeed: () => {},
  setHideData: () => {},
  setTimeMode: () => {},
  setGameMode: () => {},
  setPathMode: () => {},
});

export const ConfigProvider = ConfigContext.Provider;

interface TileContextType {
  grid: string[][];
  walls: Set<string>;
  cameFrom: Record<string, string>;
  start: string;
  setStart: (start: string) => void;
  setGrid: (grid: string[][]) => void;
  setCameFrom: (cameFrom: Record<string, string>) => void;
  getStyles: (row: number, col: number) => string;
  setWalls: (values: Set<string>) => void;
}

export const GameContext = createContext<TileContextType>({
  grid: [],
  cameFrom: {},
  walls: new Set(),
  start: "",
  setStart: () => {},
  setGrid: () => {},
  setCameFrom: () => {},
  getStyles: () => "",
  setWalls: () => {},
});

export const GameProvider = GameContext.Provider;
