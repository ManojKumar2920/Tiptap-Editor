"use client";
import { useEditorState } from "@/store/editor-store";
import React, { useState, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";

const markers = Array.from({ length: 83 }, (_, i) => i + 1);

export const Ruler = () => {
  const [leftMarker, setLeftMarker] = useState(56);
  const [rightMarker, setRightMarker] = useState(56);
  const rulerRef = useRef<HTMLDivElement>(null);
  const { paddingLeft, paddingRight, setPaddingLeft, setPaddingRight } =
    useEditorState();

  const createDragHandler =
    (marker: "left" | "right") => (e: React.MouseEvent) => {
      const startX = e.clientX;
      const startPos = marker === "left" ? leftMarker : rightMarker;
      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!rulerRef.current) return;
        const delta = moveEvent.clientX - startX;
        let newPos = startPos + delta;

        
        
        // Clamp to ruler width
        newPos = Math.max(0, Math.min(rulerRef.current.clientWidth, newPos));

        if (marker === "left") {
          setLeftMarker(newPos);
          setPaddingLeft(newPos);
          
        } else {setRightMarker(newPos)
          setPaddingRight(newPos)
        };
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

  return (
    <div className="h-6 border-b border-gray-300 flex items-end relative">
      <div
        ref={rulerRef}
        className="max-w-[816px] mx-auto w-full h-full relative"
      >
        <Marker
          position={leftMarker}
          isLeft={true}
          onMouseDown={createDragHandler("left")}
          onDoubleClick={() => alert("Left marker double clicked!")}
        />
        <Marker
          position={rightMarker}
          isLeft={false}
          onMouseDown={createDragHandler("right")}
          onDoubleClick={() => alert("Right marker double clicked!")}
        />

        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-full">
            {markers.map((marker) => {
              const position = (marker * 816) / 85;
              return (
                <div
                  key={marker}
                  className="absolute bottom-0 border-gray-300"
                  style={{ left: `${position}px` }}
                >
                  {marker % 10 === 0 && (
                    <div>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500"></div>
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </div>
                  )}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-400"></div>
                  )}
                  {marker % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-300"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

const Marker = ({
  position,
  isLeft,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 h-full cursor-ew-resize z-10 w-4 -ml-2"
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
    </div>
  );
};
