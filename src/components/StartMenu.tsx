import { type ReactNode } from "react";

interface StartMenuItem {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

interface StartMenuProps {
  items: StartMenuItem[];
  onClose: () => void;
  onShutdown?: () => void;
}

export function StartMenu({ items, onClose, onShutdown }: StartMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0" style={{ zIndex: 55 }} onClick={onClose} />

      {/* Menu */}
      <div
        className="fixed bottom-8 left-0 win-raised flex"
        style={{
          zIndex: 60,
          backgroundColor: "var(--color-win-surface)",
          minWidth: 200,
        }}
      >
        {/* Side banner */}
        <div
          className="w-6 flex items-end justify-center pb-1"
          style={{
            background: "linear-gradient(to top, var(--color-win-titlebar), oklch(0.55 0.12 260))",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          <span
            className="text-xs font-bold tracking-widest"
            style={{
              color: "var(--color-win-titlebar-foreground)",
              fontFamily: "var(--font-system)",
              fontSize: 11,
              letterSpacing: "1px",
            }}
          >
            Faderina
          </span>
        </div>

        {/* Menu items */}
        <div className="flex-1 py-1">
          {items.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-3 py-1.5 text-left hover:bg-win-titlebar hover:text-white"
              style={{
                fontFamily: "var(--font-system)",
                fontSize: 12,
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-win-titlebar)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "inherit";
              }}
            >
              <span className="w-5 text-center" style={{ fontSize: 14 }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <div className="border-t border-win-shadow mx-1 my-1" />
          <button
            className="w-full flex items-center gap-3 px-3 py-1.5 text-left"
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 12,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-win-titlebar)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "inherit";
            }}
            onClick={() => { onShutdown?.(); onClose(); }}
          >
            <span className="w-5 text-center" style={{ fontSize: 14 }}>⏻</span>
            <span>Shut Down...</span>
          </button>
        </div>
      </div>
    </>
  );
}
