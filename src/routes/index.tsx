import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import wallpaper from "@/assets/wallpaper.jpg";
import { Win98Window } from "@/components/Win98Window";
import { DesktopIcon } from "@/components/DesktopIcon";
import { Taskbar } from "@/components/Taskbar";
import { StartMenu } from "@/components/StartMenu";
import { CrtOverlay } from "@/components/CrtOverlay";
import { ShutdownDialog } from "@/components/ShutdownDialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import { BootScreen } from "@/components/BootScreen";
import { SnakeGame } from "@/components/SnakeGame";

// Real Win98 icon imports
import iconComputer from "@/assets/icons/computer.png";
import iconFolder from "@/assets/icons/directory_closed.png";
import iconNotepad from "@/assets/icons/notepad.png";
import iconPerson from "@/assets/icons/address_book_user.png";
import iconGamepad from "@/assets/icons/joystick.png";
import iconMedia from "@/assets/icons/media_player.png";
import iconGlobe from "@/assets/icons/connected_world.png";
import iconIdea from "@/assets/icons/idea.png";

import {
  HelloContent,
  SkillsContent,
  ContactContent,
  ProjectsContent,
  AboutMeContent,
  HobbiesContent,
  IdeasContent,
} from "@/components/WindowContents";

export const Route = createFileRoute("/")({
  component: Desktop,
  head: () => ({
    meta: [
      { title: "Faderina — Windows 98 Portfolio" },
      { name: "description", content: "Faderina's retro Windows 98-themed portfolio" },
    ],
  }),
});

type WindowId = "overview" | "projects" | "notepad" | "aboutme" | "hobbies" | "ideas" | "snake" | "music";

function Win98Icon({ src, size = 14 }: { src: string; size?: number }) {
  return <img src={src} alt="" width={size} height={size} style={{ imageRendering: "pixelated" }} />;
}

