/**
 * SOCIALS: one link per platform. Logos: logos.js
 * BGM: yabujin.mp3 loops after enter; DVD smileys duck BGM while a sample plays.
 */
const SOUNDS_DIR = "Sounds/";

function soundPath(filename) {
  return SOUNDS_DIR + encodeURIComponent(filename);
}

const BGM_FILENAME = "yabujin.mp3";
const BGM_VOLUME_NORMAL = 0.5;
const BGM_FADE_IN_MS = 720;

const BUTTON_SOUND_FILES = [
  "ringtone 1.mp3",
  "ringtone 2.mp3",
  "ringtone 3.mp3",
  "ringtone 4.mp3",
  "ringtone 10.mp3",
  "ringtone 13.mp3",
  "ringtone 14.mp3",
  "ringtone scary song.mp3",
  "neurons.mp3",
  "bg.mp3",
];
const MAX_BUTTON_SOUND_MS = 10000;

const SOCIALS = [
  { key: "instagram", label: "instagram", url: "https://www.instagram.com/fofomica/" },
  { key: "tiktok", label: "tiktok", url: "https://www.tiktok.com/@faderinaa" },
  { key: "roblox", label: "roblox", url: "https://www.roblox.com/users/4441112/profile" },
  { key: "spotify", label: "spotify", url: "https://open.spotify.com/user/314kgqxaboit7vc6qqe4x3m7on7u?si=ecd7fc0922f94c5f" },
  { key: "discord", label: "discord", url: "https://discord.com/users/748611198848860292" },
  { key: "steam", label: "steam", url: "https://steamcommunity.com/profiles/76561199182407259/" },
];
const DISCORD_USER_ID = "748611198848860292";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const IS_REDUCED_MOTION = window.matchMedia(REDUCED_MOTION_QUERY).matches;
const IS_MOBILE = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
const SAVE_DATA = Boolean(navigator.connection && navigator.connection.saveData);
const LOW_CPU = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency > 0
  ? navigator.hardwareConcurrency <= 4
  : false;
const LOW_MEMORY = typeof navigator.deviceMemory === "number" && navigator.deviceMemory > 0
  ? navigator.deviceMemory <= 4
  : false;
let LOW_PERF_MODE = IS_REDUCED_MOTION || (SAVE_DATA && !IS_MOBILE) || (!IS_MOBILE && (LOW_CPU || LOW_MEMORY));

const CYRILLIC = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const KANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノ";
const GLITCH_CHARS = "█▓▒░╔═╗║╚╝┼┤├▀▄■□▲▼◆◇○●";

let bgmAudio = null;
let bgmFadeRaf = 0;
let buttonAudioActive = null;
let buttonStopTimer = null;
let siteEntered = false;
let bgmTargetVolume = BGM_VOLUME_NORMAL;
let lastNonZeroVolume = BGM_VOLUME_NORMAL;
let bgmStartConfirmed = false;
let bgmRecoveryBound = false;
let bgmRecoveryTimer = 0;
let dvdActors = [];
let dvdRaf = 0;
let dvdLastT = 0;
let dvdResizeTimer = 0;
let dvdResizeBound = false;
let visualsStarted = false;

function renderScale() {
  const dpr = window.devicePixelRatio || 1;
  const capped = Math.min(dpr, LOW_PERF_MODE ? 0.9 : 1.25);
  return capped;
}

function targetFps() {
  return LOW_PERF_MODE ? 30 : 60;
}

function rafThrottle(fps, fn) {
  const frameMs = 1000 / Math.max(1, fps);
  let last = 0;
  function tick(now) {
    if (!last || now - last >= frameMs) {
      last = now;
      fn(now);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (LOW_PERF_MODE) {
  document.documentElement.classList.add("low-perf");
}

function detectSoftwareRenderingLikely() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl", { powerPreference: "high-performance" }) ||
      canvas.getContext("experimental-webgl", { powerPreference: "high-performance" });
    if (!gl) return true;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "").toLowerCase()
      : String(gl.getParameter(gl.RENDERER) || "").toLowerCase();

    const vendor = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "").toLowerCase()
      : String(gl.getParameter(gl.VENDOR) || "").toLowerCase();

    const text = `${vendor} ${renderer}`;
    return /(swiftshader|software|llvmpipe|mesa offscreen|basic render|microsoft basic|cpu)/i.test(text);
  } catch {
    return false;
  }
}

function enableLowPerfMode() {
  LOW_PERF_MODE = true;
  document.documentElement.classList.add("low-perf");
}

if (!IS_MOBILE && detectSoftwareRenderingLikely()) {
  enableLowPerfMode();
}

const SMILEY_TONE_CLASSES = [
  "dvd-smiley--acid",
  "dvd-smiley--magenta",
  "dvd-smiley--cyan",
  "dvd-smiley--blood",
  "dvd-smiley--violet",
  "dvd-smiley--text",
  "dvd-smiley--voidlift",
  "dvd-smiley--muted",
];

