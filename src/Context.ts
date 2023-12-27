import { createContext } from "react";

interface ConfigContextType {
  grid: string[][];
  cameFrom: Record<string, string>;
  tick: number;
  speed: number;
  hideData: boolean;
  timeMode: string;
  gameMode: string;
  pathMode: string;
  setGrid: (grid: string[][]) => void;
  setCameFrom: (cameFrom: Record<string, string>) => void;
  setTick: (tick: number) => void;
  setSpeed: (speed: number) => void;
  setHideData: (hideData: boolean) => void;
  setTimeMode: (timeMode: string) => void;
  setGameMode: (gameMode: string) => void;
  setPathMode: (pathMode: string) => void;
}

export const ConfigContext = createContext<ConfigContextType>({
  grid: [],
  cameFrom: {},
  tick: 0,
  speed: 100,
  hideData: false,
  timeMode: "",
  gameMode: "",
  pathMode: "",
  setGrid: () => {},
  setCameFrom: () => {},
  setTick: () => {},
  setSpeed: () => {},
  setHideData: () => {},
  setTimeMode: () => {},
  setGameMode: () => {},
  setPathMode: () => {},
});

export const ConfigProvider = ConfigContext.Provider;
