export default function Window({ window, onClose, onFocus, onDragStart, isDragging, allItems, onOpenItem }) {
  const style = {
    width: window.launch?.width || '400px',
    height: window.launch?.height || '300px',
    zIndex: window.zIndex,
    top: window.y,
    left: window.x,
    position: 'absolute'
  };

  const children = allItems?.filter(item => item.parentId === window.id) || [];

  return (
    <div 
      className="window" 
      style={style} 
      /* e.stopPropagation() is vital here so clicking a window doesn't start a marquee selection on the desktop background */
      onMouseDown={(e) => { 
        e.stopPropagation(); 
        onFocus(); 
      }}
    >
      <div className="titlebar" onMouseDown={onDragStart}>
        <span>{window.name}</span>
        <button className="close-btn" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}>X</button>
      </div>

      <div className="content" style={{ position: 'relative' }}>
        {/* Shield prevents iframe lag by capturing mouse movement during drag */}
        {isDragging && <div className="iframe-shield"></div>}

        {window.type === 'folder' ? (
          <div className="folder-view">
            {children.map(item => (
              <div 
                key={item.id} 
                className="icon" 
                /* prevents folder icon clicks from triggering desktop logic */
                onMouseDown={(e) => e.stopPropagation()}
                onDoubleClick={() => onOpenItem(item)}
              >
                <img src={item.icon} alt={item.name} style={{ width: '40px' }} draggable="false" />
                <span style={{ fontSize: '11px', color: '#333', textShadow: 'none' }}>
                  {item.name}
                </span>
              </div>
            ))}
            {children.length === 0 && (
              <p style={{ color: '#999', fontSize: '12px', padding: '10px' }}>
                Folder is empty
              </p>
            )}
          </div>
        ) : (
          <iframe 
            src={window.url} 
            title={window.name} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
          />
        )}
      </div>
    </div>
  );
}