const MOON_NAMES = [
  "Europa",
  "Io",
  "Titan",
  "Enceladus",
  "Ganymede",
  "Callisto",
  "Triton",
  "Oberon",
  "Miranda",
  "Mimas",
  "Rhea",
  "Dione",
  "Iapetus",
  "Hyperion",
  "Phoebe",
  "Charon",
  "Phobos",
  "Deimos",
  "Luna",
  "Elara",
  "Amalthea",
  "Ariel",
  "Umbriel",
  "Proteus",
];

function randPick(str) {
  return str[Math.floor(Math.random() * str.length)];
}

function corruptString(s) {
  const arr = s.split("");
  const n = Math.max(1, Math.floor(arr.length * 0.14));
  for (let i = 0; i < n; i++) {
    const j = Math.floor(Math.random() * arr.length);
    const pool = Math.random() > 0.5 ? CYRILLIC + KANA : GLITCH_CHARS;
    arr[j] = randPick(pool);
  }
  return arr.join("");
}

function proceduralThumb(seed, size = 256) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  let rng = seed;
  const next = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return rng / 0x7fffffff;
  };

  const hue = 248 + (seed % 8);
  ctx.clearRect(0, 0, size, size);

  ctx.globalCompositeOperation = "source-over";
  for (let r = 0; r < 6; r++) {
    ctx.strokeStyle = `hsla(${hue + r * 3}, 10%, 55%, ${0.35 + next() * 0.25})`;
    ctx.lineWidth = 1 + next() * 3;
    ctx.beginPath();
    const cx = size * (0.2 + next() * 0.6);
    const cy = size * (0.2 + next() * 0.6);
    for (let a = 0; a <= Math.PI * 2; a += 0.08) {
      const wobble = 0.75 + next() * 0.5;
      const rad = size * (0.08 + r * 0.07) * wobble;
      const x = cx + Math.cos(a * (2 + next())) * rad;
      const y = cy + Math.sin(a * (1.5 + next())) * rad;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  return c.toDataURL("image/png");
}

function buildSocials() {
  const grid = document.getElementById("socialGrid");
  if (!grid) return;

  SOCIALS.forEach((item, i) => {
    const seed = 1000 + i * 7919 + item.label.length * 97;
    const hasLogos = typeof SOCIAL_LOGOS !== "undefined" && SOCIAL_LOGOS[item.key];
    const src = hasLogos ? SOCIAL_LOGOS[item.key] : proceduralThumb(seed);

    const a = document.createElement("a");
    a.className = "social-card";
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    const inner = document.createElement("div");
    inner.className = "social-card-inner";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${item.label} (opens in new tab)`;
    img.loading = "lazy";

    const lab = document.createElement("span");
    lab.className = "social-label";
    lab.textContent = item.label;

    inner.append(img, lab);
    a.appendChild(inner);
    const li = document.createElement("li");
    li.appendChild(a);
    grid.appendChild(li);
  });
}

function discordStatusText(status) {
  if (status === "online") return "online";
  if (status === "idle") return "idle";
  if (status === "dnd") return "do not disturb";
  return "offline";
}

function discordAvatarUrl(user) {
  if (!user || !user.id) return "";
  if (!user.avatar) {
    const fallback = Number(user.discriminator || 0) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${fallback}.png`;
  }
  const ext = String(user.avatar).startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
}

function discordDecorationUrlCandidates(user) {
  if (!user) return [];
  const asset = (user.avatar_decoration_data && user.avatar_decoration_data.asset) || user.avatar_decoration;
  if (!asset) return [];
  const animated = String(asset).startsWith("a_");
  const exts = animated ? ["gif", "png", "webp"] : ["png", "webp", "gif"];
  const urls = [];
  exts.forEach((ext) => {
    urls.push(`https://cdn.discordapp.com/avatar-decoration-presets/${asset}.${ext}?size=240&passthrough=true`);
    urls.push(`https://media.discordapp.net/avatar-decoration-presets/${asset}.${ext}?size=240&passthrough=true`);
  });
  return urls;
}

function applyDiscordDecoration(decorEl, urls) {
  if (!decorEl) return;
  if (!urls.length) {
    decorEl.removeAttribute("src");
    decorEl.style.display = "none";
    decorEl.onerror = null;
    return;
  }
  let i = 0;
  decorEl.onerror = () => {
    i += 1;
    if (i < urls.length) decorEl.src = urls[i];
    else {
      decorEl.onerror = null;
      decorEl.removeAttribute("src");
      decorEl.style.display = "none";
    }
  };
  decorEl.style.display = "block";
  decorEl.src = urls[i];
}

async function refreshDiscordPresence() {
  const nameEl = document.getElementById("discordName");
  const statusEl = document.getElementById("discordPresence");
  const activityEl = document.getElementById("discordActivity");
  const dotEl = document.getElementById("discordDot");
  const avatarEl = document.getElementById("discordAvatar");
  const decorEl = document.getElementById("discordDecor");
  if (!nameEl || !statusEl || !activityEl || !dotEl || !avatarEl || !decorEl) return;

  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { cache: "no-store" });
    if (!res.ok) throw new Error("lanyard error");
    const payload = await res.json();
    if (!payload || !payload.success || !payload.data) throw new Error("invalid payload");
    const data = payload.data;
    const user = data.discord_user || {};
    const activities = Array.isArray(data.activities) ? data.activities : [];
    const custom = activities.find((a) => a && a.type === 4 && a.state);
    const playing = activities.find((a) => a && a.type === 0 && a.name);
    const listening = activities.find((a) => a && a.type === 2 && a.name);
    const display = user.global_name || user.display_name || user.username || "Fade";
    const username = user.username || "faderina";
    nameEl.textContent = `${display} (${username})`;
    statusEl.textContent = discordStatusText(data.discord_status);
    if (custom) activityEl.textContent = custom.state;
    else if (playing) activityEl.textContent = `playing ${playing.name}`;
    else if (listening) activityEl.textContent = `listening to ${listening.name}`;
    else activityEl.textContent = "currently doing nothing";
    dotEl.dataset.status = data.discord_status || "offline";

    const avatar = discordAvatarUrl(user);
    if (avatar) avatarEl.src = avatar;

    applyDiscordDecoration(decorEl, discordDecorationUrlCandidates(user));
  } catch (_) {
    statusEl.textContent = "status unavailable";
    activityEl.textContent = "currently doing nothing";
    dotEl.dataset.status = "offline";
    applyDiscordDecoration(decorEl, []);
  }
}

