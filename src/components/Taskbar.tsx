import { useState, useEffect, useRef } from "react";
import startIcon from "@/assets/icons/start.png";
import speakerIcon from "@/assets/icons/loudspeaker_rays.png";
import speakerMutedIcon from "@/assets/icons/loudspeaker_muted.png";

interface TaskbarProps {
  openWindows: { id: string; title: string; icon: React.ReactNode }[];
  activeWindow: string | null;
  onWindowClick: (id: string) => void;
  onStartClick?: () => void;
  startOpen?: boolean;
  volume?: number;
  onVolumeChange?: (v: number) => void;
}

export function Taskbar({ openWindows, activeWindow, onWindowClick, onStartClick, startOpen, volume = 0.5, onVolumeChange }: TaskbarProps) {
  const [time, setTime] = useState("");
  const [showVolume, setShowVolume] = useState(false);
  const volRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Riyadh" })
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close volume popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (volRef.current && !volRef.current.contains(e.target as Node)) {
        setShowVolume(false);
      }
    };
    if (showVolume) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showVolume]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-8 win-raised flex items-center px-1 gap-1"
      style={{
        backgroundColor: "var(--color-win-taskbar)",
        zIndex: 50,
      }}
    >
      {/* Start button */}
      <button
        className={`win-taskbar-btn font-bold ${startOpen ? "active" : ""}`}
        onClick={onStartClick}
      >
        <img src={startIcon} alt="" width={14} height={14} style={{ imageRendering: "pixelated" }} />
        <span style={{ fontSize: 12 }}>Start</span>
      </button>

      <div className="w-px h-5 bg-win-shadow mx-1" />

      {/* Open windows */}
      <div className="flex gap-1 flex-1 min-w-0">
        {openWindows.map((win) => (
          <button
            key={win.id}
            className={`win-taskbar-btn flex-1 max-w-40 truncate ${activeWindow === win.id ? "active" : ""}`}
            onClick={() => onWindowClick(win.id)}
          >
            <span className="text-sm">{win.icon}</span>
            <span className="truncate" style={{ fontSize: 11 }}>{win.title}</span>
          </button>
        ))}
      </div>

      {/* System tray */}
      <div className="win-sunken flex items-center gap-2 px-2 h-5 relative" ref={volRef}>
        <button
          className="border-none bg-transparent cursor-pointer p-0"
          onClick={() => setShowVolume((p) => !p)}
        >
          <img
            src={volume === 0 ? speakerMutedIcon : speakerIcon}
            alt="Volume"
            width={14}
            height={14}
            style={{ imageRendering: "pixelated" }}
          />
        </button>

        {/* Volume popup */}
        {showVolume && (
          <div
            className="absolute win-raised p-2"
            style={{
              bottom: 24,
              right: 0,
              backgroundColor: "var(--color-win-surface)",
              zIndex: 100,
              width: 36,
              height: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 9, fontFamily: "var(--font-system)" }}>Vol</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
              style={{
                writingMode: "vertical-lr",
                direction: "rtl",
                height: 60,
                width: 16,
                accentColor: "var(--color-win-titlebar)",
              }}
            />
            <button
              className="border-none bg-transparent cursor-pointer p-0"
              style={{ fontSize: 9, fontFamily: "var(--font-system)" }}
              onClick={() => onVolumeChange?.(volume === 0 ? 0.5 : 0)}
            >
              {volume === 0 ? "Unmute" : "Mute"}
            </button>
          </div>
        )}

        <span style={{ fontSize: 11, fontFamily: "var(--font-system)", fontWeight: 700 }}>{time}</span>
      </div>
    </div>
  );
}
