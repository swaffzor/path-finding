import { Location } from "./types";

export const gridToLocation = (inGrid: string[][]) => {
  const localGrid: Location<string>[][] = [];
  for (let row = 0; row < inGrid.length; row++) {
    const tempRow: Location<string>[] = [];
    for (let col = 0; col < inGrid[row].length; col++) {
      tempRow.push({
        col,
        row,
        value: inGrid[row][col],
        id: `${col},${row}`,
      });
    }
    localGrid.push(tempRow);
  }
  return localGrid;
};

export const getPointNeighbors = (
  point: Location<string>,
  grid: string[][],
  includeDiagonals = false
) => {
  const gpnNeighbors: Location<string>[] = [];

  const left = point.col - 1 >= 0 && grid[point.row][point.col - 1];
  const right =
    point.col + 1 < grid[point.row]?.length && grid[point.row][point.col + 1];
  const above = point.row - 1 >= 0 && grid[point.row - 1][point.col];
  const below = point.row + 1 < grid?.length && grid[point.row + 1][point.col];

  const leftAbove =
    left !== false && above !== false && grid[point.row - 1][point.col - 1];
  const rightAbove =
    right !== false && above !== false && grid[point.row - 1][point.col + 1];
  const leftBelow =
    left !== false && below !== false && grid[point.row + 1][point.col - 1];
  const rightBelow =
    right !== false && below !== false && grid[point.row + 1][point.col + 1];

  if (left !== false) {
    gpnNeighbors.push({
      col: point.col - 1,
      row: point.row,
      id: `${point.col - 1},${point.row}`,
      value: grid[point.row][point.col - 1],
    });
  }
  if (right !== false) {
    gpnNeighbors.push({
      col: point.col + 1,
      row: point.row,
      id: `${point.col + 1},${point.row}`,
      value: grid[point.row][point.col + 1],
    });
  }
  if (above !== false) {
    gpnNeighbors.push({
      col: point.col,
      row: point.row - 1,
      id: `${point.col},${point.row - 1}`,
      value: grid[point.row - 1][point.col],
    });
  }
  if (below !== false) {
    gpnNeighbors.push({
      col: point.col,
      row: point.row + 1,
      id: `${point.col},${point.row + 1}`,
      value: grid[point.row + 1][point.col],
    });
  }
  if (includeDiagonals && leftAbove !== false) {
    gpnNeighbors.push({
      col: point.col - 1,
      row: point.row - 1,
      id: `${point.col - 1},${point.row - 1}`,
      value: grid[point.row - 1][point.col - 1],
    });
  }
  if (includeDiagonals && rightAbove !== false) {
    gpnNeighbors.push({
      col: point.col + 1,
      row: point.row - 1,
      id: `${point.col + 1},${point.row - 1}`,
      value: grid[point.row - 1][point.col + 1],
    });
  }
  if (includeDiagonals && leftBelow !== false) {
    gpnNeighbors.push({
      col: point.col - 1,
      row: point.row + 1,
      id: `${point.col - 1},${point.row + 1}`,
      value: grid[point.row + 1][point.col - 1],
    });
  }
  if (includeDiagonals && rightBelow !== false) {
    gpnNeighbors.push({
      col: point.col + 1,
      row: point.row + 1,
      id: `${point.col + 1},${point.row + 1}`,
      value: grid[point.row + 1][point.col + 1],
    });
  }

  return gpnNeighbors;
};

export const breadthSearch = (
  grid: string[][],
  start: string = "0,0",
  goal?: string,
  walls: Set<string> = new Set()
) => {
  const frontier = new Set<string>();
  frontier.add(start);
  const cameFrom = {} as Record<string, string>;
  cameFrom[start] = ""; // just started, no previous point

  while (frontier.size > 0) {
    const current = frontier.values().next().value as string;

    if (current === goal) {
      break;
    }

    const [col, row] = current.split(",").map(Number);
    const neighbors = Object.values(
      getPointNeighbors(
        {
          col,
          row,
          value: current,
          id: current,
        },
        grid
      ).filter((n) => !walls.has(n.id) && !(n.id in cameFrom))
    );

    for (const next of neighbors) {
      const id = `${next.col},${next.row}`;
      if (!(id in cameFrom)) {
        frontier.add(id);
        cameFrom[id] = current;
      }
    }

    frontier.delete(current);
  }
  return cameFrom;
};

export const reconstructPath = (
  start: string,
  goal: string,
  cameFrom: Record<string, string>
) => {
  let current = goal;
  // A path is a sequence of edges, but often it’s easier to store the nodes
  const path: string[] = [];

  while (current !== start && current !== undefined) {
    path.push(current);
    current = cameFrom[current];

    if (current === undefined) {
      console.error("No path found");
      return [];
    }
    if (path.includes(current)) {
      console.error("Path is not unique");
      console.log(
        JSON.stringify({ current, start, goal, path, cameFrom }, null, 2)
      );
      break;
    }
  }
  path.push(start); // optional
  path.reverse(); // optional
  return path;
};
