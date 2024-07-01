import React from 'react';
import './App.css';
import LeafletMap from './LeafletMap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Áreas de Caminata desde/hacia las Estaciones del Metro de Quito</h1>
      </header>
      <LeafletMap />
    </div>
  );
}

export default App;
