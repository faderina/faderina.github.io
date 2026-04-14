/**
 * Original glitch-collage marks inspired by each platform — not official logos.
 * Loaded before script.js
 */
function fhSvgDataUrl(svg) {
  const compact = svg.replace(/\s+/g, " ").trim();
  return `data:image/svg+xml,${encodeURIComponent(compact)}`;
}

const SOCIAL_LOGOS = {
  instagram: fhSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M128 168 L384 168 M128 344 L384 344" stroke="#504a62" stroke-width="4" opacity="0.45"/>
    <rect x="108" y="108" width="296" height="296" rx="56" stroke="#5c6568" stroke-width="10" transform="translate(10,-8)" opacity="0.85"/>
    <rect x="108" y="108" width="296" height="296" rx="52" stroke="#6b4a5c" stroke-width="7" transform="translate(-8,10)" opacity="0.65"/>
    <rect x="108" y="108" width="296" height="296" rx="48" stroke="#6a7058" stroke-width="5" opacity="0.55"/>
    <circle cx="256" cy="268" r="78" stroke="#504a62" stroke-width="6" opacity="0.75"/>
    <circle cx="256" cy="268" r="52" stroke="#5c6568" stroke-width="4" opacity="0.5"/>
    <path d="M156 392 L356 120 M132 220 L420 280" stroke="#6b3a42" stroke-width="3" opacity="0.28"/>
    <path d="M340 152 L372 128 L388 168 L352 176 Z" stroke="#6a7058" stroke-width="5" opacity="0.5"/>
    <line x1="96" y1="256" x2="160" y2="256" stroke="#5c6568" stroke-width="3" opacity="0.35"/>
    <line x1="352" y1="256" x2="416" y2="256" stroke="#6b4a5c" stroke-width="3" opacity="0.35"/>
  </g>
</svg>`),

  tiktok: fhSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M304 96v96c0 0 52-8 88 28v-72c-24-18-52-28-88-28z" stroke="#ff0050" stroke-width="12" transform="translate(10,6)"/>
    <path d="M304 96v96c0 0 52-8 88 28v-72c-24-18-52-28-88-28z" stroke="#00f2ea" stroke-width="12" transform="translate(-8,-4)"/>
    <path d="M304 96v96c0 0 52-8 88 28v-72c-24-18-52-28-88-28z" stroke="#ffffff" stroke-width="5" opacity="0.85"/>
    <ellipse cx="232" cy="312" rx="88" ry="120" stroke="#ff0050" stroke-width="14" transform="translate(12,0)"/>
    <ellipse cx="232" cy="312" rx="88" ry="120" stroke="#00f2ea" stroke-width="14" transform="translate(-10,4)"/>
    <ellipse cx="232" cy="312" rx="88" ry="120" stroke="#eaeaea" stroke-width="6" opacity="0.9"/>
    <line x1="232" y1="192" x2="232" y2="96" stroke="#fff" stroke-width="10" opacity="0.9"/>
  </g>
  <path d="M120 420 L160 100 M392 92 L348 420" stroke="#ff0050" stroke-width="3" opacity="0.3"/>
</svg>`),

  roblox: fhSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="rbx" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e60012"/>
      <stop offset="100%" style="stop-color:#0066ff"/>
    </linearGradient>
  </defs>
  <g transform="translate(256 268)">
    <rect x="-130" y="-130" width="200" height="200" rx="14" fill="none" stroke="url(#rbx)" stroke-width="10" transform="rotate(12) skewX(-8)"/>
    <rect x="-110" y="-110" width="200" height="200" rx="12" fill="none" stroke="#fff" stroke-width="5" transform="rotate(-8) skewX(6)"/>
    <rect x="-90" y="-90" width="200" height="200" rx="10" fill="none" stroke="#00e5ff" stroke-width="4" transform="rotate(4)" opacity="0.85"/>
    <polygon points="-40,-20 40,-60 40,40 -40,80 -120,40 -120,-60" fill="none" stroke="#e60012" stroke-width="6" opacity="0.5" transform="rotate(22)"/>
  </g>
  <text x="96" y="96" fill="rgba(255,255,255,0.06)" font-size="120" font-family="monospace" transform="rotate(-12 96 96)">R</text>
</svg>`),

  spotify: fhSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="sp" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" style="stop-color:#1ed760"/>
      <stop offset="50%" style="stop-color:#169c46"/>
      <stop offset="100%" style="stop-color:#ff00aa"/>
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="200" fill="none" stroke="url(#sp)" stroke-width="3" opacity="0.25"/>
  <g fill="none" stroke-linecap="round">
    <path d="M120 200 Q256 140 392 180" stroke="#1ed760" stroke-width="18" transform="translate(6,0)"/>
    <path d="M120 200 Q256 140 392 180" stroke="#ff00cc" stroke-width="10" opacity="0.7" transform="translate(-8,4)"/>
    <path d="M140 270 Q256 220 372 250" stroke="#1ed760" stroke-width="16" transform="translate(-4,2)"/>
    <path d="M160 340 Q256 300 352 320" stroke="#7fff00" stroke-width="12" opacity="0.9"/>
  </g>
  <rect x="48" y="100" width="160" height="6" fill="#1ed760" opacity="0.15" transform="rotate(-8 128 103)"/>
  <rect x="300" y="380" width="200" height="5" fill="#ff00aa" opacity="0.2" transform="rotate(6 400 382)"/>
</svg>`),

  steam: fhSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="stm" cx="40%" cy="40%">
      <stop offset="0%" style="stop-color:#66c0f4"/>
      <stop offset="70%" style="stop-color:#1b2838"/>
      <stop offset="100%" style="stop-color:#000"/>
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#stm)" stroke-width="4" opacity="0.55"/>
  <g fill="none" stroke="#66c0f4" stroke-width="8" stroke-linecap="round">
    <path d="M160 200 L220 200 L260 280 L320 200 L380 200" opacity="0.9"/>
    <circle cx="200" cy="320" r="36" stroke="#a4d7f5" stroke-width="10"/>
    <line x1="236" y1="320" x2="340" y2="300" stroke-width="10"/>
    <path d="M340 300 Q400 260 420 200" stroke="#ff3366" stroke-width="5" opacity="0.8"/>
  </g>
  <g stroke="#fff" stroke-width="4" opacity="0.2">
    <path d="M120 420 Q180 360 200 300"/>
    <path d="M160 440 Q220 380 240 320"/>
    <path d="M200 450 Q250 400 270 340"/>
  </g>
  <rect x="60" y="60" width="392" height="392" fill="none" stroke="#66c0f4" stroke-width="2" opacity="0.15" transform="rotate(4 256 256)"/>
</svg>`),

  discord: fhSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g fill="none" stroke="#6b6e7a" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
    <path d="M128 168c88-40 168-40 256 0l-22 110c-18 28-56 46-106 46s-88-18-106-46L128 168z" opacity="0.9"/>
    <circle cx="196" cy="262" r="22" stroke="#8a8d98"/>
    <circle cx="316" cy="262" r="22" stroke="#8a8d98"/>
    <path d="M196 352c24 18 96 18 120 0" opacity="0.65"/>
  </g>
  <path d="M96 320 L80 400 M416 320 L432 400" stroke="#4a4d55" stroke-width="6" opacity="0.5"/>
</svg>`),
};
