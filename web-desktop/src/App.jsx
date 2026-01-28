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
  const [selectionBox, setSelectionBox] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  /*----------------------------------[Initialize icon positions]-----------------------------------*/
  const [iconPositions, setIconPositions] = useState(
    projects.reduce((acc, p, i) => ({
      ...acc, 
      [p.id]: { x: 30, y: 30 + (i * 120) } 
    }), {})
  );

  /*----------------------------------[Selection Logic]-----------------------------------*/
  const startSelection = (e) => {
    // Only start selection if clicking the desktop background itself
    if (e.target.className === 'desktop') {
      setSelectedIds([]); 
      setSelectionBox({ 
        startX: e.clientX, 
        startY: e.clientY, 
        currentX: e.clientX, 
        currentY: e.clientY 
      });
    }
  };

  /*----------------------------------[Drag & Drop Logic]-----------------------------------*/
  const startIconDrag = (id, e) => {
    e.stopPropagation();
    // If we click an unselected icon, clear previous selection and select this one
    if (!selectedIds.includes(id)) {
      setSelectedIds([id]);
    }

    setDraggingIcon({
      id,
      lastX: e.clientX,
      lastY: e.clientY
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
    // 1. Handle Selection Box Drawing
    if (selectionBox) {
      const currentBox = { ...selectionBox, currentX: e.clientX, currentY: e.clientY };
      setSelectionBox(currentBox);
      
      const left = Math.min(currentBox.startX, currentBox.currentX);
      const top = Math.min(currentBox.startY, currentBox.currentY);
      const right = Math.max(currentBox.startX, currentBox.currentX);
      const bottom = Math.max(currentBox.startY, currentBox.currentY);

      const overlapping = items.filter(item => {
        const pos = iconPositions[item.id];
        if (!pos || item.parentId) return false;
        // Icon hitbox: 100x120
        return (pos.x < right && pos.x + 100 > left && pos.y < bottom && pos.y + 120 > top);
      }).map(item => item.id);

      setSelectedIds(overlapping);
    }

    // 2. Handle Icon(s) Dragging
    if (draggingIcon) {
      const dx = e.clientX - draggingIcon.lastX;
      const dy = e.clientY - draggingIcon.lastY;

      const newPositions = { ...iconPositions };
      selectedIds.forEach(id => {
        newPositions[id] = { 
          x: (newPositions[id]?.x || 0) + dx, 
          y: (newPositions[id]?.y || 0) + dy 
        };
      });

      setIconPositions(newPositions);
      setDraggingIcon({ ...draggingIcon, lastX: e.clientX, lastY: e.clientY });
    }

    // 3. Handle Window Dragging
    if (draggingWin) {
      setOpenWindows(openWindows.map(w => 
        w.id === draggingWin.id 
          ? { ...w, x: e.clientX - draggingWin.offsetX, y: e.clientY - draggingWin.offsetY } 
          : w
      ));
    }
  };

  const stopDragging = (e) => {
    setSelectionBox(null);

    if (draggingIcon && !selectionBox) {
      const dropX = e.clientX;
      const dropY = e.clientY;

      const targetFolder = items.find(item => {
        if (item.type !== 'folder' || selectedIds.includes(item.id)) return false;
        const pos = iconPositions[item.id];
        return (dropX >= pos.x && dropX <= pos.x + 100 && dropY >= pos.y && dropY <= pos.y + 120);
      });

      if (targetFolder) {
        setItems(prevItems => prevItems.map(item => {
          if (item.id === targetFolder.id) {
            return { ...item, children: [...(item.children || []), ...selectedIds] };
          }
          if (selectedIds.includes(item.id)) {
            return { ...item, parentId: targetFolder.id };
          }
          return item;
        }));
        setSelectedIds([]);
      }
    }
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
    setOpenWindows(openWindows.map(w => w.id === id ? { ...w, zIndex: nextZ } : w));
    setNextZ(nextZ + 1);
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  /*----------------------------------[HTML]-----------------------------------*/
  return (
    <div 
      className="desktop" 
      onContextMenu={handleContextMenu} 
      onMouseDown={startSelection}
      onMouseMove={handleGlobalMouseMove} 
      onMouseUp={stopDragging}
    >
      {/* selection marquee */}
      {selectionBox && (
        <div className="selection-marquee" style={{
          left: Math.min(selectionBox.startX, selectionBox.currentX),
          top: Math.min(selectionBox.startY, selectionBox.currentY),
          width: Math.abs(selectionBox.currentX - selectionBox.startX),
          height: Math.abs(selectionBox.currentY - selectionBox.startY)
        }} />
      )}

      {/* only select items on desktop*/}
      {items.filter(p => !p.parentId).map(p => (
        <div 
          key={p.id} 
          className={`icon ${selectedIds.includes(p.id) ? 'selected' : ''}`}
          style={{ 
            position: 'absolute', 
            left: iconPositions[p.id]?.x || 0, 
            top: iconPositions[p.id]?.y || 0 
          }}
          onMouseDown={(e) => startIconDrag(p.id, e)}
          onDoubleClick={() => openWindow(p)}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={p.icon} alt={p.name} draggable="false" />
          <span>{p.name}</span>
        </div>
      ))}

      {/* Windows */}
      {openWindows.map(win => (
        <Window 
          key={win.id} 
          window={win} 
          allItems={items}
          onOpenItem={(item) => openWindow(item)}
          isDragging={draggingWin?.id === win.id}
          onClose={() => closeWindow(win.id)} 
          onFocus={() => handleFocus(win.id)} 
          onDragStart={(e) => startWinDrag(win.id, e)}
        />
      ))}

      {/* Taskbar */}
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

      {/* Context Menu */}
      {menuPos && (
        <div className="context-menu" style={{ top: menuPos.y, left: menuPos.x }} onClick={(e) => e.stopPropagation()}>
          <div className="menu-item" onClick={createNewPage}>New Page</div>
          <div className="menu-item" onClick={createNewFolder}>New Folder</div>
          <div className="menu-item" onClick={() => window.location.reload()}>Refresh Desktop</div>
        </div>
      )}
    </div>
  );
}

export default App;