import React, { useRef, useEffect, useState, useCallback } from 'react';

const SignatureCanvas = ({ onSignatureChange, signatureData, disabled = false }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size based on display size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Set canvas background
    ctx.fillStyle = disabled ? '#f5f5f5' : 'white';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    // Set drawing properties
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';
    
    // Load existing signature if provided
    if (signatureData && signatureData !== '') {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.fillStyle = disabled ? '#f5f5f5' : 'white';
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
        setHasDrawn(true);
      };
      img.src = signatureData;
    }
  }, [signatureData, disabled]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Get coordinates relative to canvas
  const getCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * (canvas.width / dpr / rect.width),
      y: (clientY - rect.top) * (canvas.height / dpr / rect.height)
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    setIsDrawing(true);
    setLastPosition(coords);
    setHasDrawn(true);
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    
    // Add a small dot for single clicks
    ctx.arc(coords.x, coords.y, 1, 0, 2 * Math.PI);
    ctx.fill();
  }, [disabled, getCoordinates]);

  // Draw line
  const draw = useCallback((e) => {
    if (!isDrawing || disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    // Draw line from last position to current position
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    
    setLastPosition(coords);
  }, [isDrawing, disabled, lastPosition, getCoordinates]);

  // Stop drawing
  const stopDrawing = useCallback((e) => {
    if (!isDrawing || disabled) return;
    
    e?.preventDefault();
    e?.stopPropagation();
    
    setIsDrawing(false);
    
    // Save signature data
    const canvas = canvasRef.current;
    if (canvas && onSignatureChange) {
      const dataURL = canvas.toDataURL('image/png');
      onSignatureChange(dataURL);
    }
  }, [isDrawing, disabled, onSignatureChange]);

  // Clear signature
  const clearSignature = useCallback(() => {
    if (disabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    
    setHasDrawn(false);
    
    if (onSignatureChange) {
      onSignatureChange('');
    }
  }, [disabled, onSignatureChange]);

  // Mouse events
  const handleMouseDown = useCallback((e) => startDrawing(e), [startDrawing]);
  const handleMouseMove = useCallback((e) => draw(e), [draw]);
  const handleMouseUp = useCallback((e) => stopDrawing(e), [stopDrawing]);
  const handleMouseLeave = useCallback((e) => stopDrawing(e), [stopDrawing]);

  // Touch events
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) { // Only single touch
      startDrawing(e);
    }
  }, [startDrawing]);
  
  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 1) { // Only single touch
      draw(e);
    }
  }, [draw]);
  
  const handleTouchEnd = useCallback((e) => {
    stopDrawing(e);
  }, [stopDrawing]);

  return (
    <div className="signature-canvas-wrapper">
      <div 
        ref={containerRef}
        className="signature-canvas-container"
        style={{ 
          position: 'relative',
          display: 'block',
          width: 'fit-content'
        }}
      >
        <canvas
          ref={canvasRef}
          width="400"
          height="150"
          className="signature-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            cursor: disabled ? 'default' : 'crosshair',
            backgroundColor: disabled ? '#f5f5f5' : 'white',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            touchAction: 'none',
            boxShadow: disabled 
              ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
              : '0 2px 4px rgba(0, 0, 0, 0.05)',
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            width: '100%'
          }}
        />
 
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={clearSignature}
          className="clear-signature-btn"
          style={{
            marginTop: '12px',
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
          }}
        >
          <span style={{ fontSize: '14px' }}>🗑️</span>
          Clear Signature
        </button>
      )}
    </div>
  );
};

export default SignatureCanvas;