function Desktop() {
  const [booted, setBooted] = useState(false);
  const [openWindows, setOpenWindows] = useState<WindowId[]>(["overview"]);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>("overview");
  const [activeTab, setActiveTab] = useState("Hello");
  const [startOpen, setStartOpen] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const handleBootComplete = useCallback(() => setBooted(true), []);

  const toggleWindow = (id: WindowId) => {
    if (openWindows.includes(id)) {
      setActiveWindow(id);
    } else {
      setOpenWindows((prev) => [...prev, id]);
      setActiveWindow(id);
    }
  };

  const closeWindow = (id: WindowId) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id));
    setActiveWindow((prev) => (prev === id ? null : prev));
  };

  const tabContent: Record<string, React.ReactNode> = {
    Hello: <HelloContent />,
    Skills: <SkillsContent />,
    Contact: <ContactContent />,
    Projects: <ProjectsContent />,
  };

  const windowTitles: Record<WindowId, string> = {
    overview: "Overview",
    projects: "My Projects",
    notepad: "Notepad",
    aboutme: "About Me",
    hobbies: "My Hobbies",
    ideas: "My Ideas",
    snake: "Snake",
    music: "Media Player",
  };

  const windowIcons: Record<WindowId, React.ReactNode> = {
    overview: <Win98Icon src={iconComputer} />,
    projects: <Win98Icon src={iconFolder} />,
    notepad: <Win98Icon src={iconNotepad} />,
    aboutme: <Win98Icon src={iconPerson} />,
    hobbies: <Win98Icon src={iconGamepad} />,
    ideas: <Win98Icon src={iconIdea} />,
    snake: <Win98Icon src={iconGamepad} />,
    music: <Win98Icon src={iconMedia} />,
  };

  const startMenuItems = [
    { icon: <Win98Icon src={iconComputer} size={18} />, label: "About My Site", onClick: () => toggleWindow("overview") },
    { icon: <Win98Icon src={iconGamepad} size={18} />, label: "My Hobbies", onClick: () => toggleWindow("hobbies") },
    { icon: <Win98Icon src={iconNotepad} size={18} />, label: "Resume", onClick: () => toggleWindow("notepad") },
    { icon: <Win98Icon src={iconIdea} size={18} />, label: "My Ideas", onClick: () => toggleWindow("ideas") },
    { icon: <Win98Icon src={iconPerson} size={18} />, label: "About Me", onClick: () => toggleWindow("aboutme") },
    { icon: <Win98Icon src={iconGamepad} size={18} />, label: "Snake", onClick: () => toggleWindow("snake") },
    { icon: <Win98Icon src={iconMedia} size={18} />, label: "Media Player", onClick: () => toggleWindow("music") },
  ];

  const desktopIcons = [
    { icon: <img src={iconComputer} alt="" width={48} height={48} style={{ imageRendering: "pixelated" as const }} />, label: "Overview", onClick: () => toggleWindow("overview"), pos: { x: 12, y: 36 } },
    { icon: <img src={iconFolder} alt="" width={48} height={48} style={{ imageRendering: "pixelated" as const }} />, label: "Projects", onClick: () => toggleWindow("projects"), pos: { x: 12, y: 130 } },
    { icon: <img src={iconNotepad} alt="" width={48} height={48} style={{ imageRendering: "pixelated" as const }} />, label: "Notepad", onClick: () => toggleWindow("notepad"), pos: { x: 12, y: 224 } },
    { icon: <img src={iconPerson} alt="" width={48} height={48} style={{ imageRendering: "pixelated" as const }} />, label: "About Me", onClick: () => toggleWindow("aboutme"), pos: { x: 12, y: 318 } },
    { icon: <img src={iconGamepad} alt="" width={48} height={48} style={{ imageRendering: "pixelated" as const }} />, label: "Hobbies", onClick: () => toggleWindow("hobbies"), pos: { x: 12, y: 412 } },
    { icon: <img src={iconIdea} alt="" width={48} height={48} style={{ imageRendering: "pixelated" as const }} />, label: "Ideas", onClick: () => toggleWindow("ideas"), pos: { x: 12, y: 506 } },
    { icon: <img src={iconMedia} alt="" width={48} height={48} style={{ imageRendering: "pixelated" as const }} />, label: "Media Player", onClick: () => toggleWindow("music"), pos: { x: 12, y: 600 } },
  ];

  if (!booted) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <div
      className="w-screen h-screen relative select-none overflow-hidden"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CrtOverlay />

      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-3"
        style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 40 }}
      >
        <span
          className="text-xl tracking-wide"
          style={{
            fontFamily: "var(--font-pixel)",
            color: "white",
            textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
          }}
        >
          Faderina
        </span>
        <div className="flex items-center gap-3">
          <a href="https://github.com/faderina" target="_blank" rel="noopener" className="hover:opacity-80">
            <img src={iconGlobe} alt="GitHub" width={16} height={16} style={{ imageRendering: "pixelated" }} />
          </a>
          <a href="https://x.com/faderinaa" target="_blank" rel="noopener" className="text-white hover:opacity-80 text-xs font-bold" style={{ fontFamily: "var(--font-system)" }}>
            𝕏
          </a>
          <span className="text-xs" style={{ fontFamily: "var(--font-system)", color: "white" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "Asia/Riyadh" })}
          </span>
        </div>
      </div>

      {/* Desktop icons */}
      {desktopIcons.map((di) => (
        <DesktopIcon
          key={di.label}
          icon={di.icon}
          label={di.label}
          onClick={di.onClick}
          initialPosition={di.pos}
        />
      ))}

      {/* Overview Window */}
      {openWindows.includes("overview") && (
        <Win98Window
          title="Overview"
          defaultPosition={{ x: 160, y: 40 }}
          defaultSize={{ width: 420, height: 300 }}
          isActive={activeWindow === "overview"}
          onFocus={() => setActiveWindow("overview")}
          onClose={() => closeWindow("overview")}
          tabs={["Hello", "Skills", "Contact", "Projects"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          <div className="min-h-[200px]">{tabContent[activeTab]}</div>
          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-win-shadow">
            <button className="win-button" onClick={() => closeWindow("overview")}>Cancel</button>
            <button className="win-button">OK</button>
          </div>
        </Win98Window>
      )}

      {/* Projects Window */}
      {openWindows.includes("projects") && (
        <Win98Window
          title="My Projects"
          defaultPosition={{ x: 300, y: 100 }}
          defaultSize={{ width: 380, height: 280 }}
          isActive={activeWindow === "projects"}
          onFocus={() => setActiveWindow("projects")}
          onClose={() => closeWindow("projects")}
        >
          <ProjectsContent />
        </Win98Window>
      )}

      {/* Notepad Window */}
      {openWindows.includes("notepad") && (
        <Win98Window
          title="Notepad - readme.txt"
          defaultPosition={{ x: 450, y: 80 }}
          defaultSize={{ width: 350, height: 260 }}
          isActive={activeWindow === "notepad"}
          onFocus={() => setActiveWindow("notepad")}
          onClose={() => closeWindow("notepad")}
        >
          <div className="win-sunken p-2 h-48 overflow-auto" style={{ backgroundColor: "white" }}>
            <pre className="text-xs whitespace-pre-wrap" style={{ fontFamily: "var(--font-system)" }}>
{`Welcome to Faderina's portfolio!
================================

I'm a software developer who loves
building cool stuff on the web.

Feel free to explore the desktop,
open some windows, and check out
my work.

- Double-click icons to open them
- Drag windows by the title bar
- Click tabs to navigate

Have fun!`}
            </pre>
          </div>
        </Win98Window>
      )}

      {/* About Me Window */}
      {openWindows.includes("aboutme") && (
        <Win98Window
          title="About Me"
          defaultPosition={{ x: 200, y: 120 }}
          defaultSize={{ width: 340, height: 220 }}
          isActive={activeWindow === "aboutme"}
          onFocus={() => setActiveWindow("aboutme")}
          onClose={() => closeWindow("aboutme")}
        >
          <AboutMeContent />
        </Win98Window>
      )}

      {/* Hobbies Window */}
      {openWindows.includes("hobbies") && (
        <Win98Window
          title="My Hobbies"
          defaultPosition={{ x: 250, y: 90 }}
          defaultSize={{ width: 300, height: 250 }}
          isActive={activeWindow === "hobbies"}
          onFocus={() => setActiveWindow("hobbies")}
          onClose={() => closeWindow("hobbies")}
        >
          <HobbiesContent />
        </Win98Window>
      )}

      {/* Ideas Window */}
      {openWindows.includes("ideas") && (
        <Win98Window
          title="My Ideas"
          defaultPosition={{ x: 350, y: 60 }}
          defaultSize={{ width: 340, height: 280 }}
          isActive={activeWindow === "ideas"}
          onFocus={() => setActiveWindow("ideas")}
          onClose={() => closeWindow("ideas")}
        >
          <IdeasContent />
        </Win98Window>
      )}

      {/* Snake Window */}
      {openWindows.includes("snake") && (
        <Win98Window
          title="Snake"
          defaultPosition={{ x: 280, y: 70 }}
          defaultSize={{ width: 320, height: 300 }}
          isActive={activeWindow === "snake"}
          onFocus={() => setActiveWindow("snake")}
          onClose={() => closeWindow("snake")}
        >
          <SnakeGame />
        </Win98Window>
      )}

      {/* Music Player Window */}
      {openWindows.includes("music") && (
        <Win98Window
          title="Media Player"
          defaultPosition={{ x: 320, y: 80 }}
          defaultSize={{ width: 320, height: 320 }}
          isActive={activeWindow === "music"}
          onFocus={() => setActiveWindow("music")}
          onClose={() => closeWindow("music")}
        >
          <MusicPlayer volume={volume} onVolumeChange={setVolume} />
        </Win98Window>
      )}

      {/* Start Menu */}
      {startOpen && (
        <StartMenu
          items={startMenuItems}
          onClose={() => setStartOpen(false)}
          onShutdown={() => { setStartOpen(false); setShowShutdown(true); }}
        />
      )}

      {/* Shutdown Dialog */}
      {showShutdown && <ShutdownDialog onClose={() => setShowShutdown(false)} />}

      {/* Taskbar */}
      <Taskbar
        openWindows={openWindows.map((id) => ({
          id,
          title: windowTitles[id],
          icon: windowIcons[id],
        }))}
        activeWindow={activeWindow}
        onWindowClick={(id) => setActiveWindow(id as WindowId)}
        onStartClick={() => setStartOpen((p) => !p)}
        startOpen={startOpen}
        volume={volume}
        onVolumeChange={setVolume}
      />
    </div>
  );
}
