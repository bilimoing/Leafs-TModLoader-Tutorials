(() => {
  let started = false, timer;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const random = (a, b) => a + Math.random() * (b - a);
  function spawn() {
    const tree = document.querySelector('.woodland-tree');
    const layer = document.getElementById('wind-layer');
    if (!tree || !layer || document.hidden || motion.matches || layer.childElementCount >= (innerWidth < 800 ? 4 : 8)) return;
    const box = tree.getBoundingClientRect(), area = layer.parentElement.getBoundingClientRect();
    const angle = random(0, Math.PI * 2), radius = Math.sqrt(Math.random());
    const leaf = document.createElement('span');
    leaf.className = 'wind-particle';
    leaf.style.left = box.left + box.width * (.49 + Math.cos(angle) * .31 * radius) - area.left + 'px';
    leaf.style.top = box.top + box.height * (.34 + Math.sin(angle) * .2 * radius) - area.top + 'px';
    const img = document.createElement('img');
    img.src = new URL('images/leaf.svg', document.baseURI); img.alt = '';
    leaf.append(img); layer.append(leaf);
    const drift = random(240, 620), drop = random(380, 720), wobble = random(25, 90), rotation = random(-180, 180), spin = random(300, 420);
    const frames = Array.from({ length: 17 }, (_, i) => {
      const t = i / 16;
      return { transform: `translate(${-drift * t + Math.sin(t * Math.PI * 5) * wobble * t}px,${drop * t + Math.sin(t * Math.PI * 3) * 20}px) rotate(${rotation + t * spin}deg)`, opacity: i === 0 || i === 16 ? 0 : .7, offset: t };
    });
    const animation = leaf.animate(frames, { duration: random(9000, 16000), easing: 'linear' });
    animation.finished.then(() => leaf.remove()).catch(() => leaf.remove());
  }
  function schedule() {
    clearTimeout(timer);
    if (!started || document.hidden || motion.matches) return;
    spawn(); timer = setTimeout(schedule, random(1500, 2600));
  }
  function update() {
    const layer = document.getElementById('wind-layer');
    if (document.hidden || motion.matches) {
      clearTimeout(timer);
      layer?.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
      layer?.replaceChildren();
    } else schedule();
  }
  window.tutorialWind = { start() {
    if (started) return;
    started = true; schedule();
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
  } };
})();
