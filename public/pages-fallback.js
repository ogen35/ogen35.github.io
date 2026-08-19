(() => {
  const start = () => {
    window.setTimeout(() => {
      if (document.documentElement.dataset.idoiReact === "ready") return;

      const cards = [...document.querySelectorAll(".signal-card")];
      const dots = [...document.querySelectorAll(".signal-dots [data-signal-index]")];
      const counter = document.querySelector(".signal-controls output");
      const previous = document.querySelector(".signal-prev");
      const next = document.querySelector(".signal-next");
      if (!cards.length) return;

      let active = Math.max(0, cards.findIndex((card) => card.classList.contains("is-active")));
      const show = (index) => {
        active = (index + cards.length) % cards.length;
        cards.forEach((card, cardIndex) => {
          const selected = cardIndex === active;
          card.classList.toggle("is-active", selected);
          card.setAttribute("aria-hidden", selected ? "false" : "true");
          const imageButton = card.querySelector("[data-signal-next]");
          if (imageButton) imageButton.tabIndex = selected ? 0 : -1;
        });
        dots.forEach((dot, dotIndex) => {
          const selected = dotIndex === active;
          dot.classList.toggle("is-active", selected);
          if (selected) dot.setAttribute("aria-current", "true");
          else dot.removeAttribute("aria-current");
        });
        if (counter) counter.textContent = `${String(active + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      };

      previous?.addEventListener("click", () => show(active - 1));
      next?.addEventListener("click", () => show(active + 1));
      dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.signalIndex))));
      cards.forEach((card) => card.querySelector("[data-signal-next]")?.addEventListener("click", () => show(active + 1)));
      document.documentElement.classList.add("idoi-static-fallback");
      show(active);
    }, 1600);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
