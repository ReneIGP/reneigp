import React, { useState } from 'react';
import { projects } from './data/projects.js';
import Window from './components/Window';
import './App.css';

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextZ, setNextZ] = useState(100);

  const openWindow = (project) => {
    const existing = openWindows.find(w => w.id === project.id);
    if (!existing) {
      setOpenWindows([...openWindows, { ...project, zIndex: nextZ }]);
      setNextZ(nextZ + 1);
    } else {
      handleFocus(project.id);
    }
  };

  const handleFocus = (id) => {
    setOpenWindows(openWindows.map(w => 
      w.id === id ? { ...w, zIndex: nextZ } : w
    ));
    setNextZ(nextZ + 1);
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
  };

  return (
    <div className="desktop">
      {/* 1. Desktop Icon Grid */}
      <div className="icon-grid">
        {projects.map(p => (
          <div key={p.id} className="icon" onClick={() => openWindow(p)}>
            <img src={p.icon} alt={p.name} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      {/* 2. Floating Windows */}
      {openWindows.map(win => (
        <Window 
          key={win.id} 
          window={win} 
          onClose={() => closeWindow(win.id)} 
          onFocus={() => handleFocus(win.id)} 
        />
      ))}
    </div>
  );
}

export default App;