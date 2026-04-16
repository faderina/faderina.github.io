const iconConfig = [
  { name: "github", top: "22%", left: "6%" },
  { name: "x", top: "24%", left: "29%" },
  { name: "discord", top: "46%", left: "21%" },
  { name: "instagram", top: "57%", left: "5%" },
  { name: "roblox", top: "75%", left: "11%" },
  { name: "tiktok", top: "75%", left: "30%" }
];

export function createSocialIcons(container, links) {
  const iconsMarkup = iconConfig
    .map(
      (icon) => `
        <a
          class="social-icon ${icon.name}"
          style="top:${icon.top};left:${icon.left};"
          href="${links[icon.name] || "#"}"
          target="_blank"
          rel="noreferrer noopener"
          draggable="false"
          aria-label="${icon.name}"
        >
          <img src="/assets/images/icons/${icon.name}.png" alt="${icon.name} icon" draggable="false" />
        </a>
      `
    )
    .join("");

  container.innerHTML = iconsMarkup;
  container.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  const states = [...container.querySelectorAll(".social-icon")].map((icon) =>
    createIconState(icon, container)
  );

  window.addEventListener("resize", () => {
    states.forEach((state) => clampToBounds(state, container));
  });

  requestAnimationFrame(function tick() {
    states.forEach((state) => integrate(state, container));
    resolveCollisions(states);
    states.forEach(paint);
    requestAnimationFrame(tick);
  });
}

function createIconState(icon, container) {
  const state = {
    icon,
    x: icon.offsetLeft,
    y: icon.offsetTop,
    targetX: icon.offsetLeft,
    targetY: icon.offsetTop,
    vx: 0,
    vy: 0,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    isDragging: false,
    hasMoved: false,
    radius: Math.max(icon.offsetWidth, icon.offsetHeight) * 0.45
  };

  clampToBounds(state, container);
  paint(state);

  const onPointerDown = (event) => {
    if (event.button !== 2) {
      return;
    }

    event.preventDefault();
    const rect = icon.getBoundingClientRect();
    state.isDragging = true;
    state.hasMoved = false;
    state.pointerOffsetX = event.clientX - rect.left;
    state.pointerOffsetY = event.clientY - rect.top;
    icon.setPointerCapture(event.pointerId);
    icon.classList.add("is-dragging");
  };

  const onPointerMove = (event) => {
    if (!state.isDragging) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    state.targetX = event.clientX - containerRect.left - state.pointerOffsetX;
    state.targetY = event.clientY - containerRect.top - state.pointerOffsetY;

    if (Math.abs(state.targetX - state.x) > 3 || Math.abs(state.targetY - state.y) > 3) {
      state.hasMoved = true;
    }

    const bounds = getBounds(state, container);
    state.targetX = Math.max(0, Math.min(state.targetX, bounds.maxX));
    state.targetY = Math.max(0, Math.min(state.targetY, bounds.maxY));
  };

  const onPointerEnd = (event) => {
    if (!state.isDragging) {
      return;
    }

    state.isDragging = false;
    icon.classList.remove("is-dragging");
    icon.releasePointerCapture(event.pointerId);
  };

  const onClick = (event) => {
    if (!state.hasMoved) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    state.hasMoved = false;
  };

  const onDragStart = (event) => {
    event.preventDefault();
  };

  icon.addEventListener("pointerdown", onPointerDown);
  icon.addEventListener("pointermove", onPointerMove);
  icon.addEventListener("pointerup", onPointerEnd);
  icon.addEventListener("pointercancel", onPointerEnd);
  icon.addEventListener("click", onClick);
  icon.addEventListener("dragstart", onDragStart);

  return state;
}

function getBounds(state, container) {
  return {
    maxX: container.clientWidth - state.icon.offsetWidth,
    maxY: container.clientHeight - state.icon.offsetHeight
  };
}

function clampToBounds(state, container) {
  const bounds = getBounds(state, container);
  state.x = Math.max(0, Math.min(state.x, bounds.maxX));
  state.y = Math.max(0, Math.min(state.y, bounds.maxY));
  state.targetX = Math.max(0, Math.min(state.targetX, bounds.maxX));
  state.targetY = Math.max(0, Math.min(state.targetY, bounds.maxY));
}

function integrate(state, container) {
  if (state.isDragging) {
    // Spring-like follow while dragging creates the slippery feel.
    state.vx += (state.targetX - state.x) * 0.2;
    state.vy += (state.targetY - state.y) * 0.2;
    state.vx *= 0.58;
    state.vy *= 0.58;
  } else {
    state.vx *= 0.94;
    state.vy *= 0.94;
  }

  state.x += state.vx;
  state.y += state.vy;

  const bounds = getBounds(state, container);
  if (state.x < 0) {
    state.x = 0;
    state.vx *= -0.35;
  } else if (state.x > bounds.maxX) {
    state.x = bounds.maxX;
    state.vx *= -0.35;
  }

  if (state.y < 0) {
    state.y = 0;
    state.vy *= -0.35;
  } else if (state.y > bounds.maxY) {
    state.y = bounds.maxY;
    state.vy *= -0.35;
  }
}

function resolveCollisions(states) {
  for (let i = 0; i < states.length; i += 1) {
    for (let j = i + 1; j < states.length; j += 1) {
      const a = states[i];
      const b = states[j];

      const aCx = a.x + a.icon.offsetWidth / 2;
      const aCy = a.y + a.icon.offsetHeight / 2;
      const bCx = b.x + b.icon.offsetWidth / 2;
      const bCy = b.y + b.icon.offsetHeight / 2;

      const dx = bCx - aCx;
      const dy = bCy - aCy;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const minDist = a.radius + b.radius;

      if (dist >= minDist) {
        continue;
      }

      const overlap = minDist - dist;
      const nx = dx / dist;
      const ny = dy / dist;

      if (a.isDragging && !b.isDragging) {
        b.x += nx * overlap;
        b.y += ny * overlap;
        b.vx += nx * overlap * 0.16;
        b.vy += ny * overlap * 0.16;
      } else if (!a.isDragging && b.isDragging) {
        a.x -= nx * overlap;
        a.y -= ny * overlap;
        a.vx -= nx * overlap * 0.16;
        a.vy -= ny * overlap * 0.16;
      } else {
        const half = overlap * 0.5;
        a.x -= nx * half;
        a.y -= ny * half;
        b.x += nx * half;
        b.y += ny * half;

        a.vx -= nx * half * 0.12;
        a.vy -= ny * half * 0.12;
        b.vx += nx * half * 0.12;
        b.vy += ny * half * 0.12;
      }
    }
  }
}

function paint(state) {
  state.icon.style.left = `${state.x}px`;
  state.icon.style.top = `${state.y}px`;
}
