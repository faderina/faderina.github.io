// Win98-style pixel icons as SVG components

export function IconComputer({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="4" width="24" height="16" fill="#000080" stroke="#808080" strokeWidth="2"/>
      <rect x="6" y="6" width="20" height="12" fill="#008080"/>
      <rect x="12" y="20" width="8" height="4" fill="#C0C0C0"/>
      <rect x="8" y="24" width="16" height="3" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
    </svg>
  );
}

export function IconFolder({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M2 8 L2 26 L30 26 L30 10 L14 10 L12 8 Z" fill="#FFD700" stroke="#808000" strokeWidth="1"/>
      <rect x="2" y="10" width="28" height="16" fill="#FFE44D" stroke="#808000" strokeWidth="1"/>
    </svg>
  );
}

export function IconNotepad({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="2" width="20" height="28" fill="white" stroke="#808080" strokeWidth="1"/>
      <rect x="6" y="2" width="20" height="4" fill="#000080"/>
      <line x1="9" y1="10" x2="23" y2="10" stroke="#000" strokeWidth="1"/>
      <line x1="9" y1="14" x2="23" y2="14" stroke="#000" strokeWidth="1"/>
      <line x1="9" y1="18" x2="20" y2="18" stroke="#000" strokeWidth="1"/>
      <line x1="9" y1="22" x2="18" y2="22" stroke="#000" strokeWidth="1"/>
    </svg>
  );
}

export function IconGlobe({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" fill="#4169E1" stroke="#000080" strokeWidth="1"/>
      <ellipse cx="16" cy="16" rx="6" ry="12" fill="none" stroke="#87CEEB" strokeWidth="1"/>
      <line x1="4" y1="16" x2="28" y2="16" stroke="#87CEEB" strokeWidth="1"/>
      <line x1="16" y1="4" x2="16" y2="28" stroke="#87CEEB" strokeWidth="1"/>
      <ellipse cx="16" cy="10" rx="10" ry="3" fill="none" stroke="#87CEEB" strokeWidth="0.5"/>
      <ellipse cx="16" cy="22" rx="10" ry="3" fill="none" stroke="#87CEEB" strokeWidth="0.5"/>
    </svg>
  );
}

export function IconPerson({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="6" fill="#C0C0C0" stroke="#808080" strokeWidth="1"/>
      <path d="M6 28 Q6 20 16 20 Q26 20 26 28" fill="#000080" stroke="#000080" strokeWidth="1"/>
    </svg>
  );
}

export function IconGamepad({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="4" y="10" width="24" height="14" rx="3" fill="#808080" stroke="#404040" strokeWidth="1"/>
      <rect x="9" y="14" width="3" height="7" fill="#404040"/>
      <rect x="8" y="16" width="5" height="3" fill="#404040"/>
      <circle cx="22" cy="15" r="2" fill="#FF0000"/>
      <circle cx="25" cy="18" r="2" fill="#0000FF"/>
    </svg>
  );
}

export function IconResume({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="2" width="20" height="28" fill="#FFFFCC" stroke="#808080" strokeWidth="1"/>
      <rect x="9" y="5" width="6" height="6" fill="#C0C0C0" stroke="#808080" strokeWidth="0.5"/>
      <line x1="17" y1="6" x2="23" y2="6" stroke="#000" strokeWidth="1"/>
      <line x1="17" y1="9" x2="22" y2="9" stroke="#000" strokeWidth="1"/>
      <line x1="9" y1="15" x2="23" y2="15" stroke="#808080" strokeWidth="0.5"/>
      <line x1="9" y1="18" x2="23" y2="18" stroke="#000" strokeWidth="1"/>
      <line x1="9" y1="21" x2="23" y2="21" stroke="#000" strokeWidth="1"/>
      <line x1="9" y1="24" x2="20" y2="24" stroke="#000" strokeWidth="1"/>
    </svg>
  );
}

export function IconIdea({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 4 C10 4 6 9 6 14 C6 18 9 20 11 22 L11 25 L21 25 L21 22 C23 20 26 18 26 14 C26 9 22 4 16 4Z" fill="#FFD700" stroke="#808000" strokeWidth="1"/>
      <rect x="12" y="25" width="8" height="3" fill="#C0C0C0" stroke="#808080" strokeWidth="0.5"/>
      <line x1="16" y1="1" x2="16" y2="3" stroke="#FFD700" strokeWidth="1.5"/>
      <line x1="6" y1="6" x2="4" y2="4" stroke="#FFD700" strokeWidth="1.5"/>
      <line x1="26" y1="6" x2="28" y2="4" stroke="#FFD700" strokeWidth="1.5"/>
    </svg>
  );
}

export function IconStart({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" fill="#FF0000"/>
      <rect x="9" y="1" width="6" height="6" fill="#00FF00"/>
      <rect x="1" y="9" width="6" height="6" fill="#0000FF"/>
      <rect x="9" y="9" width="6" height="6" fill="#FFFF00"/>
    </svg>
  );
}
