import React from 'react';
import { useGridStore } from './state/gridStore';
import Cell from './Cell';

export const Grid: React.FC = () => {
  const { grid } = useGridStore();
  
  // Use fixed cell size - scaling will be handled by the container
  const cellSize = 60;
  
  // Calculate total grid dimensions
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  
  // Add padding for numbers and dots outside cells
  const padding = 20;
  
  // Total outer width/height including padding
  const totalWidth = cols * cellSize + padding * 2;
  const totalHeight = rows * cellSize + padding * 2;

  return (
    <div className="relative" style={{ width: totalWidth, height: totalHeight }}>
      <div
        className="absolute grid box-content border-2 border-black"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          top: `${padding}px`,
          left: `${padding}px`
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              size={cellSize}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;