function clearButtonTimers() {
  if (buttonStopTimer) {
    clearTimeout(buttonStopTimer);
    buttonStopTimer = null;
  }
}

function stopButtonSound() {
  clearButtonTimers();
  if (buttonAudioActive) {
    buttonAudioActive.pause();
    buttonAudioActive.currentTime = 0;
    buttonAudioActive.onended = null;
    buttonAudioActive = null;
  }
}

function fadeBgmTo(targetVol, ms) {
  if (!bgmAudio) return;
  const a = bgmAudio;
  const from = a.volume;
  const t0 = performance.now();
  if (bgmFadeRaf) cancelAnimationFrame(bgmFadeRaf);
  function step(now) {
    const u = Math.min(1, (now - t0) / ms);
    a.volume = from + (targetVol - from) * u;
    if (u < 1) bgmFadeRaf = requestAnimationFrame(step);
    else bgmFadeRaf = 0;
  }
  bgmFadeRaf = requestAnimationFrame(step);
}

function bgmUrlCandidates() {
  const enc = encodeURIComponent(BGM_FILENAME);
  const list = [
    soundPath(BGM_FILENAME),
    `Sounds/${enc}`,
    `./Sounds/${enc}`,
    `sounds/${enc}`,
    `./sounds/${enc}`,
  ];
  return list.filter((u, i) => list.indexOf(u) === i);
}

function resolveMediaUrl(url) {
  try {
    return new URL(url, window.location.href).href;
  } catch {
    return url;
  }
}

/** Warm `<source>` selection; do not set `src` here or it clears `<source>` nodes. */
function primeBgmPreload() {
  const el = document.getElementById("siteBgm");
  if (!el) return;
  el.loop = true;
  el.setAttribute("playsinline", "");
  el.preload = "auto";
  el.load();
}

function markBgmStarted() {
  bgmStartConfirmed = true;
  if (bgmRecoveryTimer) {
    clearInterval(bgmRecoveryTimer);
    bgmRecoveryTimer = 0;
  }
}

function syncBgmVolumeNow() {
  if (!bgmAudio || buttonAudioActive) return;
  bgmAudio.muted = false;
  bgmAudio.volume = Math.max(0, Math.min(1, bgmTargetVolume));
}

function attemptBgmRecovery() {
  if (!siteEntered || bgmStartConfirmed || !bgmAudio) return;
  const p = bgmAudio.play();
  if (p !== undefined) {
    p.then(() => {
      markBgmStarted();
      syncBgmVolumeNow();
      fadeBgmTo(bgmTargetVolume, 260);
    }).catch(() => { });
  }
}

function bindBgmRecovery() {
  if (bgmRecoveryBound) return;
  bgmRecoveryBound = true;
  const resume = () => attemptBgmRecovery();
  ["pointerdown", "touchstart", "keydown"].forEach((evt) => {
    window.addEventListener(evt, resume, { passive: true });
  });
  window.addEventListener("focus", resume, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") resume();
  });
}

/**
 * Must run synchronously from the enter overlay click so `play()` stays inside the user-gesture stack.
 */
