import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { projects } from './data/projects.js';
import Window from './components/Window';
import './App.css';

/*----------------------------------[Constants & helpers]-----------------------------------*/
const ICON_W = 100;
const ICON_H = 120;
const DRAG_THRESHOLD = 4; // px the mouse must travel before a press counts as a drag

const initialPositions = (items) =>
  items
    .filter(item => !item.parentId)
    .reduce((acc, item, i) => ({ ...acc, [item.id]: { x: 30, y: 30 + i * ICON_H } }), {});

// True if `id` is `ancestorId` itself or sits somewhere inside it
const isInside = (items, id, ancestorId) => {
  let current = items.find(i => i.id === id);
  while (current) {
    if (current.id === ancestorId) return true;
    const parentId = current.parentId;
    current = parentId ? items.find(i => i.id === parentId) : undefined;
  }
  return false;
};

export default function Desktop() {
  /*----------------------------------[State Management]-----------------------------------*/
  const [items, setItems] = useState(projects);
  const [iconPositions, setIconPositions] = useState(() => initialPositions(projects));
  const [openWindows, setOpenWindows] = useState([]); // { id, zIndex, x, y } — the item is looked up by id
  const [selectedIds, setSelectedIds] = useState([]);
  const [menu, setMenu] = useState(null);             // { x, y } of the context menu
  // The mouse interaction in progress, one of:
  //   { kind: 'select',     startX, startY, currentX, currentY }
  //   { kind: 'icons',      id, ids, origins, startX, startY, moved }   desktop icons
  //   { kind: 'folderItem', ids, startX, startY, x, y, moved }          an icon inside a folder window
  //   { kind: 'window',     id, offsetX, offsetY }
  const [interaction, setInteraction] = useState(null);
  const nextZ = useRef(100);
  const menuRef = useRef(null);

  /*----------------------------------[Window Handlers]-----------------------------------*/
  const focusWindow = (id) => {
    const z = nextZ.current++;
    setOpenWindows(prev => prev.map(w => (w.id === id ? { ...w, zIndex: z } : w)));
  };

  const openWindow = (item) => {
    if (item.type === 'link') {
      window.open(item.url, '_blank', 'noopener');
      return;
    }
    const z = nextZ.current++;
    setOpenWindows(prev => {
      if (prev.some(w => w.id === item.id)) {
        return prev.map(w => (w.id === item.id ? { ...w, zIndex: z } : w));
      }
      const offset = (prev.length % 8) * 30; // cascade new windows so they don't stack exactly
      return [...prev, { id: item.id, zIndex: z, x: 100 + offset, y: 100 + offset }];
    });
  };

  const closeWindow = (id) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
  };

  /*----------------------------------[Mouse Down: start an interaction]-----------------------------------*/
  const startSelection = (e) => {
    // Only start selection when pressing the desktop background itself
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    setSelectedIds([]);
    setInteraction({ kind: 'select', startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY });
  };

  const startIconDrag = (id, e) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    // Pressing an unselected icon replaces the selection; pressing a selected one drags the whole group
    const ids = selectedIds.includes(id) ? selectedIds : [id];
    if (!selectedIds.includes(id)) setSelectedIds(ids);
    const origins = Object.fromEntries(ids.map(i => [i, iconPositions[i] || { x: 0, y: 0 }]));
    setInteraction({ kind: 'icons', id, ids, origins, startX: e.clientX, startY: e.clientY, moved: false });
  };

  const startFolderItemDrag = (id, e) => {
    if (e.button !== 0) return;
    setInteraction({ kind: 'folderItem', ids: [id], startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY, moved: false });
  };

  const startWindowDrag = (id, e) => {
    if (e.button !== 0) return;
    const win = openWindows.find(w => w.id === id);
    setInteraction({ kind: 'window', id, offsetX: e.clientX - win.x, offsetY: e.clientY - win.y });
  };

  /*----------------------------------[Drop Logic]-----------------------------------*/
  // What the cursor is over when dragged icons are let go:
  // { folderId } for a folder icon or folder window, { folderId: null } for the desktop, or null for nothing usable
  const findDropTarget = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el || el.closest('.taskbar')) return null;

    const iconEl = el.closest('[data-item-id]');
    const iconItem = iconEl && items.find(i => i.id === iconEl.dataset.itemId);
    if (iconItem?.type === 'folder') return { folderId: iconItem.id };

    const winEl = el.closest('[data-window-id]');
    if (winEl) {
      const winItem = items.find(i => i.id === winEl.dataset.windowId);
      return winItem?.type === 'folder' ? { folderId: winItem.id } : null;
    }
    return el.closest('.desktop') ? { folderId: null } : null;
  };

  const dropItems = (ids, x, y, fromFolder) => {
    const target = findDropTarget(x, y);
    if (!target) return;
    const { folderId } = target;

    if (folderId) {
      // A folder can't go inside itself or anything it contains
      if (ids.some(id => isInside(items, folderId, id))) return;
      setItems(prev => prev.map(i => (ids.includes(i.id) ? { ...i, parentId: folderId } : i)));
      setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
    } else if (fromFolder) {
      // Dragged out of a folder window onto the desktop
      setItems(prev => prev.map(i => (ids.includes(i.id) ? { ...i, parentId: undefined } : i)));
      setIconPositions(prev => ({
        ...prev,
        ...Object.fromEntries(ids.map(id => [id, { x: x - ICON_W / 2, y: y - 30 }])),
      }));
    }
    // Desktop icons dropped on the desktop already sit where they were dragged to
  };

  /*----------------------------------[Global mouse listeners while interacting]-----------------------------------*/
  // Listening on `window` keeps drags working when the cursor leaves the desktop or crosses a window
  useEffect(() => {
    if (!interaction) return;

    const hasMoved = (e) =>
      interaction.moved || Math.hypot(e.clientX - interaction.startX, e.clientY - interaction.startY) > DRAG_THRESHOLD;

    const handleMove = (e) => {
      switch (interaction.kind) {
        case 'select': {
          setInteraction({ ...interaction, currentX: e.clientX, currentY: e.clientY });
          const left = Math.min(interaction.startX, e.clientX);
          const top = Math.min(interaction.startY, e.clientY);
          const right = Math.max(interaction.startX, e.clientX);
          const bottom = Math.max(interaction.startY, e.clientY);
          setSelectedIds(items.filter(item => {
            const pos = iconPositions[item.id];
            if (!pos || item.parentId) return false;
            return pos.x < right && pos.x + ICON_W > left && pos.y < bottom && pos.y + ICON_H > top;
          }).map(item => item.id));
          break;
        }
        case 'icons': {
          if (!hasMoved(e)) return;
          // Positions are always origin + total offset, so a missed or repeated event can't make icons drift
          const dx = e.clientX - interaction.startX;
          const dy = e.clientY - interaction.startY;
          setIconPositions(prev => ({
            ...prev,
            ...Object.fromEntries(Object.entries(interaction.origins).map(([id, p]) => [id, { x: p.x + dx, y: p.y + dy }])),
          }));
          if (!interaction.moved) setInteraction({ ...interaction, moved: true });
          break;
        }
        case 'folderItem':
          setInteraction({ ...interaction, x: e.clientX, y: e.clientY, moved: hasMoved(e) });
          break;
        case 'window':
          setOpenWindows(prev => prev.map(w =>
            w.id === interaction.id
              ? { ...w, x: e.clientX - interaction.offsetX, y: Math.max(0, e.clientY - interaction.offsetY) }
              : w
          ));
          break;
      }
    };

    const handleUp = (e) => {
      setInteraction(null);
      if (interaction.kind !== 'icons' && interaction.kind !== 'folderItem') return;

      if (hasMoved(e)) {
        dropItems(interaction.ids, e.clientX, e.clientY, interaction.kind === 'folderItem');
      } else if (interaction.kind === 'icons') {
        // A plain click on one icon of a group selects just that icon
        setSelectedIds([interaction.id]);
      }
    };

    const cancel = () => setInteraction(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('blur', cancel);
    };
  });

  /*----------------------------------[Context Menu]-----------------------------------*/
  const handleContextMenu = (e) => {
    // Windows keep the browser's own menu
    if (e.target.closest('[data-window-id]')) return;
    e.preventDefault();
    const iconEl = e.target.closest('[data-item-id]');
    if (iconEl && !selectedIds.includes(iconEl.dataset.itemId)) {
      setSelectedIds([iconEl.dataset.itemId]);
    }
    setMenu({ x: e.clientX, y: e.clientY });
  };

  // Close the menu on any press outside it, on Escape, or when focus moves into an iframe
  useEffect(() => {
    if (!menu) return;
    const closeOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenu(null);
    };
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setMenu(null);
    };
    const close = () => setMenu(null);
    // Capture phase, so presses on icons/windows (which stop propagation) still close it
    window.addEventListener('mousedown', closeOutside, true);
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('blur', close);
    return () => {
      window.removeEventListener('mousedown', closeOutside, true);
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('blur', close);
    };
  }, [menu]);

  // Keep the menu fully on screen when opened near the right or bottom edge
  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!menu || !el) return;
    const { width, height } = el.getBoundingClientRect();
    el.style.left = `${Math.max(0, Math.min(menu.x, window.innerWidth - width - 4))}px`;
    el.style.top = `${Math.max(0, Math.min(menu.y, window.innerHeight - height - 4))}px`;
  }, [menu, selectedIds]);

  /*----------------------------------[Menu Actions]-----------------------------------*/
  const createItem = (newItem) => {
    setIconPositions(prev => ({ ...prev, [newItem.id]: { x: menu.x, y: menu.y } }));
    setItems(prev => [...prev, newItem]);
    setMenu(null);
  };

  const createNewPage = () => createItem({
    id: `new-page-${Date.now()}`,
    name: "New Page",
    type: "page",
    icon: "https://www.svgrepo.com/show/532195/app-indicator.svg",
    url: "/os/new-page-template.html",
    launch: { width: "400px", height: "300px" }
  });

  const createNewFolder = () => createItem({
    id: `folder-${Date.now()}`,
    name: "New Folder",
    type: "folder",
    icon: "https://www.svgrepo.com/show/532276/folder.svg",
    launch: { width: "400px", height: "300px" }
  });

  const deleteSelected = () => {
    const deleted = new Set(selectedIds);
    // Contents of a deleted folder move back onto the desktop instead of vanishing with it
    const rescued = items.filter(i => deleted.has(i.parentId) && !deleted.has(i.id));

    setItems(prev => prev
      .filter(i => !deleted.has(i.id))
      .map(i => (deleted.has(i.parentId) ? { ...i, parentId: undefined } : i)));
    setIconPositions(prev => {
      const next = { ...prev };
      rescued.forEach((item, n) => {
        const folderPos = prev[item.parentId] || { x: 30, y: 30 };
        next[item.id] = { x: folderPos.x + n * 20, y: folderPos.y + n * 20 };
      });
      deleted.forEach(id => delete next[id]);
      return next;
    });
    setOpenWindows(prev => prev.filter(w => !deleted.has(w.id)));
    setSelectedIds([]);
    setMenu(null);
  };

  const renameItem = () => {
    const idToRename = selectedIds[0];
    const item = items.find(i => i.id === idToRename);

    if (item) {
      const newName = prompt("Enter new name:", item.name);
      if (newName && newName.trim() !== "") {
        setItems(prev => prev.map(i => (i.id === idToRename ? { ...i, name: newName.trim() } : i)));
      }
    }
    setMenu(null);
  };

  /*----------------------------------[HTML]-----------------------------------*/
  const draggedIds = interaction?.kind === 'icons' && interaction.moved ? interaction.ids : [];
  const ghost = interaction?.kind === 'folderItem' && interaction.moved
    ? items.find(i => i.id === interaction.ids[0])
    : null;

  return (
    <div
      className="desktop"
      onContextMenu={handleContextMenu}
      onMouseDown={startSelection}
    >
      {/* selection marquee */}
      {interaction?.kind === 'select' && (
        <div className="selection-marquee" style={{
          left: Math.min(interaction.startX, interaction.currentX),
          top: Math.min(interaction.startY, interaction.currentY),
          width: Math.abs(interaction.currentX - interaction.startX),
          height: Math.abs(interaction.currentY - interaction.startY)
        }} />
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <Link to="/" className="start-btn" title="Back to portfolio">R</Link>
        <div className="taskbar-apps">
          {openWindows.map(win => (
            <div key={win.id} className="task-item" onClick={() => focusWindow(win.id)}>
              {items.find(i => i.id === win.id)?.name}
            </div>
          ))}
        </div>
      </div>

      {/* only items on the desktop, folder contents render inside their window */}
      {items.filter(p => !p.parentId).map(p => (
        <div
          key={p.id}
          data-item-id={p.id}
          className={`icon ${selectedIds.includes(p.id) ? 'selected' : ''} ${draggedIds.includes(p.id) ? 'dragging' : ''}`}
          style={{
            position: 'absolute',
            left: iconPositions[p.id]?.x || 0,
            top: iconPositions[p.id]?.y || 0
          }}
          title={p.name}
          onMouseDown={(e) => startIconDrag(p.id, e)}
          onDoubleClick={() => openWindow(p)}
        >
          <img src={p.icon} alt={p.name} draggable="false" />
          <span>{p.name}</span>
        </div>
      ))}

      {/* Windows */}
      {openWindows.map(win => {
        const item = items.find(i => i.id === win.id);
        if (!item) return null;
        return (
          <Window
            key={win.id}
            win={win}
            item={item}
            contents={items.filter(i => i.parentId === win.id)}
            shield={interaction !== null}
            onOpenItem={openWindow}
            onItemDragStart={startFolderItemDrag}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onDragStart={(e) => startWindowDrag(win.id, e)}
          />
        );
      })}

      {/* Icon being dragged out of a folder window */}
      {ghost && (
        <div className="icon drag-ghost" style={{ left: interaction.x - ICON_W / 2, top: interaction.y - 30 }}>
          <img src={ghost.icon} alt="" draggable="false" />
          <span>{ghost.name}</span>
        </div>
      )}

      {/* Context Menu */}
      {menu && (
        <div ref={menuRef} className="context-menu" style={{ top: menu.y, left: menu.x }}>
          {/* only show when something is selected */}
          {selectedIds.length > 0 && (
            <>
              <div className="menu-item delete" onClick={deleteSelected}>
                Delete ({selectedIds.length})
              </div>

              {/* only rename one at a time */}
              {selectedIds.length === 1 && (
                <div className="menu-item" onClick={renameItem}>
                  Rename
                </div>
              )}

              {/* separator */}
              <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '4px 0' }} />
            </>
          )}

          {/* Creation Group: Always shows */}
          <div className="menu-item" onClick={createNewPage}>New Page</div>
          <div className="menu-item" onClick={createNewFolder}>New Folder</div>
          <div className="menu-item" onClick={() => window.location.reload()}>Refresh Desktop</div>
        </div>
      )}
    </div>
  );
}
