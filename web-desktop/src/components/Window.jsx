export default function Window({ window, onClose, onFocus, onDragStart }) {
  const style = {
    width: window.launch.width,
    height: window.launch.height,
    zIndex: window.zIndex,
    top: window.y,
    left: window.x,
    position: 'absolute'
  };

  return (
    <div className="window" style={style} onMouseDown={onFocus}>
      <div className="titlebar" onMouseDown={onDragStart}>
        <span>{window.name}</span>
        <button className="close-btn" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}>X</button>
      </div>
      <div className="content">
        <iframe src={window.url} title={window.name} />
      </div>
    </div>
  );
}