function startBgmWithJsAudioFallback() {
  const urls = bgmUrlCandidates().map(resolveMediaUrl);
  let i = 0;
  bgmAudio = new Audio();
  bgmAudio.loop = true;
  bgmAudio.preload = "auto";
  bgmAudio.setAttribute("playsinline", "");

  function next() {
    if (i >= urls.length) return;
    bgmAudio.src = urls[i++];
    bgmAudio.volume = 0;
    bgmAudio.load();
    const p = bgmAudio.play();
    if (p !== undefined) {
      p.then(() => {
        markBgmStarted();
        syncBgmVolumeNow();
        setTimeout(syncBgmVolumeNow, 120);
        setTimeout(syncBgmVolumeNow, 500);
        fadeBgmTo(bgmTargetVolume, BGM_FADE_IN_MS);
      }).catch(next);
    }
  }
  next();
}

function startBgmOnEnterTap() {
  bindBgmRecovery();
  const el = document.getElementById("siteBgm");
  if (el) {
    bgmAudio = el;
    el.loop = true;
    el.muted = false;
    el.setAttribute("playsinline", "");
    el.volume = 0;
    const p = el.play();
    if (p !== undefined) {
      p.then(() => {
        markBgmStarted();
        syncBgmVolumeNow();
        setTimeout(syncBgmVolumeNow, 120);
        setTimeout(syncBgmVolumeNow, 500);
        fadeBgmTo(bgmTargetVolume, BGM_FADE_IN_MS);
      }).catch(() => {
        try {
          el.pause();
          el.currentTime = 0;
        } catch (_) { }
        startBgmWithJsAudioFallback();
      });
      return;
    }
  }
  startBgmWithJsAudioFallback();
  if (!bgmRecoveryTimer) {
    bgmRecoveryTimer = setInterval(attemptBgmRecovery, 2200);
  }
}

function restoreBgmVolume() {
  fadeBgmTo(bgmTargetVolume, 1000);
}

function sampleUrlCandidates(filename) {
  const enc = encodeURIComponent(filename);
  const primary = soundPath(filename);
  const list = [primary, `Sounds/${enc}`, `./Sounds/${enc}`, `sounds/${enc}`, `./sounds/${enc}`];
  return list.filter((u, idx) => list.indexOf(u) === idx);
}

function playRandomButtonSound() {
  stopButtonSound();
  const duckTarget = Math.min(0.04, bgmTargetVolume * 0.3);
  fadeBgmTo(duckTarget, 420);

  const filename = BUTTON_SOUND_FILES[Math.floor(Math.random() * BUTTON_SOUND_FILES.length)];
  const urls = sampleUrlCandidates(filename);
  const a = new Audio();
  a.preload = "auto";
  buttonAudioActive = a;

  const finish = () => {
    clearButtonTimers();
    if (buttonAudioActive === a) buttonAudioActive = null;
    restoreBgmVolume();
  };

  buttonStopTimer = setTimeout(() => {
    if (buttonAudioActive !== a) return;
    a.pause();
    a.currentTime = 0;
    finish();
  }, MAX_BUTTON_SOUND_MS);

  a.onended = () => {
    clearButtonTimers();
    if (buttonAudioActive === a) buttonAudioActive = null;
    restoreBgmVolume();
  };

  let u = 0;
  function tryPlayUrl() {
    if (u >= urls.length) {
      finish();
      return;
    }
    a.src = urls[u++];
    a.load();
    a.play().catch(() => tryPlayUrl());
  }
  tryPlayUrl();
}

function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildSmileySvg() {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "dvd-smiley__svg");
  const face = document.createElementNS(NS, "circle");
  face.setAttribute("cx", "50");
  face.setAttribute("cy", "50");
  face.setAttribute("r", "47");
  face.setAttribute("fill", "currentColor");
  svg.appendChild(face);
  [
    [36, 42],
    [64, 42],
  ].forEach(([cx, cy]) => {
    const eye = document.createElementNS(NS, "circle");
    eye.setAttribute("cx", String(cx));
    eye.setAttribute("cy", String(cy));
    eye.setAttribute("r", "7");
    eye.setAttribute("fill", "#08080a");
    svg.appendChild(eye);
  });
  const mouth = document.createElementNS(NS, "path");
  mouth.setAttribute("d", "M32 62 Q50 78 68 62");
  mouth.setAttribute("fill", "none");
  mouth.setAttribute("stroke", "#08080a");
  mouth.setAttribute("stroke-width", "5");
  mouth.setAttribute("stroke-linecap", "round");
  svg.appendChild(mouth);
  return svg;
}

function spreadInitialPositions(n, w, h, vw, vh, edge) {
  const spanX = Math.max(0, vw - w - edge * 2);
  const spanY = Math.max(0, vh - h - edge * 2);
  const minDist = Math.min(vw, vh) * 0.28;
  const out = [];
  for (let i = 0; i < n; i++) {
    let x = edge;
    let y = edge;
    let placed = false;
    for (let t = 0; t < 380 && !placed; t++) {
      x = edge + Math.random() * (spanX || 1);
      y = edge + Math.random() * (spanY || 1);
      placed = out.every((p) => Math.hypot(p.x - x, p.y - y) >= minDist);
    }
    if (!placed) {
      const u = (i + 0.5) / n;
      x = edge + u * spanX * 0.85;
      y = edge + (1 - u * 0.7) * spanY * 0.85;
    }
    out.push({ x, y });
  }
  return out;
}

