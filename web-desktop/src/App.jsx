import React, { useState } from 'react';
import { projects } from './data/projects.js';
import Window from './components/Window';
import './App.css';

function App() {
  /*----------------------------------[variables]-----------------------------------*/

  const [openWindows, setOpenWindows] = useState([]);
  const [nextZ, setNextZ] = useState(100);
  const [menuPos, setMenuPos] = useState(null);
  const [draggingIcon, setDraggingIcon] = useState(null);
  const [draggingWin, setDraggingWin] = useState(null); 

  const [iconPositions, setIconPositions] = useState(
    projects.reduce((acc, p, i) => ({
      ...acc, 
      [p.id]: { x: 30, y: 30 + (i * 120) } 
    }), {})
  );

/*----------------------------------[draggin logic]-----------------------------------*/
  const startDrag = (id, e) => {
    setDraggingIcon({
      id,
      offsetX: e.clientX - iconPositions[id].x,
      offsetY: e.clientY - iconPositions[id].y
    });
  };

/*----------------------------------[icond and window movement]-----------------------------------*/
  const handleGlobalMouseMove = (e) => {
    if (draggingIcon) {
      setIconPositions({
        ...iconPositions,
        [draggingIcon.id]: {
          x: e.clientX - draggingIcon.offsetX,
          y: e.clientY - draggingIcon.offsetY
        }
      });
    }
  };

  const stopDragging = () => {
    setDraggingIcon(null);
    setDraggingWin(null);
  };

/*----------------------------------[windows]-----------------------------------*/
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

/*----------------------------------[menu]-----------------------------------*/
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const createNewPage = () => {
    const id = `new-page-${Date.now()}`;
    const newProject = {
      id,
      name: "New Page",
      icon: "https://www.svgrepo.com/show/532195/apc-indicator.svg", 
      url: "/os/new-page-template.html", 
      launch: { width: "400px", height: "300px" }
    };
    setIconPositions({ ...iconPositions, [id]: { x: menuPos.x, y: menuPos.y } });
    projects.push(newProject); 
    setMenuPos(null);
  };

  return (
    <div 
      className="desktop" 
      onContextMenu={handleContextMenu} 
      onClick={() => setMenuPos(null)} 
      onMouseMove={handleGlobalMouseMove} 
      onMouseUp={stopDragging} 
    >
      {projects.map(p => (
        <div 
          key={p.id} 
          className="icon" 
          style={{ 
            position: 'absolute', 
            left: iconPositions[p.id]?.x || 0, 
            top: iconPositions[p.id]?.y || 0 
          }}
          onMouseDown={(e) => startDrag(p.id, e)}
          onDoubleClick={() => openWindow(p)}
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
            <div key={win.id} className="task-item" onClick={() => handleFocus(win.id)}>
              {win.name}
            </div>
          ))}
        </div>
      </div>

      {menuPos && (
        <div className="context-menu" style={{ top: menuPos.y, left: menuPos.x }}>
          <div className="menu-item" onClick={createNewPage}>Create New Page</div>
          <div className="menu-item" onClick={() => window.location.reload()}>Refresh Desktop</div>
        </div>
      )}
    </div>
  );
}

export default App;