export default function Window({ window, onClose, onFocus, onDragStart, isDragging, allItems, onOpenItem }) {
  // Define the dynamic styles based on the window's state and position
  const style = {
    width: window.launch?.width || '400px',
    height: window.launch?.height || '300px',
    zIndex: window.zIndex,
    top: window.y,
    left: window.x,
    position: 'absolute'
  };

  // Find items that belong to this specific folder based on parentId
  const children = allItems?.filter(item => item.parentId === window.id) || [];

  return (
    <div className="window" style={style} onMouseDown={onFocus}>
      {/* Titlebar acts as the drag handle */}
      <div className="titlebar" onMouseDown={onDragStart}>
        <span>{window.name}</span>
        <button className="close-btn" onClick={(e) => {
          e.stopPropagation(); // Prevents focus event from triggering on close
          onClose();
        }}>X</button>
      </div>

      <div className="content" style={{ position: 'relative' }}>
        {/* Iframe shield prevents the iframe from "stealing" mouse events during drag */}
        {isDragging && <div className="iframe-shield"></div>}

        {window.type === 'folder' ? (
          <div className="folder-view">
            {children.map(item => (
              <div 
                key={item.id} 
                className="icon" 
                style={{ position: 'relative' }} // Folder icons stay in grid flow
                onDoubleClick={() => onOpenItem(item)}
              >
                <img src={item.icon} alt={item.name} style={{ width: '40px' }} draggable="false" />
                <span style={{ fontSize: '12px', color: '#333', textShadow: 'none' }}>
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