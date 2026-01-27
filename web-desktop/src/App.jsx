import React, { useState } from 'react';
import { projects } from './data/projects.js';
import Window from './components/Window';
import './App.css';

function App() {
  /*----------------------------------[State Management]-----------------------------------*/
  const [openWindows, setOpenWindows] = useState([]);
  const [nextZ, setNextZ] = useState(100);
  const [menuPos, setMenuPos] = useState(null);
  const [draggingIcon, setDraggingIcon] = useState(null);
  const [draggingWin, setDraggingWin] = useState(null);
  const [items, setItems] = useState([...projects]);

  /*----------------------------------[Initialize icon positions]-----------------------------------*/
  const [iconPositions, setIconPositions] = useState(
    projects.reduce((acc, p, i) => ({
      ...acc, 
      [p.id]: { x: 30, y: 30 + (i * 120) } 
    }), {})
  );

  /*----------------------------------[Drag & Drop Logic]-----------------------------------*/
  const startIconDrag = (id, e) => {
    setDraggingIcon({
      id,
      offsetX: e.clientX - iconPositions[id].x,
      offsetY: e.clientY - iconPositions[id].y
    });
  };

  const startWinDrag = (id, e) => {
    const win = openWindows.find(w => w.id === id);
    setDraggingWin({
      id,
      offsetX: e.clientX - (win.x || 100),
      offsetY: e.clientY - (win.y || 100)
    });
    handleFocus(id);
  };

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

    if (draggingWin) {
      setOpenWindows(openWindows.map(w => 
        w.id === draggingWin.id 
          ? { ...w, x: e.clientX - draggingWin.offsetX, y: e.clientY - draggingWin.offsetY } 
          : w
      ));
    }
  };

  const stopDragging = () => {
    setDraggingIcon(null);
    setDraggingWin(null);
  };
  
  /*----------------------------------[Window Handlers]-----------------------------------*/
  const createNewPage = () => {
    const id = `new-page-${Date.now()}`;
    const newItem = {
      id,
      name: "New Page",
      type: "page",
      icon: "https://www.svgrepo.com/show/532195/app-indicator.svg", 
      url: "/os/new-page-template.html", 
      launch: { width: "400px", height: "300px" }
    };
    
    setIconPositions(prev => ({ ...prev, [id]: { x: menuPos.x, y: menuPos.y } }));
    setItems(prev => [...prev, newItem]);
    setMenuPos(null);
  };

  const createNewFolder = () => {
    const id = `folder-${Date.now()}`;
    const newItem = {
      id,
      name: "New Folder",
      type: "folder",
      icon: "https://www.svgrepo.com/show/532276/folder.svg",
      children: [],
      launch: { width: "400px", height: "300px" }
    };
    
    setIconPositions(prev => ({ ...prev, [id]: { x: menuPos.x, y: menuPos.y } }));
    setItems(prev => [...prev, newItem]);
    setMenuPos(null);
  };

  const openWindow = (project) => {
    const existing = openWindows.find(w => w.id === project.id);
    if (!existing) {
      setOpenWindows([...openWindows, { ...project, zIndex: nextZ, x: 100, y: 100 }]);
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

  /*----------------------------------[Context Menu]-----------------------------------*/
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="desktop" 
      onContextMenu={handleContextMenu} 
      onClick={() => setMenuPos(null)} 
      onMouseMove={handleGlobalMouseMove} 
      onMouseUp={stopDragging}
    >
      {/* 1. Icons */}
      {items.map(p => (
        <div 
          key={p.id} 
          className="icon" 
          style={{ 
            position: 'absolute', 
            left: iconPositions[p.id]?.x || 0, 
            top: iconPositions[p.id]?.y || 0 
          }}
          onMouseDown={(e) => startIconDrag(p.id, e)}
          onDoubleClick={() => openWindow(p)}
        >
          <img src={p.icon} alt={p.name} draggable="false" />
          <span>{p.name}</span>
        </div>
      ))}

      {/* 2. Windows */}
      {openWindows.map(win => (
        <Window 
          key={win.id} 
          window={win} 
          isDragging={draggingWin?.id === win.id}
          onClose={() => closeWindow(win.id)} 
          onFocus={() => handleFocus(win.id)} 
          onDragStart={(e) => startWinDrag(win.id, e)}
        />
      ))}

      {/* 3. Taskbar */}
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

      {/* 4. Context Menu */}
      {menuPos && (
      <div className="context-menu" style={{ top: menuPos.y, left: menuPos.x }}>
        <div className="menu-item" onClick={createNewPage}>New Page</div>
        <div className="menu-item" onClick={createNewFolder}>New Folder</div>
        <div className="menu-item" onClick={() => window.location.reload()}>Refresh Desktop</div>
      </div>
    )}
    </div>
  );
}

export default App;