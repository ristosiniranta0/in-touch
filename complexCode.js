// filename: complexCode.js

/*
   This code generates a random maze using a depth-first search algorithm.
   It then solves the maze using the A* algorithm.
*/

function Cell(x, y) {
  this.x = x;
  this.y = y;
  this.walls = [true, true, true, true];
  this.visited = false;
}

const grid = [];
const stack = [];
const openSet = [];
const closedSet = [];

const rows = 25;
const cols = 25;
const cellWidth = 20;

let start;
let end;
let current;
let solved;

function setup() {
  createCanvas(rows * cellWidth, cols * cellWidth);

  // Generate grid of cells
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(new Cell(i, j));
    }
    grid.push(row);
  }

  current = grid[0][0];
  start = current;
  end = grid[rows - 1][cols - 1];

  stack.push(current);
  current.visited = true;
  solved = false;
}

function draw() {
  background(51);

  // Maze generation
  while (stack.length > 0) {
    const unvisitedNeighbors = getUnvisitedNeighbors(current);
    if (unvisitedNeighbors.length > 0) {
      const randomNeighbor = random(unvisitedNeighbors);
      removeWalls(current, randomNeighbor);
      stack.push(randomNeighbor);

      current = randomNeighbor;
      current.visited = true;
    } else if (stack.length > 0) {
      current = stack.pop();
    }
  }

  // Maze drawing
  for (const row of grid) {
    for (const cell of row) {
      const x = cell.x * cellWidth;
      const y = cell.y * cellWidth;

      stroke(255);
      if (cell.walls[0]) line(x, y, x + cellWidth, y);
      if (cell.walls[1]) line(x + cellWidth, y, x + cellWidth, y + cellWidth);
      if (cell.walls[2]) line(x + cellWidth, y + cellWidth, x, y + cellWidth);
      if (cell.walls[3]) line(x, y + cellWidth, x, y);

      if (solved && closedSet.includes(cell)) {
        fill(255, 0, 0, 100);
        noStroke();
        rect(x, y, cellWidth, cellWidth);
      }
    }
  }

  if (!solved) {
    // Solving the maze
    if (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }

      const current = openSet[winner];
      if (current === end) {
        // Maze solved!
        let path = [];
        let temp = current;
        path.push(temp);
        while (temp.previous) {
          path.push(temp.previous);
          temp = temp.previous;
        }
        console.log(`Shortest path length: ${path.length}`);

        solved = true;
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          const tempG = current.g + 1;
          let newPath = false;
          if (openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG;
              newPath = true;
            }
          } else {
            neighbor.g = tempG;
            openSet.push(neighbor);
            newPath = true;
          }

          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
    } else {
      solved = true;
      console.log("No solution found!");
    }
  }

  // Draw start and end points
  fill(0, 255, 0);
  rect(start.x * cellWidth, start.y * cellWidth, cellWidth, cellWidth);

  fill(255, 0, 0);
  rect(end.x * cellWidth, end.y * cellWidth, cellWidth, cellWidth);
}

function heuristic(a, b) {
  return abs(a.x - b.x) + abs(a.y - b.y);
}

function getUnvisitedNeighbors(cell) {
  const neighbors = [];

  const top = grid[cell.x][cell.y - 1];
  const right = grid[cell.x + 1] && grid[cell.x + 1][cell.y];
  const bottom = grid[cell.x][cell.y + 1];
  const left = grid[cell.x - 1] && grid[cell.x - 1][cell.y];

  if (top && !top.visited) neighbors.push(top);
  if (right && !right.visited) neighbors.push(right);
  if (bottom && !bottom.visited) neighbors.push(bottom);
  if (left && !left.visited) neighbors.push(left);

  return neighbors;
}

function removeWalls(a, b) {
  const x = a.x - b.x;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }

  const y = a.y - b.y;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function getNeighbors(cell) {
  const neighbors = [];

  const top = grid[cell.x][cell.y - 1];
  const right = grid[cell.x + 1] && grid[cell.x + 1][cell.y];
  const bottom = grid[cell.x][cell.y + 1];
  const left = grid[cell.x - 1] && grid[cell.x - 1][cell.y];

  if (top && !top.walls[2]) neighbors.push(top);
  if (right && !right.walls[3]) neighbors.push(right);
  if (bottom && !bottom.walls[0]) neighbors.push(bottom);
  if (left && !left.walls[1]) neighbors.push(left);

  return neighbors;
}

function removeFromArray(arr, element) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === element) {
      arr.splice(i, 1);
    }
  }
}

setup();

// Uncomment the line below to automatically solve the maze once generated
// solveMaze();