function clampDvdActorsInView() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 6;
  for (const s of dvdActors) {
    s.x = Math.max(margin, Math.min(s.x, vw - s.w - margin));
    s.y = Math.max(margin, Math.min(s.y, vh - s.h - margin));
  }
}

function dvdTick(t) {
  if (!dvdActors.length) return;
  const dt = dvdLastT ? Math.min(0.032, (t - dvdLastT) / 1000) : 1 / 60;
  dvdLastT = t;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const margin = 6;

  for (const s of dvdActors) {
    s.x += s.vx * dt;
    s.y += s.vy * dt;

    if (s.x <= margin) {
      s.x = margin;
      s.vx = Math.abs(s.vx);
    } else if (s.x + s.w >= vw - margin) {
      s.x = vw - margin - s.w;
      s.vx = -Math.abs(s.vx);
    }
    if (s.y <= margin) {
      s.y = margin;
      s.vy = Math.abs(s.vy);
    } else if (s.y + s.h >= vh - margin) {
      s.y = vh - margin - s.h;
      s.vy = -Math.abs(s.vy);
    }

    s.el.style.transform = `translate3d(${Math.round(s.x)}px, ${Math.round(s.y)}px, 0) rotate(${s.rot}deg)`;
  }

  dvdRaf = requestAnimationFrame(dvdTick);
}

function bindDvdResize() {
  if (dvdResizeBound) return;
  dvdResizeBound = true;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(dvdResizeTimer);
      dvdResizeTimer = setTimeout(clampDvdActorsInView, 100);
    },
    { passive: true }
  );
}

function measureSmileyButtonSize() {
  const probe = document.createElement("button");
  probe.type = "button";
  probe.className = "dvd-smiley";
  probe.style.cssText = "position:fixed;left:-9999px;top:0;visibility:hidden;";
  probe.appendChild(buildSmileySvg());
  const lab = document.createElement("span");
  lab.className = "dvd-smiley__label";
  lab.textContent = "Europa";
  probe.appendChild(lab);
  document.body.appendChild(probe);
  const r = probe.getBoundingClientRect();
  probe.remove();
  return { w: r.width, h: r.height };
}

function spawnDvdSmileys() {
  if (LOW_PERF_MODE) return;
  const mount = document.getElementById("dvdSmileyLayer");
  if (!mount) return;

  mount.innerHTML = "";
  mount.setAttribute("aria-hidden", "false");
  cancelAnimationFrame(dvdRaf);
  dvdRaf = 0;
  dvdLastT = 0;
  dvdActors = [];

  const n = LOW_PERF_MODE ? 4 : 8;
  const edge = 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const { w, h } = measureSmileyButtonSize();
  const names = shuffleCopy(MOON_NAMES).slice(0, n);
  const tones = shuffleCopy(SMILEY_TONE_CLASSES);
  const positions = spreadInitialPositions(n, w, h, vw, vh, edge);

  for (let i = 0; i < n; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `dvd-smiley ${tones[i % tones.length]}`;
    const rot = -12 + Math.random() * 24;
    btn.appendChild(buildSmileySvg());
    const label = document.createElement("span");
    label.className = "dvd-smiley__label";
    label.textContent = names[i];
    btn.appendChild(label);
    btn.setAttribute("aria-label", `Play sample: ${names[i]}`);

    const speed = LOW_PERF_MODE ? 45 + Math.random() * 58 : 62 + Math.random() * 92;
    const sx = Math.random() < 0.5 ? -1 : 1;
    const sy = Math.random() < 0.5 ? -1 : 1;
    const { x, y } = positions[i];

    btn.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) rotate(${rot}deg)`;
    mount.appendChild(btn);

    dvdActors.push({
      el: btn,
      x,
      y,
      vx: sx * speed,
      vy: sy * speed,
      w,
      h,
      rot,
    });

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      playRandomButtonSound();
    });
  }

  bindDvdResize();
  dvdLastT = 0;
  dvdRaf = requestAnimationFrame(dvdTick);
  window.addEventListener(
    "load",
    () => {
      clampDvdActorsInView();
    },
    { once: true }
  );
}

const VIEW_COUNT_BASE = 8530;
const VIEW_COUNT_SEED = VIEW_COUNT_BASE - 1;
const VIEW_COUNTER_NAMESPACE = "faderina-hardworks";
const VIEW_COUNTER_KEY = "site-views";
const VIEW_COUNTER_LOCAL_KEY = "faderina-hardworks-site-views";

function formatViewCount(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  const v = Math.max(0, Math.floor(n));
  return v.toLocaleString("en-US");
}

function setViewCountDisplay(value) {
  const el = document.getElementById("viewCountValue");
  if (!el) return;
  el.textContent = formatViewCount(value);
}

function viewCounterUrl(action) {
  const ns = encodeURIComponent(VIEW_COUNTER_NAMESPACE);
  const key = encodeURIComponent(VIEW_COUNTER_KEY);
  if (action === "get") return `https://api.countapi.xyz/get/${ns}/${key}`;
  if (action === "hit") return `https://api.countapi.xyz/hit/${ns}/${key}`;
  return `https://api.countapi.xyz/create?namespace=${ns}&key=${key}&value=${VIEW_COUNT_SEED}`;
}

