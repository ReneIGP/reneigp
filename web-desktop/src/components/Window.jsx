export default function Window({ window, onClose, onFocus }) {
  const style = {
    width: window.launch.width,
    height: window.launch.height,
    zIndex: window.zIndex,
    top: '10%', left: '20%' // Phase 2: Add dragging logic to update these
  };

  return (
    <div className="window" style={style} onMouseDown={onFocus}>
      <div className="titlebar">
        <span>{window.name}</span>
        <div className="controls">
          <button onClick={onClose}>X</button>
        </div>
      </div>
      <div className="content">
        <iframe src={window.url} title={window.name} sandbox="allow-scripts allow-same-origin" />
      </div>
    </div>
  );
}