document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".project-grid");
  const filterBtns = document.querySelectorAll(".filter-button[data-filter]");
  const cards = () => Array.from(document.querySelectorAll(".project-card[data-category]"));

  if (!grid || !filterBtns.length) return;

  const FADE_MS = 260;

  // ---------- Dropdown ----------
  function closeAll(except = null) {
    cards().forEach(card => {
      if (card === except) return;
      card.classList.remove("is-open");
      const head = card.querySelector(".project-head");
      if (head) head.setAttribute("aria-expanded", "false");
    });
  }

  grid.addEventListener("click", (e) => {
    const head = e.target.closest(".project-head");
    if (!head) return;

    const card = head.closest(".project-card");
    if (!card) return;

    const willOpen = !card.classList.contains("is-open");
    closeAll(willOpen ? card : null);

    card.classList.toggle("is-open", willOpen);
    head.setAttribute("aria-expanded", String(willOpen));
  });

  // ---------- Filtering w/ fade (no layout jump) ----------
  function setActiveFilterButton(filter) {
    filterBtns.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.filter === filter);
    });
  }

  function filterCards(filter) {
    const all = cards();
    const show = (card) => filter === "all" || card.dataset.category === filter;

    const currentlyVisible = all.filter(c => !c.classList.contains("hidden"));
    const nextVisible = all.filter(show);

    // If nothing changes, bail
    const same =
      currentlyVisible.length === nextVisible.length &&
      currentlyVisible.every(c => nextVisible.includes(c));
    if (same) return;

    // close dropdowns before switching
    closeAll();
    setActiveFilterButton(filter);

    // 1) fade out ONLY currently visible
    currentlyVisible.forEach(c => {
      c.classList.remove("is-entering");
      c.classList.add("is-leaving");
    });

    // 2) after fade out, hide them (display:none), then reveal new ones and fade in
    setTimeout(() => {
      currentlyVisible.forEach(c => {
        c.classList.remove("is-active", "is-leaving");
        c.classList.add("hidden");
      });

      // show target cards *after* old ones are gone (prevents spacing flash)
      nextVisible.forEach(c => {
        c.classList.remove("hidden", "is-leaving", "is-active");
        c.classList.add("is-entering");
      });

      // force reflow so entering state applies
      grid.offsetWidth;

      // trigger fade in
      nextVisible.forEach(c => {
        c.classList.remove("is-entering");
        c.classList.add("is-active");
      });
    }, FADE_MS);
  }

  // init state
  function init() {
    cards().forEach(c => {
      c.classList.remove("is-entering", "is-leaving");
      c.classList.add("is-active");
      c.classList.remove("hidden");
    });
    setActiveFilterButton("all");
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => filterCards(btn.dataset.filter));
  });

  init();
});