async function fetchCounterJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`counter request failed (${res.status})`);
  return res.json();
}

async function incrementPersistedViewCount() {
  setViewCountDisplay(VIEW_COUNT_BASE);
  try {
    const current = await fetchCounterJson(viewCounterUrl("get"));
    const currentValue = Number(current && current.value);
    if (!Number.isFinite(currentValue) || currentValue < VIEW_COUNT_BASE) {
      await fetchCounterJson(viewCounterUrl("create"));
    }
    const next = await fetchCounterJson(viewCounterUrl("hit"));
    const remoteValue = Number(next && next.value);
    if (Number.isFinite(remoteValue)) {
      setViewCountDisplay(remoteValue);
      localStorage.setItem(VIEW_COUNTER_LOCAL_KEY, String(remoteValue));
      return;
    }
  } catch (_) {
    // Fallback keeps counting locally if remote counter is unavailable.
  }
  const localValue = Number(localStorage.getItem(VIEW_COUNTER_LOCAL_KEY));
  const safeLocal = Number.isFinite(localValue) ? localValue : VIEW_COUNT_SEED;
  const nextLocal = Math.max(VIEW_COUNT_BASE, Math.floor(safeLocal + 1));
  localStorage.setItem(VIEW_COUNTER_LOCAL_KEY, String(nextLocal));
  setViewCountDisplay(nextLocal);
}

function initVolumeControl() {
  const slider = document.getElementById("volSlider");
  const toggle = document.getElementById("volToggle");
  if (!slider || !toggle) return;

  function renderVolumeUi() {
    const v = bgmTargetVolume;
    slider.value = String(Math.round(v * 100));
    toggle.setAttribute("aria-label", v <= 0.001 ? "Unmute" : "Mute");
    toggle.classList.toggle("is-muted", v <= 0.001);
  }

  function setTargetVolume(v, applyNow) {
    const clamped = Math.max(0, Math.min(1, v));
    bgmTargetVolume = clamped;
    if (clamped > 0.001) lastNonZeroVolume = clamped;
    renderVolumeUi();
    if (!bgmAudio) return;
    if (applyNow) {
      bgmAudio.volume = bgmTargetVolume;
    } else {
      fadeBgmTo(bgmTargetVolume, 140);
    }
  }

  slider.addEventListener("input", () => {
    const v = Number(slider.value) / 100;
    setTargetVolume(v, true);
  });

  toggle.addEventListener("click", () => {
    if (bgmTargetVolume <= 0.001) {
      setTargetVolume(lastNonZeroVolume || BGM_VOLUME_NORMAL, false);
      return;
    }
    setTargetVolume(0, false);
  });

  renderVolumeUi();
}

function initClickRipples() {
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const r = document.createElement("span");
      r.className = "ui-click-ripple";
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      document.body.appendChild(r);
      const cleanup = () => {
        r.remove();
      };
      r.addEventListener("animationend", cleanup, { once: true });
      setTimeout(cleanup, 520);
    },
    { passive: true, capture: true }
  );
}

function enterSite() {
  if (siteEntered) return;
  siteEntered = true;
  if (!visualsStarted) {
    visualsStarted = true;
    if (!LOW_PERF_MODE) {
      plasmaCanvas();
      fieldCanvas();
      ribbonsCanvas();
      glyphCanvas();
      noiseCanvas();
    }
  }
  spawnDvdSmileys();
}

function initEnterOverlay() {
  const world = document.getElementById("world");
  const overlay = document.getElementById("enterOverlay");
  if (!world || !overlay) return;

  overlay.addEventListener("click", () => {
    startBgmOnEnterTap();
    document.body.classList.remove("gate-active");
    world.classList.remove("world--blurred");
    world.setAttribute("aria-hidden", "false");
    overlay.classList.add("enter-overlay--gone");
    overlay.setAttribute("aria-hidden", "true");
    enterSite();
  });
}

