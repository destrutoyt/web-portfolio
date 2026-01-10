document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".content-container");
  const buttons = document.querySelectorAll(".menu-container button[data-target]");

  if (!container || !buttons.length) return;

  const FADE_MS = 260;

  function getSections() {
    return Array.from(container.querySelectorAll(".content-item[data-section]"));
  }

  function restartAnimations(sectionEl) {
    const clone = sectionEl.cloneNode(true);
    sectionEl.replaceWith(clone);
    return clone;
  }

  function setActiveButton(target) {
    buttons.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.target === target);
    });
  }

  function showSection(target) {
    let sections = getSections();
    let current = sections.find(s => s.classList.contains("is-active"));
    let next = sections.find(s => s.dataset.section === target);

    if (!next || current === next) return;

    setActiveButton(target);

    if (current) {
      current.classList.remove("is-entering");
      current.classList.add("is-leaving");
    }

    next.classList.remove("hidden", "is-leaving", "is-active");
    next.classList.add("is-entering");
    next.offsetWidth;

    setTimeout(() => {
      if (current) {
        current.classList.remove("is-active", "is-leaving");
        current.classList.add("hidden");
      }

      next = restartAnimations(next);

      next.classList.remove("hidden");
      next.classList.add("is-entering");
      next.offsetWidth;
      next.classList.remove("is-entering");
      next.classList.add("is-active");
    }, FADE_MS);
  }

  function init() {
    const sections = getSections();
    sections.forEach(s => {
      s.classList.remove("is-active", "is-entering", "is-leaving");
      s.classList.add("hidden");
    });

    const defaultTarget = "education";
    const edu = sections.find(s => s.dataset.section === defaultTarget);

    if (edu) {
      edu.classList.remove("hidden");
      edu.classList.add("is-active");
    }

    setActiveButton(defaultTarget);
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.target));
  });

  init();
});
