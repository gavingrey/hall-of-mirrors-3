import { useEffect, useRef } from 'react';
import Grid from './Grid';
import { useGridStore } from './state/gridStore';

function App() {
  const { refreshGrid, toggleInstructions, showInstructions } = useGridStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Add effect to calculate and set scale based on viewport size
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // Calculate scale factors for width and height
      // Add a larger margin to ensure it doesn't touch the edges (30px on each side)
      const scaleX = (window.innerWidth - 60) / containerWidth;
      const scaleY = (window.innerHeight - 60) / containerHeight;

      // Use the smaller scale to ensure everything fits
      const scale = Math.min(scaleX, scaleY);

      // Apply the scale using CSS custom property
      document.documentElement.style.setProperty('--scale', scale.toString());
    };

    // Initial calculation
    // Use setTimeout to ensure the container has rendered with its natural size
    setTimeout(updateScale, 100); // Longer delay to ensure rendering

    // Also update when the component mounts
    updateScale();

    // Update on resize
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden">
      <div
        ref={containerRef}
        className="transform-gpu origin-center flex flex-col items-center"
        style={{ transform: 'scale(var(--scale, 1))', transformOrigin: 'center' }}
      >
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold whitespace-nowrap">Jane Street Puzzle March 2025</h1>
        </div>
        <div className="flex items-center justify-between" style={{ width: '640px' }}>
          <button
            onClick={toggleInstructions}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Instructions
          </button>
          <button
            onClick={refreshGrid}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Reset
          </button>
        </div>
        <div className="mt-5">
          <Grid />
        </div>
      </div>

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-2xl w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Hall of Mirrors 3</h2>
              <button onClick={toggleInstructions} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="prose text-sm">
              <p className="font-bold">Puzzle Link (Start Here!!!):</p>
              <a
                href="https://www.janestreet.com/puzzles/current-puzzle/"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                https://www.janestreet.com/puzzles/current-puzzle/
              </a>
              <h3 className="font-bold">Original Instructions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  The perimeter of a 10-by-10 square field is surrounded by lasers pointing into the
                  field. (Each laser begins half a unit from the edge of the field, as indicated by
                  the •’s.)
                </li>
                <li>
                  Some of the lasers have numbers beside them. Place diagonal mirrors in some of the
                  cells so that the product of the segment lengths of a laser’s path matches the
                  clue numbers. (For instance, the segments for the “75” path in the example puzzle
                  have lengths 5, 3, 5.) Mirrors may not be placed in orthogonally adjacent cells.
                </li>
                <li>
                  Once finished, determine the missing clue numbers for the perimeter, and calculate
                  the sum of these clues for each side of the square. The answer to this puzzle is
                  the product of these four sums.
                </li>
              </ul>
              <h3 className="font-bold">How to Play:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Click on a cell to place a mirror. Click again to change its orientation, and a
                  third time to remove it.
                </li>
                <li>Click on the edges to enable or disable light beams.</li>
                <li>A green circle indicates that a light beam is enabled.</li>
                <li>
                  Scores for each path are given in blue. If there was a starting number and it
                  matches, the score is green. Otherwise, it is red and crossed out.
                </li>
              </ul>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={toggleInstructions}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
