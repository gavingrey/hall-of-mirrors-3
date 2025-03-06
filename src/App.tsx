import React from 'react';
import Grid from './Grid';

function App() {
  return (
    <div className="flex flex-col items-center p-5">
      <h1>Laser Grid Puzzle</h1>
      <div className="mt-5">
        <Grid />
      </div>
    </div>
  );
}

export default App;
