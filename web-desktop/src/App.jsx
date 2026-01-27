import React, { useState } from 'react';
import { projects } from './data/projects.js';
import Window from './components/Window';
import './App.css';

function App() {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextZ, setNextZ] = useState(100);
  
  // Track positions for each icon
  const [iconPositions, setIconPositions] = useState(
    projects.reduce((acc, p, i) => ({
      ...acc, 
      [p.id]: { x: 30, y: 30 + (i * 120) } 
    }), {})
  );

  const [draggingIcon, setDraggingIcon] = useState(null);

  const startDrag = (id, e) => {
    setDraggingIcon({
      id,
      offsetX: e.clientX - iconPositions[id].x,
      offsetY: e.clientY - iconPositions[id].y
    });
  };

  const onDrag = (e) => {
    if (!draggingIcon) return;
    setIconPositions({
      ...iconPositions,
      [draggingIcon.id]: {
        x: e.clientX - draggingIcon.offsetX,
        y: e.clientY - draggingIcon.offsetY
      }
    });
  };

  const stopDrag = () => setDraggingIcon(null);

  // Existing window handlers
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
    <div className="desktop" onMouseMove={onDrag} onMouseUp={stopDrag}>
      {projects.map(p => (
        <div 
          key={p.id} 
          className="icon" 
          style={{ 
            position: 'absolute', 
            left: iconPositions[p.id].x, 
            top: iconPositions[p.id].y 
          }}
          onMouseDown={(e) => startDrag(p.id, e)}
          onDoubleClick={() => openWindow(p)} // Changed to dblclick to separate from drag
        >
          <img src={p.icon} alt={p.name} draggable="false" />
          <span>{p.name}</span>
        </div>
      ))}

      {openWindows.map(win => (
        <Window 
          key={win.id} 
          window={win} 
          onClose={() => closeWindow(win.id)} 
          onFocus={() => handleFocus(win.id)} 
        />
      ))}

      <div className="taskbar">
        <div className="start-btn">R</div>
        <div className="taskbar-apps">
          {openWindows.map(win => (
            <div 
              key={win.id} 
              className="task-item" 
              onClick={() => handleFocus(win.id)}
            >
              {win.name}
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
}

export default App;