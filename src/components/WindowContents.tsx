import logo from "@/assets/logo.png";

export function HelloContent() {
  return (
    <div className="flex gap-4 items-start">
      <div className="win-sunken p-2 bg-white flex-shrink-0">
        <img src={logo} alt="Faderina" width={64} height={64} style={{ imageRendering: "auto" }} />
      </div>
      <div>
        <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-system)" }}>
          Faderina
        </h2>
        <p className="text-xs mt-2" style={{ fontFamily: "var(--font-system)", color: "var(--color-muted-foreground)" }}>
          Software Developer
        </p>
        <p className="text-xs" style={{ fontFamily: "var(--font-system)", color: "var(--color-muted-foreground)" }}>
          Arabian Standard Time
        </p>
      </div>
    </div>
  );
}

export function SkillsContent() {
  const skills = [
    { name: "JavaScript", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "React", level: 88 },
    { name: "Node.js", level: 80 },
    { name: "CSS", level: 85 },
    { name: "Python", level: 70 },
  ];

  return (
    <div className="space-y-2">
      {skills.map((skill) => (
        <div key={skill.name} className="flex items-center gap-2">
          <span className="text-xs w-20" style={{ fontFamily: "var(--font-system)" }}>
            {skill.name}
          </span>
          <div className="flex-1 win-sunken h-4 bg-white">
            <div
              className="h-full"
              style={{
                width: `${skill.level}%`,
                backgroundColor: "var(--color-win-titlebar)",
              }}
            />
          </div>
          <span className="text-xs w-8 text-right" style={{ fontFamily: "var(--font-system)" }}>
            {skill.level}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function ContactContent() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-system)" }}>
        <span className="text-lg">📧</span>
        <a href="mailto:hello@example.com" className="underline text-blue-800">hello@example.com</a>
      </div>
      <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-system)" }}>
        <span className="text-lg">🐙</span>
        <a href="https://github.com/faderina" target="_blank" rel="noopener" className="underline text-blue-800">github.com/faderina</a>
      </div>
      <div className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-system)" }}>
        <span className="text-lg">🐦</span>
        <a href="https://x.com/faderinaa" target="_blank" rel="noopener" className="underline text-blue-800">x.com/faderinaa</a>
      </div>
    </div>
  );
}

export function ProjectsContent() {
  const projects = [
    { name: "Project Alpha", desc: "A cool web app built with React", icon: "🌐" },
    { name: "Project Beta", desc: "Mobile-first dashboard experience", icon: "📱" },
    { name: "Project Gamma", desc: "CLI tool for dev productivity", icon: "⚡" },
  ];

  return (
    <div className="space-y-2">
      {projects.map((p) => (
        <div key={p.name} className="win-raised p-2 flex items-start gap-2">
          <span className="text-xl">{p.icon}</span>
          <div>
            <div className="text-xs font-bold" style={{ fontFamily: "var(--font-system)" }}>{p.name}</div>
            <div className="text-xs" style={{ fontFamily: "var(--font-system)", color: "var(--color-muted-foreground)" }}>{p.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AboutMeContent() {
  return (
    <div className="space-y-3">
      <p className="text-xs" style={{ fontFamily: "var(--font-system)" }}>
        Hey, I'm <strong>Faderina</strong>! I'm a developer who loves building cool things on the web.
      </p>
      <p className="text-xs" style={{ fontFamily: "var(--font-system)", color: "var(--color-muted-foreground)" }}>
        I enjoy retro aesthetics, creative coding, and pushing the boundaries of what's possible in the browser.
      </p>
    </div>
  );
}

export function HobbiesContent() {
  const hobbies = [
    { icon: "🎮", name: "Gaming" },
    { icon: "🎨", name: "Digital Art" },
    { icon: "🎵", name: "Music" },
    { icon: "📚", name: "Reading" },
    { icon: "🏃", name: "Running" },
  ];

  return (
    <div className="space-y-2">
      {hobbies.map((h) => (
        <div key={h.name} className="flex items-center gap-2 text-xs" style={{ fontFamily: "var(--font-system)" }}>
          <span className="text-lg">{h.icon}</span>
          <span>{h.name}</span>
        </div>
      ))}
    </div>
  );
}

export function IdeasContent() {
  return (
    <div className="space-y-2">
      <div className="win-sunken p-2 bg-white">
        <pre className="text-xs whitespace-pre-wrap" style={{ fontFamily: "var(--font-system)" }}>
{`Ideas Board
================

1. Build a retro game in the browser
2. Create a CLI tool for quick scaffolding
3. Design a pixel art portfolio
4. Open source a UI component library
5. Write a blog about web dev tips`}
        </pre>
      </div>
    </div>
  );
}
