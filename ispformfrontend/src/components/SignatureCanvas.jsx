import React, { useRef, useEffect, useState } from 'react';

const SignatureCanvas = ({ onSignatureChange, signatureData, disabled = false }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      
      // Set canvas background
      ctx.fillStyle = disabled ? '#f5f5f5' : 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Load existing signature if provided
      if (signatureData && signatureData !== '') {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = disabled ? '#f5f5f5' : 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = signatureData;
      }
    }
  }, [signatureData, disabled]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    if (disabled) return;
    e.preventDefault();
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    
    setIsDrawing(false);
    
    // Save signature data
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    if (onSignatureChange) {
      onSignatureChange(dataURL);
    }
  };

  const clearSignature = () => {
    if (disabled) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (onSignatureChange) {
      onSignatureChange('');
    }
  };

  return (
    <div className="signature-canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        className="signature-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          cursor: disabled ? 'default' : 'crosshair',
          backgroundColor: disabled ? '#f5f5f5' : 'white',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      {!disabled && (
        <button
          type="button"
          onClick={clearSignature}
          className="clear-signature-btn"
        >
          Clear Signature
        </button>
      )}
    </div>
  );
};

export default SignatureCanvas;