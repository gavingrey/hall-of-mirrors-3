export type AdjacentEdge = {
    startingNumber?: number;
    currentNumber?: number;
}

export type CellState = {
    inputUp: boolean;
    inputDown: boolean;
    inputLeft: boolean;
    inputRight: boolean;

    mirror?: 'positive' | 'negative';

    row: number;
    col: number;

    edgeTop?: AdjacentEdge;
    edgeBottom?: AdjacentEdge;
    edgeLeft?: AdjacentEdge;
    edgeRight?: AdjacentEdge;
}