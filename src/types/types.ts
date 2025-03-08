export type AdjacentEdge = {
  startingNumber?: number;
  currentNumber?: number;
  enabled?: boolean;
};

export type CellState = {
  inputUp: boolean;
  inputDown: boolean;
  inputLeft: boolean;
  inputRight: boolean;

  mirror?: 'positive' | 'negative';
  blocked?: boolean; // Indicates if a mirror cannot go in this cell (X state)

  row: number;
  col: number;

  edgeTop?: AdjacentEdge;
  edgeBottom?: AdjacentEdge;
  edgeLeft?: AdjacentEdge;
  edgeRight?: AdjacentEdge;
};
