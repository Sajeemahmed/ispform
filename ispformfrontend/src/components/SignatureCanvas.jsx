import React, { useRef, useEffect, useState } from 'react';

const SignatureCanvas = ({ onSignatureChange, signatureData, disabled = false }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

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

  // Enhanced mobile scroll prevention
  const preventMobileScroll = (enable) => {
    if (window.innerWidth <= 768) {
      if (enable) {
        // Store current scroll position
        setScrollPosition(window.pageYOffset);
        
        // Apply styles to prevent scrolling
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.pageYOffset}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        
        // Add class for additional styling
        document.body.classList.add('signature-active');
        
        // Prevent touch events on other elements
        document.documentElement.style.touchAction = 'none';
      } else {
        // Remove all applied styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        
        // Remove class
        document.body.classList.remove('signature-active');
        
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
        
        // Re-enable touch events
        document.documentElement.style.touchAction = '';
      }
    }
  };

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
    e.stopPropagation();
    
    setIsDrawing(true);
    preventMobileScroll(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    e.stopPropagation();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsDrawing(false);
    
    // Small delay to ensure drawing is complete before re-enabling scroll
    setTimeout(() => {
      preventMobileScroll(false);
    }, 100);
    
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

  // Touch event handlers with enhanced prevention
  const handleTouchStart = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    startDrawing(e);
  };

  const handleTouchMove = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    draw(e);
  };

  const handleTouchEnd = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    stopDrawing(e);
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (disabled) return;
    startDrawing(e);
  };

  const handleMouseMove = (e) => {
    if (disabled) return;
    draw(e);
  };

  const handleMouseUp = (e) => {
    if (disabled) return;
    stopDrawing(e);
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    stopDrawing(e);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      // Ensure scroll is re-enabled if component unmounts while drawing
      if (isDrawing) {
        preventMobileScroll(false);
      }
    };
  }, [isDrawing, scrollPosition]);

  return (
    <div className="signature-canvas-wrapper">
      <div 
        className="signature-canvas-container"
        style={{ position: 'relative', zIndex: isDrawing ? 1000 : 'auto' }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
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
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
            boxShadow: disabled 
              ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
              : '0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(79, 70, 229, 0.1)',
            transition: disabled ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
            transition: window.innerWidth <= 768 ? 'none' : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
          }}
          onMouseEnter={(e) => {
            if (window.innerWidth > 768) {
              e.target.style.backgroundColor = '#b91c1c';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (window.innerWidth > 768) {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.3)';
            }
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