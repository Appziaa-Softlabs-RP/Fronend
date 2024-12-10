import React, { useEffect, useMemo, useState } from "react";

function useMouse(ref) {
  const [mouse, setMouse] = useState({ x: 0, y: 0, isActive: false });
  useEffect(() => {
    if (ref.current) {
      const handleMouseMove = (e) => {
        // get mouse position relative to ref
        const rect = ref.current?.getBoundingClientRect();
        if (rect) {
          setMouse({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            isActive: true,
          });
        }
      };
      const handleMouseOut = (e) => {
        setMouse({
          x: 0,
          y: 0,
          isActive: false,
        });
      }
      ref.current.addEventListener("mousemove", handleMouseMove);
      ref.current.addEventListener("mouseout", handleMouseOut);
      return () => {
        ref.current?.removeEventListener("mousemove", handleMouseMove);
        ref.current?.removeEventListener("mouseout", handleMouseOut);
      };
    }
  });
  return mouse;
}

export function useMouseOverZoom(
  source,
  target,
  cursor,
  radius = 150
) {
  // Capture Mouse position
  const { x, y, isActive } = useMouse(source);
  // Compute the part of the image to zoom based on mouse position
  const zoomBounds = useMemo(() => {
    return {
      left: x - radius,
      top: y - radius,
      width: radius * 2,
      height: radius * 2,
    }
  }, [x, y]);
  // move the cursor to the mouse position
  useEffect(() => {
    if (cursor.current) {
      const { left, top, width, height } = zoomBounds;
      cursor.current.style.left = `${left}px`;
      cursor.current.style.top = `${top}px`;
      cursor.current.style.width = `${width}px`;
      cursor.current.style.height = `${height}px`;
      cursor.current.style.display = isActive ? "block" : "none";
    }
  }, [zoomBounds, isActive]);
  // draw the zoomed image on the canvas
  useEffect(() => {
    if (source.current && target.current) {
      const ctx = target.current.getContext("2d");
      if (ctx) {
      if (isActive) {
        const { left, top, width, height } = zoomBounds;
        const imageRatio = source.current.naturalWidth / source.current.width;
          ctx.drawImage(
            source.current,
            left * imageRatio,
            top * imageRatio,
            width * imageRatio,
            height * imageRatio,
            0,
            0,
            target.current.width,
            target.current.height
          );
        }
        else {
          // clear canvas
          ctx.clearRect(0, 0, target.current.width, target.current.height);
        }
      }
    }
  }, [zoomBounds, isActive])
}