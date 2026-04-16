import { useState, useRef, useCallback, type ReactNode } from "react";

interface DesktopIconProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  selected?: boolean;
  initialPosition: { x: number; y: number };
}

export function DesktopIcon({ icon, label, onClick, selected, initialPosition }: DesktopIconProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    hasMoved.current = false;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    hasMoved.current = true;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <button
      className="absolute flex flex-col items-center gap-1 p-2 w-20 cursor-pointer border-none bg-transparent"
      style={{
        left: position.x,
        top: position.y,
        backgroundColor: selected ? "rgba(0,0,128,0.3)" : "transparent",
        zIndex: isDragging ? 30 : 5,
        touchAction: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={() => {
        if (!hasMoved.current) onClick?.();
      }}
    >
      <span className="leading-none pointer-events-none">{icon}</span>
      <span
        className="text-xs text-center leading-tight pointer-events-none"
        style={{
          fontFamily: "var(--font-system)",
          color: "white",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
          fontSize: "11px",
        }}
      >
        {label}
      </span>
    </button>
  );
}
