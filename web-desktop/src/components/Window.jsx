export default function Window({ window: win, onClose, onFocus, onDragStart, isDragging, allItems, onOpenItem }) {
  const style = {
    width: win.launch?.width || '400px',
    height: win.launch?.height || '300px',
    zIndex: win.zIndex,
    top: win.y,
    left: win.x,
    position: 'absolute'
  };

  const children = allItems?.filter(item => item.parentId === win.id) || [];

  return (
    <div className="window" style={style} onMouseDown={(e) => { e.stopPropagation(); onFocus(); }}>
      <div className="titlebar" onMouseDown={onDragStart}>
        <span>{win.name}</span>
        <button className="close-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>X</button>
      </div>
      <div className="content" style={{ position: 'relative' }}>
        {isDragging && <div className="iframe-shield"></div>}
        {win.type === 'folder' ? (
          <div className="folder-view">
            {children.map(item => (
              <div key={item.id} className="icon" onMouseDown={(e) => e.stopPropagation()} onDoubleClick={() => onOpenItem(item)}>
                <img src={item.icon} alt={item.name} style={{ width: '40px' }} draggable="false" />
                <span style={{ fontSize: '11px', color: '#333', textShadow: 'none' }}>{item.name}</span>
              </div>
            ))}
            {children.length === 0 && <p style={{ color: '#999', fontSize: '12px', padding: '10px' }}>Folder is empty</p>}
          </div>
        ) : (
          <iframe src={win.url} title={win.name} style={{ width: '100%', height: '100%', border: 'none' }} />
        )}
      </div>
    </div>
  );
}
