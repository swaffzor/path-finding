export interface Location<T> {
  id: string;
  value: T;
  col: number;
  row: number;
  cost?: number;
}
export interface Graph<T> {
  nodes: Record<string, Location<T>>;
  edges?: (pointID: string) => Record<string, Location<T>>;
  neighbors: (id: string, ignoreWalls?: boolean) => Record<string, Location<T>>; // id is a string of the form "col,row"
}
export interface SquareGrid<T> extends Graph<T> {
  width: number;
  height: number;
  walls: Set<string>;
  inBounds: (point: Location<T>) => boolean;
  isValid: (point: Location<T>) => boolean;
}
export interface WeightedGrid<T> extends SquareGrid<T> {
  weights: Record<string, number>;
}
