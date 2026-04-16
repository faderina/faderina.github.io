import { createEnterScreen } from "./components/enterScreen.js";
import { createSocialIcons } from "./components/socialIcons.js";
import "./styles/main.css";

const app = document.querySelector("#app");

const state = {
  hasEntered: false,
  isUpsideDown: true
};

const links = {
  github: "#",
  x: "#",
  discord: "#",
  instagram: "#",
  roblox: "#",
  tiktok: "#"
};

const enterAudio = new Audio("/assets/audio/enter.mp3");
const bgAudio = new Audio("/assets/audio/bg.mp3");
bgAudio.loop = true;

function playSequence() {
  enterAudio.currentTime = 0;
  bgAudio.pause();
  bgAudio.currentTime = 0;

  enterAudio.play().catch(() => {});
  bgAudio.play().catch(() => {});
}

function renderSite() {
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

render();
