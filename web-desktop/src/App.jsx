import React, { useState } from 'react';
import { DESKTOP_DATA } from './data/projects';
import Icon from './components/Icon';
import Window from './components/Window';
import './App.css';

export default function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [zCounter, setZCounter] = useState(10);

  const openWindow = (project) => {
    // Check if already open
    if (openWindows.find(w => w.id === project.id)) {
      focusWindow(project.id);
      return;
    }
    const nextZ = zCounter + 1;
    setZCounter(nextZ);
    setOpenWindows([...openWindows, { ...project, zIndex: nextZ }]);
  };

  const focusWindow = (id) => {
    const nextZ = zCounter + 1;
    setZCounter(nextZ);
    setOpenWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZ } : w
    ));
  };

  const closeWindow = (id) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="desktop">
      <div className="icon-grid">
        {DESKTOP_DATA.projects.map(p => (
          <Icon key={p.id} project={p} onOpen={() => openWindow(p)} />
        ))}
      </div>

      <div className="windows-layer">
        {openWindows.map(win => (
          <Window 
            key={win.id} 
            window={win} 
            onClose={() => closeWindow(win.id)} 
            onFocus={() => focusWindow(win.id)}
          />
        ))}
      </div>
      
      <div className="taskbar">Start</div>
    </div>
  );
}