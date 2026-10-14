(() => {
  let animation;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.tutorialPage = {
    async leave() {
      animation?.cancel();
      const el = document.querySelector('main.main-content');
      if (!el || reduced()) return;
      animation = el.animate({ opacity: [1, 0], transform: ['translateY(0)', 'translateY(-4px)'] }, { duration: 100, fill: 'forwards', easing: 'ease-out' });
      try { await animation.finished; } catch {}
    },
    enter() {
      animation?.cancel();
      const el = document.querySelector('main.main-content');
      if (!el || reduced()) return;
      animation = el.animate({ opacity: [0, 1], transform: ['translateY(4px)', 'translateY(0)'] }, { duration: 160, easing: 'ease-out' });
    },
    reset() { animation?.cancel(); }
  };
})();
