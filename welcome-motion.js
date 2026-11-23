// Bend the sleeve and hand together. The inner edge stays anchored at the shoulder.
(async () => {
  const photo = document.getElementById('portrait');
  const canvas = document.getElementById('motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  try { await photo.decode(); } catch { return; }
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const anchor = 85;
  const pad = 20;
  const started = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - started) / 3800);
    if (reduced.matches || t >= 1) {
      photo.hidden = false;
      canvas.hidden = true;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photo, pad, 0);
    ctx.clearRect(0, 161, anchor + pad, 135);
    const bend = 24 * Math.sin(Math.PI * Math.min(1, t / .62)) ** 2
      - 6 * Math.sin(2 * Math.PI * t) ** 2;
    for (let y = 161; y < 296; y++) {
      const offset = bend * Math.sin(Math.PI * (y - 161) / 135) ** 2;
      ctx.drawImage(photo, 0, y, anchor, 1, pad + offset, y, anchor - offset, 1);
    }
    requestAnimationFrame(frame);
  }
  photo.parentElement.classList.add('playing');
  photo.hidden = true;
  canvas.hidden = false;
  frame(started);
})();

const welcome = document.querySelector('.welcome');
const closing = document.querySelector('.closing');
const greeting = document.querySelector('.greeting');
const wash = document.querySelector('.wash');
function finishWelcome() {
  if (greeting.contains(document.activeElement)) closing.querySelector('a').dataset.restoreFocus = 'yes';
  greeting.inert = true;
  greeting.style.visibility = 'hidden';
  welcome.classList.add('finished');
  closing.querySelector('[data-restore-focus]')?.focus();
}
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  finishWelcome();
} else {
  const mascot = document.querySelector('.turk').getBoundingClientRect();
  wash.style.left = (mascot.left + mascot.width * .76) + 'px';
  wash.style.top = (mascot.top + mascot.height * .47) + 'px';
  wash.addEventListener('animationend', finishWelcome, { once: true });
  welcome.classList.add('rolling');
  setTimeout(() => { if (!welcome.classList.contains('finished')) finishWelcome(); }, 4900);
}