function plasmaCanvas() {
  const canvas = document.getElementById("plasma");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let t = 0;
  const mouse = { x: 0.5, y: 0.5 };

  function resize() {
    const scale = renderScale();
    w = canvas.width = Math.floor(window.innerWidth * scale);
    h = canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  window.addEventListener("resize", resize);
  resize();
  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    },
    { passive: true }
  );

  const step = Math.max(8, Math.floor((LOW_PERF_MODE ? 16 : 10) * renderScale()));

  function frame() {
    if (document.hidden) return;
    t += LOW_PERF_MODE ? 0.014 : 0.018;
    ctx.fillStyle = "rgba(2, 1, 8, 0.2)";
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const nx = x / w;
        const ny = y / h;
        const mx = (mouse.x - 0.5) * 3;
        const my = (mouse.y - 0.5) * 3;
        const v =
          Math.sin(nx * 9 + t + mx) +
          Math.sin(ny * 11 + t * 1.07 + my) +
          Math.sin((nx + ny) * 14 + t * 0.73) +
          Math.sin(Math.hypot(nx - 0.5, ny - 0.5) * 18 - t);
        const hue = 248 + (((v + 4) * 6 + t * 12) % 18);
        const light = 32 + ((Math.sin(t + nx * 20) + 1) * 8) | 0;
        ctx.fillStyle = `hsla(${hue}, 14%, ${light}%, 0.1)`;
        ctx.fillRect(x, y, step + 1, step + 1);
      }
    }

  }
  rafThrottle(targetFps(), frame);
}

