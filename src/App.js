import React from 'react';
import './App.css';
import LeafletMap from './LeafletMap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Quito Metro Stations 15-Minute Walk Isochrones</h1>
      </header>
      <LeafletMap />
    </div>
  );
}

export default App;
