import { createEnterScreen } from "./components/enterScreen.js";
import { createSocialIcons } from "./components/socialIcons.js";
import "./styles/main.css";

const app = document.querySelector("#app");

const state = {
  hasEntered: false,
  isUpsideDown: true
};

const links = {
  github: "https://github.com/faderina",
  x: "https://x.com/faderinaa",
  discord: "discord://-/users/748611198848860292",
  instagram: "https://instagram.com/fofomica",
  roblox: "https://www.roblox.com/users/4441112/profile",
  tiktok: "https://www.tiktok.com/@faderinaa"
};

const enterAudio = new Audio("/assets/audio/enter.mp3");
const bgAudio = new Audio("/assets/audio/bg.mp3");
bgAudio.loop = true;
bgAudio.volume = 0.4;

function playSequence() {
  enterAudio.currentTime = 0;
  bgAudio.pause();
  bgAudio.currentTime = 0;

  enterAudio.play().catch(() => { });
  bgAudio.play().catch(() => { });
}

function renderSite() {
  app.innerHTML = `
    <div class="site-frame is-entering">
      <button class="rotate-btn" aria-label="Rotate site">
        <span class="rotate-btn__icon" aria-hidden="true">↻</span>
      </button>
      <main class="site-scene ${state.isUpsideDown ? "is-upside-down" : ""}">
        <section class="left-panel">
          <h1 class="site-title">Faderina</h1>
          <p class="site-tagline">I study what I cannot see and see what I cannot study.</p>
          <p class="site-tagline is-barcode">I study what I cannot see and see what I cannot study.</p>
        </section>
        <picture class="shinji-image">
          <source srcset="/assets/images/bg-mobile.png" media="(max-width: 768px)" />
          <img src="/assets/images/bg.png" alt="Shinji Hirako styled character" />
        </picture>
        <div class="icons-layer"></div>
      </main>
    </div>
  `;

  const frame = app.querySelector(".site-frame");
  const rotateButton = app.querySelector(".rotate-btn");
  const scene = app.querySelector(".site-scene");
  const iconsLayer = app.querySelector(".icons-layer");

  app.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  requestAnimationFrame(() => {
    frame.classList.add("is-entered");
  });

  rotateButton.addEventListener("click", () => {
    const icon = rotateButton.querySelector(".rotate-btn__icon");
    icon.classList.remove("is-spinning");
    // Restart animation reliably.
    void icon.offsetWidth;
    icon.classList.add("is-spinning");

    state.isUpsideDown = !state.isUpsideDown;
    scene.classList.toggle("is-upside-down", state.isUpsideDown);
  });

  const rotateIcon = rotateButton.querySelector(".rotate-btn__icon");
  rotateIcon.addEventListener("animationend", () => {
    rotateIcon.classList.remove("is-spinning");
  });

  createSocialIcons(iconsLayer, links);
}

function render() {
  if (!state.hasEntered) {
    createEnterScreen(app, () => {
      state.hasEntered = true;
      render();
      playSequence();
    });
    return;
  }

  renderSite();
}

// Custom Cursor Logic
const customCursor = document.createElement("div");
customCursor.className = "custom-cursor";
customCursor.innerHTML = `<img src="/assets/images/cursor.png" alt="Custom Cursor" />`;
document.body.appendChild(customCursor);

window.addEventListener("pointermove", (e) => {
  let x = e.clientX;
  let y = e.clientY;

  if (state.isUpsideDown) {
    x = window.innerWidth - x;
    y = window.innerHeight - y;
  }

  customCursor.style.left = `${x}px`;
  customCursor.style.top = `${y}px`;
});

// Update cursor rotation whenever site state changes
function updateCursorRotation() {
  customCursor.classList.toggle("is-upside-down", state.isUpsideDown);
}

// Wrap the original rotate logic to also update cursor
const originalRenderSite = renderSite;
renderSite = function () {
  originalRenderSite();
  const rotateButton = app.querySelector(".rotate-btn");
  if (rotateButton) {
    rotateButton.addEventListener("click", updateCursorRotation);
  }
  updateCursorRotation();
};

// Disable context menu globally
window.addEventListener("contextmenu", (e) => e.preventDefault());

// Input Redirection & Hover Logic (allows interacting when controls are inverted)
let currentHovered = null;

const handleInvertedInput = (e) => {
  const isMobile = window.innerWidth <= 768;
  if (!state.hasEntered || isMobile || !state.isUpsideDown || !e.isTrusted) return;

  // We only redirect discrete clicks/downs, not moves (handled in pointermove)
  if (e.type === "pointermove") return;

  e.stopImmediatePropagation();

  const x = window.innerWidth - e.clientX;
  const y = window.innerHeight - e.clientY;

  const target = document.elementFromPoint(x, y);
  if (target) {
    const EventClass = e instanceof PointerEvent ? PointerEvent : MouseEvent;
    const redirectedEvent = new EventClass(e.type, {
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      button: e.button,
      buttons: e.buttons,
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      isPrimary: e.isPrimary,
      width: e.width,
      height: e.height,
      pressure: e.pressure,
      tiltX: e.tiltX,
      tiltY: e.tiltY,
      bubbles: true,
      cancelable: true,
      view: window
    });

    target.dispatchEvent(redirectedEvent);
  }
};

window.addEventListener("pointermove", (e) => {
  let x = e.clientX;
  let y = e.clientY;

  if (state.hasEntered && state.isUpsideDown) {
    x = window.innerWidth - x;
    y = window.innerHeight - y;

    // Handle virtual hover
    const target = document.elementFromPoint(x, y);
    const hoverable = target?.closest(".social-icon, .rotate-btn, .enter-text");
    if (hoverable !== currentHovered) {
      currentHovered?.classList.remove("is-hovered");
      hoverable?.classList.add("is-hovered");
      currentHovered = hoverable;
    }
  } else {
    if (currentHovered) {
      currentHovered.classList.remove("is-hovered");
      currentHovered = null;
    }
  }

  customCursor.style.left = `${x}px`;
  customCursor.style.top = `${y}px`;
});

["pointerdown", "pointerup", "click"].forEach((type) => {
  window.addEventListener(type, handleInvertedInput, true);
});

render();
