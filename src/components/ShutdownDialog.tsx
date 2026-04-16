interface ShutdownDialogProps {
  onClose: () => void;
}

export function ShutdownDialog({ onClose }: ShutdownDialogProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40"
        style={{ zIndex: 200 }}
        onClick={onClose}
      />
      <div
        className="fixed win-raised"
        style={{
          zIndex: 201,
          backgroundColor: "var(--color-win-surface)",
          width: 280,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Title bar */}
        <div className="win-titlebar">
          <span className="flex-1">Shut Down</span>
          <button
            className="win-button !min-w-0 !p-0 w-4 h-3.5 flex items-center justify-center text-[10px] leading-none"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col items-center gap-3">
          <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-system)" }}>:(</div>
          <p
            className="text-xs text-center"
            style={{ fontFamily: "var(--font-system)", color: "var(--color-muted-foreground)" }}
          >
            Please don't go... there's so much more to see!
          </p>
          <div className="flex gap-2 mt-2">
            <button className="win-button" onClick={onClose}>
              Stay
            </button>
            <button
              className="win-button"
              onClick={() => {
                document.body.style.transition = "opacity 1.5s";
                document.body.style.opacity = "0";
                setTimeout(() => {
                  window.location.reload();
                }, 1800);
              }}
            >
              Shut Down
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
