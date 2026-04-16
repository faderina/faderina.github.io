import { useState, useRef, useEffect } from "react";

const tracks = [
  { name: "Going Home - Shiro Sagisu", src: "/music/track1.mp3" },
  { name: "Seatbelt Off - Edward Skeletrix", src: "/music/track2.mp3" },
  { name: "Crunch Time - Chris Travis", src: "/music/track3.mp3" },
];

interface MusicPlayerProps {
  onVolumeChange?: (volume: number) => void;
  volume?: number;
}

export function MusicPlayer({ onVolumeChange, volume = 0.5 }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(tracks[currentTrack].src);
    audioRef.current = audio;
    audio.volume = volume;

    audio.addEventListener("timeupdate", () => {
      setProgress(audio.currentTime);
    });
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("ended", () => {
      // Auto-advance to next track
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-3">
      {/* Track list */}
      <div className="win-sunken p-1" style={{ backgroundColor: "white" }}>
        {tracks.map((track, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-2 py-1 cursor-pointer"
            style={{
              backgroundColor: i === currentTrack ? "var(--color-win-titlebar)" : "transparent",
              color: i === currentTrack ? "white" : "inherit",
              fontFamily: "var(--font-system)",
              fontSize: 11,
            }}
            onClick={() => {
              setCurrentTrack(i);
              setIsPlaying(true);
            }}
          >
            <span>{i === currentTrack && isPlaying ? "▶" : "♪"}</span>
            <span className="truncate">{track.name}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div
          className="win-sunken h-3 cursor-pointer"
          style={{ backgroundColor: "white" }}
          onClick={seek}
        >
          <div
            className="h-full"
            style={{
              width: duration ? `${(progress / duration) * 100}%` : "0%",
              backgroundColor: "var(--color-win-titlebar)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{ fontSize: 10, fontFamily: "var(--font-system)" }}>{formatTime(progress)}</span>
          <span style={{ fontSize: 10, fontFamily: "var(--font-system)" }}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-1">
        <button className="win-button !min-w-0 !px-2" onClick={prevTrack}>⏮</button>
        <button className="win-button !min-w-0 !px-3 font-bold" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="win-button !min-w-0 !px-2" onClick={nextTrack}>⏭</button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-1">
        <span style={{ fontSize: 10, fontFamily: "var(--font-system)" }}>Vol:</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
          className="flex-1 h-2"
          style={{ accentColor: "var(--color-win-titlebar)" }}
        />
      </div>
    </div>
  );
}
