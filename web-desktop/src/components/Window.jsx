export default function Window({ win, item, contents, shield, onClose, onFocus, onDragStart, onOpenItem, onItemDragStart }) {
  const style = {
    width: item.launch?.width || '400px',
    height: item.launch?.height || '300px',
    zIndex: win.zIndex,
    top: win.y,
    left: win.x,
    position: 'absolute'
  };

  return (
    <div className="window" data-window-id={item.id} style={style} onMouseDown={(e) => { e.stopPropagation(); onFocus(); }}>
      <div className="titlebar" onMouseDown={onDragStart}>
        <span>{item.name}</span>
        <button className="close-btn" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>X</button>
      </div>
      <div className="content" style={{ position: 'relative' }}>
        {item.type === 'folder' ? (
          <div className="folder-view">
            {contents.map(child => (
              <div
                key={child.id}
                data-item-id={child.id}
                className="icon"
                title={child.name}
                onMouseDown={(e) => onItemDragStart(child.id, e)}
                onDoubleClick={() => onOpenItem(child)}
              >
                <img src={child.icon} alt={child.name} draggable="false" />
                <span>{child.name}</span>
              </div>
            ))}
            {contents.length === 0 && <p style={{ color: '#999', fontSize: '12px', padding: '10px' }}>Folder is empty</p>}
          </div>
        ) : (
          <>
            {/* iframes swallow mouse events, so cover them during any drag */}
            {shield && <div className="iframe-shield"></div>}
            <iframe src={item.url} title={item.name} style={{ width: '100%', height: '100%', border: 'none' }} />
          </>
        )}
      </div>
    </div>
  );
}
