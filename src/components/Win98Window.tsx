import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";

interface Win98WindowProps {
  title: string;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  isActive?: boolean;
  onFocus?: () => void;
  onClose?: () => void;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

function clampPosition(x: number, y: number, width: number) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  return {
    x: Math.max(0, Math.min(x, vw - Math.min(width, vw))),
    y: Math.max(0, Math.min(y, vh - 40)),
  };
}

function getResponsivePosition(defaultPos: { x: number; y: number }, defaultSize: { width: number; height: number }) {
  if (typeof window === "undefined") return defaultPos;
  const vw = window.innerWidth;
  if (vw < 500) {
    // Mobile: center horizontally, stack from top
    return { x: Math.max(4, (vw - Math.min(defaultSize.width, vw - 8)) / 2), y: 32 };
  }
  return clampPosition(defaultPos.x, defaultPos.y, defaultSize.width);
}

export function Win98Window({
  title,
  children,
  defaultPosition = { x: 100, y: 50 },
  defaultSize = { width: 420, height: 350 },
  isActive = true,
  onFocus,
  onClose,
  tabs,
  activeTab,
  onTabChange,
}: Win98WindowProps) {
  const [position, setPosition] = useState(() => getResponsivePosition(defaultPosition, defaultSize));
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Responsive width
  const responsiveWidth = typeof window !== "undefined" && window.innerWidth < 500
    ? Math.min(defaultSize.width, window.innerWidth - 8)
    : defaultSize.width;

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => clampPosition(prev.x, prev.y, responsiveWidth));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsiveWidth]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      onFocus?.();
      setIsDragging(true);
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        setPosition(clampPosition(
          ev.clientX - dragOffset.current.x,
          ev.clientY - dragOffset.current.y,
          responsiveWidth,
        ));
      };
      const handleMouseUp = () => {
        setIsDragging(false);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [position, onFocus, responsiveWidth]
  );

  return (
    <div
      className="absolute win-raised"
      style={{
        left: position.x,
        top: position.y,
        width: responsiveWidth,
        zIndex: isActive ? 20 : 10,
        backgroundColor: "var(--color-win-surface)",
        maxHeight: "calc(100vh - 40px)",
        overflow: "auto",
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className={`win-titlebar ${!isActive ? "win-titlebar-inactive" : ""}`}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? "grabbing" : "grab", position: "sticky", top: 0, zIndex: 2 }}
      >
        <span className="flex-1 truncate">{title}</span>
        <div className="flex gap-0.5">
          <button className="win-button !min-w-0 !p-0 w-4 h-3.5 flex items-center justify-center text-[10px] leading-none">_</button>
          <button className="win-button !min-w-0 !p-0 w-4 h-3.5 flex items-center justify-center text-[10px] leading-none">□</button>
          <button
            className="win-button !min-w-0 !p-0 w-4 h-3.5 flex items-center justify-center text-[10px] leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>

      {/* Tabs */}
      {tabs && (
        <div className="flex px-2 pt-1 gap-0" style={{ backgroundColor: "var(--color-win-surface)" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className="px-3 py-0.5 text-xs border border-b-0"
              style={{
                backgroundColor: activeTab === tab ? "var(--color-win-surface)" : "var(--color-win-surface-dark)",
                borderColor: "var(--color-win-shadow)",
                fontFamily: "var(--font-system)",
                marginBottom: activeTab === tab ? "-1px" : "0",
                position: "relative",
                zIndex: activeTab === tab ? 2 : 1,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-3" style={{ minHeight: Math.min(defaultSize.height - 30, 200) }}>
        {children}
      </div>
    </div>
  );
}
