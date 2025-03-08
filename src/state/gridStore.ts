import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CellState } from '../types/types';

function initializeGrid(): CellState[][] {
  const grid: CellState[][] = [];
  for (let row = 0; row < 10; row++) {
    const rowArray: CellState[] = [];
    for (let col = 0; col < 10; col++) {
      rowArray.push({
        inputUp: false,
        inputDown: false,
        inputLeft: false,
        inputRight: false,
        row,
        col,
        edgeTop: row === 0 ? {} : undefined,
        edgeBottom: row === 9 ? {} : undefined,
        edgeLeft: col === 0 ? {} : undefined,
        edgeRight: col === 9 ? {} : undefined,
      });
    }
    grid.push(rowArray);
  }
  grid[0][2].edgeTop!.startingNumber = 112;
  grid[0][4].edgeTop!.startingNumber = 48;
  grid[0][5].edgeTop!.startingNumber = 3087;
  grid[0][6].edgeTop!.startingNumber = 9;
  grid[0][9].edgeTop!.startingNumber = 1;
  grid[1][9].edgeRight!.startingNumber = 4;
  grid[2][9].edgeRight!.startingNumber = 27;
  grid[6][9].edgeRight!.startingNumber = 16;
  grid[9][0].edgeBottom!.startingNumber = 2025;
  grid[9][3].edgeBottom!.startingNumber = 12;
  grid[9][4].edgeBottom!.startingNumber = 64;
  grid[9][5].edgeBottom!.startingNumber = 5;
  grid[9][7].edgeBottom!.startingNumber = 405;
  grid[3][0].edgeLeft!.startingNumber = 27;
  grid[7][0].edgeLeft!.startingNumber = 12;
  grid[8][0].edgeLeft!.startingNumber = 225;
  return grid;
}

function calcProduct(existingSums: number[]): number {
  // Multiply all the numbers in existingSums
  return existingSums.reduce((acc, curr) => acc * curr, 1);
}

function tracePath(
  grid: CellState[][],
  row: number,
  col: number,
  from: 'top' | 'bottom' | 'left' | 'right',
  existingSums: number[],
  runningSum: number
): number {
  switch (from) {
    case 'top':
      grid[row][col].inputUp = true;
      if (grid[row][col].mirror) {
        runningSum += 0.5;
        existingSums.push(runningSum);
        runningSum = 0.5;
        if (grid[row][col].mirror === 'positive') {
          if (col === 0) {
            // On an edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeLeft!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row, col - 1, 'right', existingSums, runningSum);
          }
        } else {
          if (col === 9) {
            // On an edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeRight!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row, col + 1, 'left', existingSums, runningSum);
          }
        }
      } else {
        runningSum += 1;
        if (row === 9) {
          // Reached the bottom.
          runningSum += 0.5;
          existingSums.push(runningSum);
          const product = calcProduct(existingSums);
          grid[row][col].edgeBottom!.currentNumber = product;
          return product;
        } else {
          return tracePath(grid, row + 1, col, 'top', existingSums, runningSum);
        }
      }
      break;
    case 'bottom':
      grid[row][col].inputDown = true;
      if (grid[row][col].mirror) {
        runningSum += 0.5;
        existingSums.push(runningSum);
        runningSum = 0.5;
        if (grid[row][col].mirror === 'positive') {
          if (col === 9) {
            // On an edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeRight!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row, col + 1, 'left', existingSums, runningSum);
          }
        } else {
          if (col === 0) {
            // On an edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeLeft!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row, col - 1, 'right', existingSums, runningSum);
          }
        }
      } else {
        runningSum += 1;
        if (row === 0) {
          // Reached the top.
          runningSum += 0.5;
          existingSums.push(runningSum);
          const product = calcProduct(existingSums);
          grid[row][col].edgeTop!.currentNumber = product;
          return product;
        } else {
          return tracePath(grid, row - 1, col, 'bottom', existingSums, runningSum);
        }
      }
      break;
    case 'left':
      grid[row][col].inputLeft = true;
      if (grid[row][col].mirror) {
        runningSum += 0.5;
        existingSums.push(runningSum);
        runningSum = 0.5;
        if (grid[row][col].mirror === 'positive') {
          if (row === 0) {
            // On the top edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeTop!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row - 1, col, 'bottom', existingSums, runningSum);
          }
        } else {
          if (row === 9) {
            // On the bottom edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeBottom!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row + 1, col, 'top', existingSums, runningSum);
          }
        }
      } else {
        runningSum += 1;
        if (col === 9) {
          // Reached the right edge.
          runningSum += 0.5;
          existingSums.push(runningSum);
          const product = calcProduct(existingSums);
          grid[row][col].edgeRight!.currentNumber = product;
          return product;
        } else {
          return tracePath(grid, row, col + 1, 'left', existingSums, runningSum);
        }
      }
      break;
    case 'right':
      grid[row][col].inputRight = true;
      if (grid[row][col].mirror) {
        runningSum += 0.5;
        existingSums.push(runningSum);
        runningSum = 0.5;
        if (grid[row][col].mirror === 'positive') {
          if (row === 9) {
            // On the bottom edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeBottom!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row + 1, col, 'top', existingSums, runningSum);
          }
        } else {
          if (row === 0) {
            // On the top edge.
            runningSum += 0.5;
            existingSums.push(runningSum);
            const product = calcProduct(existingSums);
            grid[row][col].edgeTop!.currentNumber = product;
            return product;
          } else {
            return tracePath(grid, row - 1, col, 'bottom', existingSums, runningSum);
          }
        }
      } else {
        runningSum += 1;
        if (col === 0) {
          // Reached the left edge.
          runningSum += 0.5;
          existingSums.push(runningSum);
          const product = calcProduct(existingSums);
          grid[row][col].edgeLeft!.currentNumber = product;
          return product;
        } else {
          return tracePath(grid, row, col - 1, 'right', existingSums, runningSum);
        }
      }
  }
}

