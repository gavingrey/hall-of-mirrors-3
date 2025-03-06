import { create } from 'zustand';
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

type GridState = {
    grid: CellState[][];

    clickCell: (row: number, col: number) => void;
    clickEdge: (row: number, col: number, edge: 'top' | 'bottom' | 'left' | 'right') => void;
};

export const useGridStore = create<GridState>((set) => ({
    grid: initializeGrid(),

    clickCell: (row, col) => {
        set((state) => {
            const newState = { ...state };
            const cell = state.grid[row][col];
            cell.inputUp = !cell.inputUp;
            cell.inputDown = !cell.inputDown;
            cell.inputLeft = !cell.inputLeft;
            cell.inputRight = !cell.inputRight;
            newState.grid[row][col] = cell;
            return newState;
        });
    },

    clickEdge: (row, col, edge) => {
        set((state) => {
            const newState = { ...state };
            const cell = state.grid[row][col];
            const edgeKey = `edge${edge.charAt(0).toUpperCase() + edge.slice(1)}` as 'edgeTop' | 'edgeBottom' | 'edgeLeft' | 'edgeRight';
            const edgeData = cell[edgeKey];
            if (edgeData) {
                edgeData.currentNumber = edgeData.currentNumber ? undefined : edgeData.startingNumber;
                newState.grid[row][col][edgeKey] = edgeData;
            }
            return newState;
        });
    }

}));