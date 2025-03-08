import React from 'react';
import { CellState } from './types/types';
import { useGridStore } from './state/gridStore';

interface CellProps {
  cell: CellState;
  size?: number; // Make size a prop with a default value
}

export const Cell: React.FC<CellProps> = ({
  cell,
  size = 60, // Default to 60 to match Grid.tsx cellSize
}) => {
  const {
    inputUp,
    inputDown,
    inputLeft,
    inputRight,
    mirror,
    edgeTop,
    edgeBottom,
    edgeLeft,
    edgeRight,
  } = cell;

  const { clickCell, clickEdge } = useGridStore();

  // SVG dimensions for the cell content - use 100% to fill the entire cell
  const svgSize = '100%';
  const mirrorThickness = 3;
  const laserThickness = 2;

  // Helper to calculate the laser path based on input direction and mirror
  const renderLaserPaths = () => {
    const paths = [];

    // Handle input from the top
    if (inputUp) {
      if (!mirror) {
        // No mirror, straight path from top to bottom
        paths.push(
          <line
            key="up-straight"
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="red"
            strokeWidth={laserThickness}
          />
        );
      } else if (mirror === 'positive') {
        // Positive mirror (/) - redirect from top to left
        paths.push(
          <polyline
            key="up-positive"
            points="50 0 50 50 0 50"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      } else if (mirror === 'negative') {
        // Negative mirror (\) - redirect from top to right
        paths.push(
          <polyline
            key="up-negative"
            points="50 0 50 50 100 50"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      }
    }

    // Handle input from the bottom
    if (inputDown) {
      if (!mirror) {
        // No mirror, straight path from bottom to top
        paths.push(
          <line
            key="down-straight"
            x1="50%"
            y1="100%"
            x2="50%"
            y2="0"
            stroke="red"
            strokeWidth={laserThickness}
          />
        );
      } else if (mirror === 'positive') {
        // Positive mirror (/) - redirect from bottom to right
        paths.push(
          <polyline
            key="down-positive"
            points="50 100 50 50 100 50"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      } else if (mirror === 'negative') {
        // Negative mirror (\) - redirect from bottom to left
        paths.push(
          <polyline
            key="down-negative"
            points="50 100 50 50 0 50"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      }
    }

    // Handle input from the left
    if (inputLeft) {
      if (!mirror) {
        // No mirror, straight path from left to right
        paths.push(
          <line
            key="left-straight"
            x1="0"
            y1="50%"
            x2="100%"
            y2="50%"
            stroke="red"
            strokeWidth={laserThickness}
          />
        );
      } else if (mirror === 'positive') {
        // Positive mirror (/) - redirect from left to bottom
        paths.push(
          <polyline
            key="left-positive"
            points="0 50 50 50 50 0"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      } else if (mirror === 'negative') {
        // Negative mirror (\) - redirect from left to top
        paths.push(
          <polyline
            key="left-negative"
            points="0 50 50 50 50 100"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      }
    }

    // Handle input from the right
    if (inputRight) {
      if (!mirror) {
        // No mirror, straight path from right to left
        paths.push(
          <line
            key="right-straight"
            x1="100%"
            y1="50%"
            x2="0"
            y2="50%"
            stroke="red"
            strokeWidth={laserThickness}
          />
        );
      } else if (mirror === 'positive') {
        // Positive mirror (/) - redirect from right to top
        paths.push(
          <polyline
            key="right-positive"
            points="100 50 50 50 50 100"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      } else if (mirror === 'negative') {
        // Negative mirror (\) - redirect from right to bottom
        paths.push(
          <polyline
            key="right-negative"
            points="100 50 50 50 50 0"
            stroke="red"
            strokeWidth={laserThickness}
            fill="none"
          />
        );
      }
    }

    return paths;
  };

  return (
    <div
      className={`relative cursor-pointer border border-black`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onClick={() => clickCell(cell.row, cell.col)}
    >
      {/* SVG for the laser paths and mirrors */}
      <svg width={svgSize} height={svgSize} viewBox="0 0 100 100" className="absolute top-0 left-0">
        {/* Mirror line */}
        {mirror === 'positive' && (
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="red" strokeWidth={mirrorThickness} />
        )}
        {mirror === 'negative' && (
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="red" strokeWidth={mirrorThickness} />
        )}

        {/* Laser paths */}
        {renderLaserPaths()}
      </svg>

      {/* Dots outside the cell */}
      {edgeTop && (
        <div
          className={`-top-4 absolute w-2 h-2 ${edgeTop.enabled ? 'bg-green-400' : 'bg-black'} rounded-full left-1/2 -translate-x-1/2 `}
          onClick={e => {
            e.stopPropagation();
            clickEdge(cell.row, cell.col, 'top');
          }}
        />
      )}

      {edgeBottom && (
        <div
          className={`-bottom-4 absolute w-2 h-2 ${edgeBottom.enabled ? 'bg-green-400' : 'bg-black'} rounded-full left-1/2 -translate-x-1/2 `}
          onClick={e => {
            e.stopPropagation();
            clickEdge(cell.row, cell.col, 'bottom');
          }}
        />
      )}

      {edgeLeft && (
        <div
          className={`-left-4 absolute w-2 h-2 ${edgeLeft.enabled ? 'bg-green-400' : 'bg-black'} rounded-full top-1/2 -translate-y-1/2`}
          onClick={e => {
            e.stopPropagation();
            clickEdge(cell.row, cell.col, 'left');
          }}
        />
      )}

      {edgeRight && (
        <div
          className={`-right-4 absolute w-2 h-2 ${edgeRight.enabled ? 'bg-green-400' : 'bg-black'} rounded-full top-1/2 -translate-y-1/2 `}
          onClick={e => {
            e.stopPropagation();
            clickEdge(cell.row, cell.col, 'right');
          }}
        />
      )}

      {/* Numbers outside the cell */}
      {/* Top edge number */}
      {(edgeTop?.startingNumber || edgeTop?.currentNumber) && (
        <div className={`absolute pointer-events-none -top-10 left-1/2 -translate-x-1/2 text-sm`}>
          {(() => {
            // Case 1: Starting number only (black)
            if (edgeTop.startingNumber && !edgeTop.currentNumber) {
              return <p className="text-black">{edgeTop.startingNumber}</p>;
            }
            // Case 2: Current number only (blue)
            else if (!edgeTop.startingNumber && edgeTop.currentNumber) {
              return <p className="text-blue-500">{edgeTop.currentNumber}</p>;
            }
            // Case 3: Both numbers match (green)
            else if (
              edgeTop.startingNumber &&
              edgeTop.currentNumber &&
              edgeTop.startingNumber === edgeTop.currentNumber
            ) {
              return <p className="text-green-500">{edgeTop.currentNumber}</p>;
            }
            // Case 4: Both numbers don't match (red with strikethrough)
            else if (
              edgeTop.startingNumber &&
              edgeTop.currentNumber &&
              edgeTop.startingNumber !== edgeTop.currentNumber
            ) {
              return <p className="text-red-500 line-through">{edgeTop.currentNumber}</p>;
            }
            return null;
          })()}
        </div>
      )}

      {/* Bottom edge number */}
      {(edgeBottom?.startingNumber || edgeBottom?.currentNumber) && (
        <div
          className={`absolute pointer-events-none -bottom-10 left-1/2 -translate-x-1/2 text-sm`}
        >
          {(() => {
            // Case 1: Starting number only (black)
            if (edgeBottom.startingNumber && !edgeBottom.currentNumber) {
              return <p className="text-black">{edgeBottom.startingNumber}</p>;
            }
            // Case 2: Current number only (blue)
            else if (!edgeBottom.startingNumber && edgeBottom.currentNumber) {
              return <p className="text-blue-500">{edgeBottom.currentNumber}</p>;
            }
            // Case 3: Both numbers match (green)
            else if (
              edgeBottom.startingNumber &&
              edgeBottom.currentNumber &&
              edgeBottom.startingNumber === edgeBottom.currentNumber
            ) {
              return <p className="text-green-500">{edgeBottom.currentNumber}</p>;
            }
            // Case 4: Both numbers don't match (red with strikethrough)
            else if (
              edgeBottom.startingNumber &&
              edgeBottom.currentNumber &&
              edgeBottom.startingNumber !== edgeBottom.currentNumber
            ) {
              return <p className="text-red-500 line-through">{edgeBottom.currentNumber}</p>;
            }
            return null;
          })()}
        </div>
      )}

      {/* Left edge number */}
      {(edgeLeft?.startingNumber || edgeLeft?.currentNumber) && (
        <div
          className={`absolute pointer-events-none -left-13 top-1/2 -translate-y-1/2 text-sm w-8 text-right`}
        >
          {(() => {
            // Case 1: Starting number only (black)
            if (edgeLeft.startingNumber && !edgeLeft.currentNumber) {
              return <p className="text-black">{edgeLeft.startingNumber}</p>;
            }
            // Case 2: Current number only (blue)
            else if (!edgeLeft.startingNumber && edgeLeft.currentNumber) {
              return <p className="text-blue-500">{edgeLeft.currentNumber}</p>;
            }
            // Case 3: Both numbers match (green)
            else if (
              edgeLeft.startingNumber &&
              edgeLeft.currentNumber &&
              edgeLeft.startingNumber === edgeLeft.currentNumber
            ) {
              return <p className="text-green-500">{edgeLeft.currentNumber}</p>;
            }
            // Case 4: Both numbers don't match (red with strikethrough)
            else if (
              edgeLeft.startingNumber &&
              edgeLeft.currentNumber &&
              edgeLeft.startingNumber !== edgeLeft.currentNumber
            ) {
              return <p className="text-red-500 line-through">{edgeLeft.currentNumber}</p>;
            }
            return null;
          })()}
        </div>
      )}

      {/* Right edge number */}
      {(edgeRight?.startingNumber || edgeRight?.currentNumber) && (
        <div
          className={`absolute pointer-events-none -right-13 top-1/2 -translate-y-1/2 text-sm w-8 text-left`}
        >
          {(() => {
            // Case 1: Starting number only (black)
            if (edgeRight.startingNumber && !edgeRight.currentNumber) {
              return <p className="text-black">{edgeRight.startingNumber}</p>;
            }
            // Case 2: Current number only (blue)
            else if (!edgeRight.startingNumber && edgeRight.currentNumber) {
              return <p className="text-blue-500">{edgeRight.currentNumber}</p>;
            }
            // Case 3: Both numbers match (green)
            else if (
              edgeRight.startingNumber &&
              edgeRight.currentNumber &&
              edgeRight.startingNumber === edgeRight.currentNumber
            ) {
              return <p className="text-green-500">{edgeRight.currentNumber}</p>;
            }
            // Case 4: Both numbers don't match (red with strikethrough)
            else if (
              edgeRight.startingNumber &&
              edgeRight.currentNumber &&
              edgeRight.startingNumber !== edgeRight.currentNumber
            ) {
              return <p className="text-red-500 line-through">{edgeRight.currentNumber}</p>;
            }
            return null;
          })()}
        </div>
      )}
    </div>
  );
};

export default Cell;
