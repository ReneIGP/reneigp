import React, { useState } from 'react';
import { projects } from './data/projects.js';
import './App.css';

function App() {
  const [openWindows, setOpenWindows] = useState([]);

  const openWindow = (project) => {
    if (!openWindows.find(w => w.id === project.id)) {
      setOpenWindows([...openWindows, project]);
    }
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
  };

  return (
    <div className="desktop">
      {/* 1. Desktop Icons */}
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
        <div key={win.id} className="window-frame" style={{ width: win.launch.width, height: win.launch.height }}>
          <div className="title-bar">
            <span>{win.name}</span>
            <button className="close-btn" onClick={() => closeWindow(win.id)}>X</button>
          </div>
          <div className="window-content">
            <iframe src={win.url} title={win.name} frameBorder="0" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
