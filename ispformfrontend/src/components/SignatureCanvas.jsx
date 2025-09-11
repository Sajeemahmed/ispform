import React, { useRef, useEffect, useState, useCallback } from "react";

const SignatureCanvas = ({ onSignatureChange, signatureData, disabled = false }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [strokes, setStrokes] = useState([]);

  // initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = disabled ? "#f5f5f5" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";
  }, [disabled]);

  // get cursor position
  const getCoordinates = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // start drawing
  const startDrawing = useCallback(
    (e) => {
      if (disabled) return;
      e.preventDefault();
      const coords = getCoordinates(e);
      setIsDrawing(true);
      setLastPosition(coords);
      setStrokes((prev) => [...prev, [coords]]);
    },
    [disabled, getCoordinates]
  );

  // draw on canvas
  const draw = useCallback(
    (e) => {
      if (!isDrawing || disabled) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const coords = getCoordinates(e);

      ctx.beginPath();
      ctx.moveTo(lastPosition.x, lastPosition.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      setLastPosition(coords);

      setStrokes((prev) => {
        const newStrokes = [...prev];
        newStrokes[newStrokes.length - 1] = [
          ...newStrokes[newStrokes.length - 1],
          coords,
        ];
        return newStrokes;
      });
    },
    [isDrawing, disabled, lastPosition, getCoordinates]
  );

  // stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    if (onSignatureChange) {
      onSignatureChange(canvasRef.current.toDataURL("image/png"));
    }
  }, [onSignatureChange]);

  // redraw all strokes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = disabled ? "#f5f5f5" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "black";

    strokes.forEach((stroke) => {
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      stroke.forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.stroke();
    });
  }, [strokes, disabled]);

  useEffect(() => {
    redraw();
  }, [strokes, redraw]);

  // undo last stroke
  const undoLastStroke = () => {
    if (disabled || strokes.length === 0) return;
    setStrokes((prev) => prev.slice(0, -1));
  };

  // clear all strokes
  const clearSignature = () => {
    if (disabled) return;
    setStrokes([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = disabled ? "#f5f5f5" : "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (onSignatureChange) onSignatureChange("");
  };

  return (
    <div className="signature-canvas-container">
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
      />
      <div className="signature-buttons">
        <button
          type="button"
          className="signature-btn undo-btn"
          onClick={undoLastStroke}
          disabled={disabled || strokes.length === 0}
        >
          <span className="btn-icon">↶</span>
          Undo
        </button>

        <button
          type="button"
          className="signature-btn clear-btn"
          onClick={clearSignature}
          disabled={disabled}
        >
          <span className="btn-icon"><i class="fa-solid fa-trash"></i></span>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas; 