"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { NUMBER_THUMB_SCALE } from "@/hooks/useNumberPdfUI";

// Must match the geometry used in /api/pdf/number/route.ts (all values in PDF points)
const PAGE_MARGIN = 30;

interface NumberPreviewProps {
  thumbUrl: string;
  alt: string;
  text: string;
  position: string;
  size: number;
  textColor: string;
  shape: string;
  shapeColor: string;
  fontFamily: string;
}

export function NumberPreview({
  thumbUrl,
  alt,
  text,
  position,
  size,
  textColor,
  shape,
  shapeColor,
  fontFamily,
}: NumberPreviewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [dims, setDims] = useState({ pageW: 0, pageH: 0, scale: 0 });

  const updateDimensions = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth || !img.clientWidth) return;
    const pageW = img.naturalWidth / NUMBER_THUMB_SCALE;
    const pageH = img.naturalHeight / NUMBER_THUMB_SCALE;
    setDims({ pageW, pageH, scale: img.clientWidth / pageW });
  }, []);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) updateDimensions();
    const ro = new ResizeObserver(updateDimensions);
    ro.observe(img);
    return () => ro.disconnect();
  }, [thumbUrl, updateDimensions]);

  const hasShape = shape !== "none";
  const boxH = hasShape ? size * 2 : size * 0.7;

  const fontStack =
    fontFamily === "Times New Roman"
      ? "'Times New Roman', Times, serif"
      : fontFamily === "Courier New"
      ? "'Courier New', Courier, monospace"
      : "Arial, Helvetica, sans-serif";

  const style: React.CSSProperties = {
    position: "absolute",
    height: boxH,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    lineHeight: 1,
    fontWeight: 400,
    fontSize: size,
    fontFamily: fontStack,
    color: textColor,
    ...(hasShape
      ? {
          backgroundColor: shapeColor,
          minWidth: size * 2,
          padding: `0 ${size * 0.7}px`,
          borderRadius: shape === "circle" ? "9999px" : boxH * 0.2,
        }
      : {}),
  };

  if (position.startsWith("top")) style.top = PAGE_MARGIN;
  else style.bottom = PAGE_MARGIN;

  if (position.endsWith("right")) style.right = PAGE_MARGIN;
  else if (position.endsWith("left")) style.left = PAGE_MARGIN;
  else {
    style.left = "50%";
    style.transform = "translateX(-50%)";
  }

  return (
    <div className="relative shrink-0 block w-full max-w-[280px] shadow-md rounded-sm overflow-hidden border border-slate-200 dark:border-slate-800 bg-white">
      <img
        ref={imgRef}
        src={thumbUrl}
        alt={alt}
        onLoad={updateDimensions}
        className="block w-full h-auto bg-white"
      />
      {dims.scale > 0 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: dims.pageW,
              height: dims.pageH,
              transform: `scale(${dims.scale})`,
              transformOrigin: "top left",
            }}
          >
            <div style={style}>{text}</div>
          </div>
        </div>
      )}
    </div>
  );
}
