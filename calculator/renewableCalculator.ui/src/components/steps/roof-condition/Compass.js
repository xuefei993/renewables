import React, { useState, useRef, useEffect } from 'react';

const Compass = () => {
  const [position, setPosition] = useState({ x: 20, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const compassRef = useRef(null);

  // Correct the direction angles (0° = North, clockwise)
  const directions = [
    { label: 'N', angle: 0, fullName: 'North' },
    { label: 'NNE', angle: 22.5, fullName: 'North-Northeast' },
    { label: 'NE', angle: 45, fullName: 'Northeast' },
    { label: 'ENE', angle: 67.5, fullName: 'East-Northeast' },
    { label: 'E', angle: 90, fullName: 'East' },
    { label: 'ESE', angle: 112.5, fullName: 'East-Southeast' },
    { label: 'SE', angle: 135, fullName: 'Southeast' },
    { label: 'SSE', angle: 157.5, fullName: 'South-Southeast' },
    { label: 'S', angle: 180, fullName: 'South' },
    { label: 'SSW', angle: 202.5, fullName: 'South-Southwest' },
    { label: 'SW', angle: 225, fullName: 'Southwest' },
    { label: 'WSW', angle: 247.5, fullName: 'West-Southwest' },
    { label: 'W', angle: 270, fullName: 'West' },
    { label: 'WNW', angle: 292.5, fullName: 'West-Northwest' },
    { label: 'NW', angle: 315, fullName: 'Northwest' },
    { label: 'NNW', angle: 337.5, fullName: 'North-Northwest' }
  ];

  const handleMouseDown = (e) => {
    // Don't start dragging if clicking on the minimize button
    if (e.target.closest('.compass-minimize-btn')) {
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Get map container bounds to constrain movement
    const mapContainer = compassRef.current?.closest('.map-with-compass');
    if (mapContainer) {
      const rect = mapContainer.getBoundingClientRect();
      const compassSize = isMinimized ? 150 : 250; // Adjusted for English text button width
      
      const constrainedX = Math.max(0, Math.min(newX, rect.width - compassSize));
      const constrainedY = Math.max(0, Math.min(newY, rect.height - compassSize));
      
      setPosition({ x: constrainedX, y: constrainedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, isMinimized]);

  if (isMinimized) {
    return (
      <div 
        ref={compassRef}
        className="compass-container minimized"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="compass-minimized">
          <div className="compass-mini-icon">🧭</div>
          <button 
            className="compass-minimize-btn expand" 
            onClick={toggleMinimized}
            aria-label="Expand compass"
          >
            <span className="btn-icon">⤢</span>
            <span className="btn-text">Expand</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={compassRef}
      className={`compass-container draggable ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="compass-header">
        <button 
          className="compass-minimize-btn" 
          onClick={toggleMinimized}
          aria-label="Minimize compass"
        >
          <span className="btn-icon">⤡</span>
          <span className="btn-text">Minimize</span>
        </button>
      </div>
      
      <div className="compass">
        <div className="compass-center">
          <div className="compass-needle"></div>
        </div>
        {directions.map((direction, index) => {
          const radius = 85; // Increased radius for larger compass
          const x = Math.sin((direction.angle * Math.PI) / 180) * radius;
          const y = -Math.cos((direction.angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={index}
              className={`compass-direction ${direction.label === 'N' || direction.label === 'S' || direction.label === 'E' || direction.label === 'W' ? 'cardinal' : 'intermediate'}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              title={direction.fullName}
            >
              {direction.label}
            </div>
          );
        })}
      </div>
      <div className="compass-label">
        <small>Drag to move • Hover for directions</small>
      </div>
    </div>
  );
};

export default Compass; 