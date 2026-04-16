export function createEnterScreen(root, onEnter) {
  root.innerHTML = `
    <div class="enter-screen" role="button" tabindex="0" aria-label="Enter site">
      <span class="enter-text">入力</span>
    </div>
  `;

  const screen = root.querySelector(".enter-screen");

  const handleEnter = () => {
    onEnter();
  };

  screen.addEventListener("click", handleEnter);
  screen.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleEnter();
    }
  });
}
