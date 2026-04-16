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
  instagram: "https://www.instagram.com/fofomica",
  roblox: "https://www.roblox.com/users/4441112/profile",
  tiktok: "https://www.tiktok.com/@faderinaa"
};

const enterAudio = new Audio("/assets/audio/enter.mp3");
const bgAudio = new Audio("/assets/audio/bg.mp3");
bgAudio.loop = true;
const customCursor = createCustomCursor();

function playSequence() {
  enterAudio.currentTime = 0;
  bgAudio.pause();
  bgAudio.currentTime = 0;

  enterAudio.play().catch(() => {});
  bgAudio.play().catch(() => {});
}

function renderSite() {
  customCursor.setUpsideDown(state.isUpsideDown);

  app.innerHTML = `
    <div class="site-frame is-entering">
      <button class="rotate-btn" aria-label="Rotate site">
        <span class="rotate-btn__icon" aria-hidden="true">↻</span>
      </button>
      <main class="site-scene ${state.isUpsideDown ? "is-upside-down" : ""}">
        <section class="left-panel">
          <h1 class="site-title">faDeRINA</h1>
          <p class="site-tagline">I study what I cannot see and see what I cannot study.</p>
        </section>
        <img class="shinji-image" src="/assets/images/bg.png" alt="Shinji Hirako styled character" />
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
    customCursor.setUpsideDown(state.isUpsideDown);
  });

  const rotateIcon = rotateButton.querySelector(".rotate-btn__icon");
  rotateIcon.addEventListener("animationend", () => {
    rotateIcon.classList.remove("is-spinning");
  });

  createSocialIcons(iconsLayer, links);
}

function render() {
  if (!state.hasEntered) {
    customCursor.setUpsideDown(false);
    createEnterScreen(app, () => {
      state.hasEntered = true;
      render();
      playSequence();
    });
    return;
  }

  renderSite();
}

render();

function createCustomCursor() {
  const existingCursor = document.querySelector(".custom-cursor");
  if (existingCursor) {
    existingCursor.remove();
  }

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.innerHTML = `<div class="custom-cursor__image" aria-hidden="true"></div>`;
  document.body.append(cursor);

  const show = () => {
    cursor.classList.add("is-visible");
  };

  const hide = () => {
    cursor.classList.remove("is-visible");
  };

  const updatePosition = (event) => {
    if (event.pointerType === "touch") {
      hide();
      return;
    }

    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    show();
  };

  window.addEventListener("pointermove", updatePosition);
  window.addEventListener("pointerdown", updatePosition);
  window.addEventListener("pointerleave", hide);
  window.addEventListener("blur", hide);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hide();
    }
  });

  return {
    setUpsideDown(isUpsideDown) {
      cursor.classList.toggle("is-upside-down", isUpsideDown);
    }
  };
}