function retracePaths(newState: GridState): void {
  for (const cellRow of newState.grid) {
    for (const cell of cellRow) {
      cell.inputUp = false;
      cell.inputDown = false;
      cell.inputLeft = false;
      cell.inputRight = false;

      if (cell.edgeTop) cell.edgeTop.currentNumber = undefined;
      if (cell.edgeBottom) cell.edgeBottom.currentNumber = undefined;
      if (cell.edgeLeft) cell.edgeLeft.currentNumber = undefined;
      if (cell.edgeRight) cell.edgeRight.currentNumber = undefined;
    }
  }
  for (const cellRow of newState.grid) {
    for (const cell of cellRow) {
      if (cell.edgeTop && cell.edgeTop.enabled) {
        cell.edgeTop.currentNumber = tracePath(newState.grid, cell.row, cell.col, 'top', [], 0.5);
      }
      if (cell.edgeBottom && cell.edgeBottom.enabled) {
        cell.edgeBottom.currentNumber = tracePath(
          newState.grid,
          cell.row,
          cell.col,
          'bottom',
          [],
          0.5
        );
      }
      if (cell.edgeLeft && cell.edgeLeft.enabled) {
        cell.edgeLeft.currentNumber = tracePath(newState.grid, cell.row, cell.col, 'left', [], 0.5);
      }
      if (cell.edgeRight && cell.edgeRight.enabled) {
        cell.edgeRight.currentNumber = tracePath(
          newState.grid,
          cell.row,
          cell.col,
          'right',
          [],
          0.5
        );
      }
    }
  }
  // Log all current numbers
  for (const cellRow of newState.grid) {
    for (const cell of cellRow) {
      if (cell.edgeTop && cell.edgeTop.currentNumber) {
        console.log(`Cell (${cell.row}, ${cell.col}) top: ${cell.edgeTop.currentNumber}`);
      }
      if (cell.edgeBottom && cell.edgeBottom.currentNumber) {
        console.log(`Cell (${cell.row}, ${cell.col}) bottom: ${cell.edgeBottom.currentNumber}`);
      }
      if (cell.edgeLeft && cell.edgeLeft.currentNumber) {
        console.log(`Cell (${cell.row}, ${cell.col}) left: ${cell.edgeLeft.currentNumber}`);
      }
      if (cell.edgeRight && cell.edgeRight.currentNumber) {
        console.log(`Cell (${cell.row}, ${cell.col}) right: ${cell.edgeRight.currentNumber}`);
      }
    }
  }
}

type GridState = {
  grid: CellState[][];
  showInstructions: boolean;

  clickCell: (row: number, col: number) => void;
  clickEdge: (row: number, col: number, edge: 'top' | 'bottom' | 'left' | 'right') => void;

  refreshGrid: () => void;
  toggleInstructions: () => void;
};
export const useGridStore = create<GridState>()(
  persist(
    set => ({
      grid: initializeGrid(),
      showInstructions: false,

      clickCell: (row: number, col: number) => {
        set(state => {
          // Mirrors cannot be placed in orthoganally adjacent cells.
          if (row > 0 && state.grid[row - 1][col].mirror) {
            return state;
          }
          if (row < 9 && state.grid[row + 1][col].mirror) {
            return state;
          }
          if (col > 0 && state.grid[row][col - 1].mirror) {
            return state;
          }
          if (col < 9 && state.grid[row][col + 1].mirror) {
            return state;
          }
          const newState = { ...state };
          const existingMirror = newState.grid[row][col].mirror;
          newState.grid[row][col].mirror = !existingMirror
            ? 'positive'
            : existingMirror === 'positive'
              ? 'negative'
              : undefined;
          retracePaths(newState);
          return newState;
        });
      },

      clickEdge: (row: number, col: number, edge: 'top' | 'bottom' | 'left' | 'right') => {
        set(state => {
          const newState = { ...state };
          const edgeState =
            edge === 'top'
              ? newState.grid[row][col].edgeTop!
              : edge === 'bottom'
                ? newState.grid[row][col].edgeBottom!
                : edge === 'left'
                  ? newState.grid[row][col].edgeLeft!
                  : newState.grid[row][col].edgeRight!;

          // Explicitly set to true if undefined or false, and to false if true
          edgeState.enabled = edgeState.enabled !== true;

          retracePaths(newState);
          return newState;
        });
      },

      refreshGrid: () => {
        set({
          grid: initializeGrid(),
        });
      },

      toggleInstructions: () => {
        set(state => ({
          showInstructions: !state.showInstructions,
        }));
      },
    }),
    {
      name: 'puzzle-grid-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
