export function CrtOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 100 }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      {/* Slight color aberration / flicker feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.08) 50%)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}
