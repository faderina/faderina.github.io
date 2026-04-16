import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<"black" | "logo" | "loading" | "fadeout">("black");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Black screen
    const t1 = setTimeout(() => setPhase("logo"), 800);
    // Phase 2: Show logo, start loading
    const t2 = setTimeout(() => setPhase("loading"), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("fadeout");
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 9999,
        backgroundColor: "#000",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: "opacity 0.5s ease-out",
      }}
    >
      {(phase === "logo" || phase === "loading" || phase === "fadeout") && (
        <div className="flex flex-col items-center gap-6">
          <img
            src={logo}
            alt="Faderina"
            width={80}
            height={80}
            style={{ imageRendering: "pixelated" }}
          />
          <div
            className="text-2xl tracking-wider"
            style={{
              fontFamily: "var(--font-pixel)",
              color: "white",
              textShadow: "0 0 10px rgba(100,150,255,0.5)",
            }}
          >
            Faderina 98
          </div>
        </div>
      )}

      {(phase === "loading" || phase === "fadeout") && (
        <div className="mt-8 w-64">
          <div
            className="win-sunken h-5"
            style={{ backgroundColor: "#000" }}
          >
            <div className="h-full flex gap-0.5 p-0.5">
              {Array.from({ length: Math.floor(Math.min(progress, 100) / 5) }).map((_, i) => (
                <div
                  key={i}
                  className="h-full"
                  style={{
                    width: "4.5%",
                    backgroundColor: "var(--color-win-titlebar)",
                  }}
                />
              ))}
            </div>
          </div>
          <p
            className="text-center mt-3"
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 11,
              color: "#aaa",
            }}
          >
            {progress < 30 ? "Loading system files..." : progress < 60 ? "Initializing desktop..." : progress < 90 ? "Starting Faderina 98..." : "Welcome!"}
          </p>
        </div>
      )}
    </div>
  );
}