function fieldCanvas() {
  const canvas = document.getElementById("field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let t = 0;
  const mouse = { x: 0, y: 0 };

  function resize() {
    const scale = renderScale();
    w = canvas.width = Math.floor(window.innerWidth * scale);
    h = canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener(
    "mousemove",
    (e) => {
      const scale = renderScale();
      mouse.x = e.clientX * scale;
      mouse.y = e.clientY * scale;
    },
    { passive: true }
  );

  function frame() {
    if (document.hidden) return;
    t += LOW_PERF_MODE ? 0.011 : 0.014;
    const scale = renderScale();
    ctx.fillStyle = "rgba(2, 1, 6, 0.1)";
    ctx.fillRect(0, 0, w, h);

    const cols = LOW_PERF_MODE ? 22 : 32;
    const rows = LOW_PERF_MODE ? 14 : 22;
    const cellW = w / cols;
    const cellH = h / rows;

    for (let gy = 0; gy < rows; gy++) {
      for (let gx = 0; gx < cols; gx++) {
        const nx = gx / cols;
        const ny = gy / rows;
        const mx = (mouse.x / w - 0.5) * 2.2;
        const my = (mouse.y / h - 0.5) * 2.2;
        const warp =
          Math.sin(nx * 11 + t * 1.2 + mx) * Math.cos(ny * 10 + t * 0.85 + my) * 0.5 + 0.5;
        const hue = (246 + ((nx * 40 + ny * 50 + t * 20 + warp * 30) % 20)) | 0;
        const alpha = 0.04 + warp * 0.09;
        ctx.fillStyle = `hsla(${hue}, 12%, 48%, ${alpha})`;
        const ox = Math.sin(t * 2.2 + gy * 0.35) * 5 * scale;
        const oy = Math.cos(t * 1.9 + gx * 0.28) * 5 * scale;
        ctx.fillRect(gx * cellW + ox, gy * cellH + oy, cellW * 0.9, cellH * 0.9);
      }
    }

    ctx.strokeStyle = `hsla(248, 10%, 52%, 0.05)`;
    ctx.lineWidth = scale;
    const tri = LOW_PERF_MODE ? 4 : 9;
    for (let i = 0; i < tri; i++) {
      const cx = (w * (0.1 + ((i * 0.23) % 0.8)) + Math.sin(t + i) * 40 * scale) | 0;
      const cy = (h * (0.15 + ((i * 0.31) % 0.7)) + Math.cos(t * 0.8 + i) * 30 * scale) | 0;
      const s = (40 + (i % 4) * 22) * scale;
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx + s, cy + s * 0.55);
      ctx.lineTo(cx - s, cy + s * 0.55);
      ctx.closePath();
      ctx.stroke();
    }

  }
  rafThrottle(targetFps(), frame);
}

function ribbonsCanvas() {
  const canvas = document.getElementById("ribbons");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let t = 0;

  const ribbons = [];
  function seedRibbons() {
    ribbons.length = 0;
    const n = 7;
    for (let i = 0; i < n; i++) {
      ribbons.push({
        hue: (i * 47) % 360,
        y0: Math.random(),
        amp: 0.08 + Math.random() * 0.12,
        freq: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        thick: (2 + Math.random() * 4) * renderScale(),
      });
    }
  }

  function resize() {
    const scale = renderScale();
    w = canvas.width = Math.floor(window.innerWidth * scale);
    h = canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    seedRibbons();
  }
  window.addEventListener("resize", resize);
  resize();

  function frame() {
    if (document.hidden) return;
    t += LOW_PERF_MODE ? 0.008 : 0.011;
    const scale = renderScale();
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(0, 0, w, h);

    ribbons.forEach((r, i) => {
      ctx.beginPath();
      const segments = LOW_PERF_MODE ? 22 : 40;
      for (let s = 0; s <= segments; s++) {
        const u = s / segments;
        const x = u * w;
        const base = r.y0 * h;
        const wave =
          Math.sin(u * Math.PI * r.freq * 4 + t + r.phase) * r.amp * h +
          Math.sin(u * 22 + t * 0.5 + i) * 12 * scale;
        const y = base + wave + Math.sin(t * 0.3 + i) * 0.05 * h;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${248 + ((r.hue + t * 8) % 16)}, 8%, 48%, 0.14)`;
      ctx.lineWidth = r.thick;
      ctx.shadowColor = "rgba(40, 42, 50, 0.35)";
      ctx.shadowBlur = 8 * scale;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

  }
  rafThrottle(targetFps(), frame);
}

function glyphCanvas() {
  const canvas = document.getElementById("glyphs");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let phase = 0;

  function resize() {
    const scale = renderScale();
    w = canvas.width = Math.floor(window.innerWidth * scale);
    h = canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }
  window.addEventListener("resize", resize);
  resize();

  const glyphs = ["⌬", "⍟", "⎔", "◈", "※", "⬡", "⌭", "⎊", "⏣", "⍾", "◐", "◑"];

  function draw() {
    if (document.hidden) return;
    phase += 0.009;
    ctx.clearRect(0, 0, w, h);
    ctx.font = `${16 * renderScale()}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const count = LOW_PERF_MODE ? 18 : 34;
    for (let i = 0; i < count; i++) {
      const x = (w * (0.04 + ((i * 0.029) % 0.9) + Math.sin(phase + i * 0.7) * 0.03)) | 0;
      const y = (h * (0.04 + ((i * 0.071) % 0.92) + Math.cos(phase * 0.85 + i * 0.4) * 0.035)) | 0;
      const g = glyphs[i % glyphs.length];
      ctx.fillStyle = `hsla(248, 6%, 58%, ${0.035 + (i % 6) * 0.012})`;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(phase * 0.35 + i * 0.17);
      ctx.fillText(g, 0, 0);
      ctx.restore();
    }

  }
  rafThrottle(targetFps(), draw);
}

function noiseCanvas() {
  const canvas = document.getElementById("noise");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;

  function resize() {
    const scale = renderScale();
    w = canvas.width = Math.floor(window.innerWidth * scale);
    h = canvas.height = Math.floor(window.innerHeight * scale);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }
  window.addEventListener("resize", resize);
  resize();

  function frame() {
    if (document.hidden) return;
    ctx.clearRect(0, 0, w, h);
    const blocks = LOW_PERF_MODE ? 300 : 1100;
    for (let i = 0; i < blocks; i++) {
      const x = (Math.random() * w) | 0;
      const y = (Math.random() * h) | 0;
      const s = 1 + ((Math.random() * 3) | 0);
      const v = Math.random() > 0.5 ? 255 : 0;
      const a = Math.random() * 0.14;
      ctx.fillStyle = `rgba(${v},${v},${v},${a})`;
      ctx.fillRect(x, y, s, s);
    }
  }
  // Noise is expensive; run slower even on good devices.
  rafThrottle(LOW_PERF_MODE ? 12 : 24, frame);
}

function ticker() {
  const el = document.getElementById("ticker");
  if (!el) return;
  const base =
    "faderina hardworks · faderina · outbound relay · no archive · wrong channel · ";
  let i = 0;
  setInterval(() => {
    const slice = base.slice(i % base.length) + base.slice(0, i % base.length);
    el.textContent = corruptString(slice.slice(0, 52));
    i += 2;
  }, 110);
}

function footerHex() {
  const el = document.getElementById("footerGlitch");
  if (!el) return;
  setInterval(() => {
    let s = "0x";
    for (let i = 0; i < 8; i++) s += Math.floor(Math.random() * 16).toString(16);
    el.textContent = s;
  }, 400);
}

/** Windows "Arabian Standard Time" → IANA Asia/Riyadh (AST, UTC+3, no DST). */
const ARABIAN_STANDARD_TZ = "Asia/Riyadh";

function tickAstClock() {
  const el = document.getElementById("astClock");
  if (!el) return;
  const now = new Date();
  const str = now.toLocaleTimeString("en-GB", {
    timeZone: ARABIAN_STANDARD_TZ,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  el.textContent = str;
  el.setAttribute("datetime", now.toISOString());
}

function titleShuffle() {
  const el = document.getElementById("titleGlitch");
  if (!el) return;
  const real = "faderina hardworks";
  setInterval(() => {
    if (Math.random() > 0.88) {
      const chars = real.split("");
      const j = Math.floor(Math.random() * chars.length);
      if (chars[j] !== " ") chars[j] = randPick(GLITCH_CHARS + CYRILLIC);
      const temp = chars.join("");
      el.textContent = temp;
      el.setAttribute("data-text", temp);
      setTimeout(() => {
        el.textContent = real;
        el.setAttribute("data-text", real);
      }, 70);
    }
  }, 200);
}

buildSocials();
refreshDiscordPresence();
setInterval(refreshDiscordPresence, 20000);
incrementPersistedViewCount();
initVolumeControl();
primeBgmPreload();
initClickRipples();
initEnterOverlay();
ticker();
footerHex();
titleShuffle();
tickAstClock();
setInterval(tickAstClock, 1000);
