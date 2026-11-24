// ===== CONFIGURAÇÃO (edite aqui) =====
const WHATSAPP = "";                       // ex.: "5553999999999" (55 + DDD + número)
const PLANTIO = new Date("2026-11-28T10:00:00-03:00");
const QTD_BORBOLETAS = 3;                  // borboletas voando pela página
// =====================================

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const sky = document.getElementById("sky");
// paletas das asas (cores do degradê)
const GRADS = [
  ["#3fa9f5", "#9b5de5", "#f15bb5", "#fee440"], // arco-íris (como a logo)
  ["#ffd23f", "#f77f00"],                       // ipê amarelo
  ["#ff9ecf", "#c44ec9"],                       // rosa
  ["#7ae0f5", "#3a6ff0"],                       // azul
];
let bfId = 0;

function bfSVG(colors) {
  const id = "bfg" + (bfId++);
  const stops = colors.map((c, i) => `<stop offset="${i / (colors.length - 1)}" stop-color="${c}"/>`).join("");
  const wing = (side) => {
    const m = side === "r";
    const p = (d) => `<path d="${d}" fill="url(#${id})" stroke="#2b1d2e" stroke-width="2.2" stroke-linejoin="round"/>`;
    const L = [p("M50 40 C38 8 8 2 6 22 C4 36 24 46 50 40Z"), p("M50 42 C30 46 14 62 24 72 C34 80 48 60 50 42Z"),
               '<circle cx="14" cy="18" r="2" fill="#fff"/><circle cx="21" cy="12" r="1.6" fill="#fff"/>'].join("");
    return `<g class="wing"><g ${m ? 'transform="translate(100 0) scale(-1 1)"' : ""}>${L}</g></g>`;
  };
  return `<svg viewBox="0 0 100 80"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs>
    ${wing("l")}${wing("r")}
    <path d="M49 31 C46 22 42 18 38 16 M51 31 C54 22 58 18 62 16" stroke="#2b1d2e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <rect x="48.4" y="29" width="3.2" height="30" rx="1.6" fill="#2b1d2e"/></svg>`;
}

function makeBf(cls, colors) {
  const d = document.createElement("div");
  d.className = "bf " + cls;
  d.style.setProperty("--flap", (0.7 + Math.random() * 0.5).toFixed(2) + "s");
  d.innerHTML = bfSVG(colors || GRADS[Math.floor(Math.random() * GRADS.length)]);
  sky.appendChild(d);
  return d;
}

// ---- WhatsApp ----
document.querySelectorAll("[data-wa]").forEach(a => {
  if (WHATSAPP) {
    a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(a.dataset.wa);
    a.target = "_blank"; a.rel = "noopener";
  }
});

// ---- Contagem regressiva ----
const cd = document.getElementById("countdown");
function tick() {
  const diff = PLANTIO - new Date();
  if (diff <= 0) { cd.innerHTML = ""; return; }
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
  cd.innerHTML = [[d, "dias"], [h, "horas"], [m, "min"]].map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("");
}
tick(); setInterval(tick, 30000);

// ---- Topo fica sólido ao rolar ----
const header = document.getElementById("top");
const onScrollTop = () => header.classList.toggle("solid", scrollY > 40);
addEventListener("scroll", onScrollTop, { passive: true }); onScrollTop();

// ---- Aparecer ao rolar ----
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---- Ipês ilustrados na abertura ----
function rng(seed) {
  return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const R = rng(11);
const FLORES = {
  amarelo: ["#f6c21b", "#ffd84d", "#f2b400", "#ffe27a"],
  rosa: ["#e86aa6", "#f39cc6", "#d94f8f", "#f7b6d2"],
};
function ipe(x, base, h, tipo) {
  const w = h * .62, cy = base - h * .7, tw = h * .045, f = n => n.toFixed(1);
  let s = `<g class="tree" style="--sw:${(7 + R() * 5).toFixed(1)}s">`;
  s += `<path d="M${f(x - tw)} ${base} C${f(x - tw * .5)} ${f(base - h * .3)} ${f(x - tw * .3)} ${f(base - h * .45)} ${f(x)} ${f(cy)} C${f(x + tw * .3)} ${f(base - h * .45)} ${f(x + tw * .5)} ${f(base - h * .3)} ${f(x + tw)} ${base}Z" fill="#6b4a33"/>`;
  s += `<path d="M${f(x)} ${f(base - h * .4)} Q${f(x - w * .2)} ${f(cy + h * .06)} ${f(x - w * .36)} ${f(cy - h * .03)} M${f(x)} ${f(base - h * .47)} Q${f(x + w * .2)} ${f(cy + h * .05)} ${f(x + w * .34)} ${f(cy - h * .06)} M${f(x)} ${f(cy + h * .05)} L${f(x + w * .03)} ${f(cy - h * .17)}" stroke="#6b4a33" stroke-width="${f(tw * .7)}" fill="none" stroke-linecap="round"/>`;
  const verdes = ["#5f9a4a", "#4f8a3e", "#78ad5c"];
  for (let i = 0; i < 4; i++) {
    const a = R() * Math.PI * 2, r = Math.sqrt(R());
    s += `<circle cx="${f(x + Math.cos(a) * r * w * .3)}" cy="${f(cy + Math.sin(a) * r * h * .12)}" r="${f(h * (.05 + R() * .04))}" fill="${verdes[i % 3]}" opacity=".55"/>`;
  }
  // flores: muitas, em cachos, formando a copa do ipê
  const pal = FLORES[tipo], n = Math.round(h * .55);
  for (let i = 0; i < n; i++) {
    const a = R() * Math.PI * 2, r = Math.pow(R(), .7);
    s += `<circle class="fl" style="--t:${(R() * .8).toFixed(2)}" cx="${f(x + Math.cos(a) * r * w * .55)}" cy="${f(cy - h * .04 + Math.sin(a) * r * h * .24)}" r="${f(h * (.035 + R() * .04))}" fill="${pal[i % pal.length]}"/>`;
  }
  return s + "</g>";
}
const scene = document.getElementById("scene");
const ARVORES = [
  [610, 385, 130, "rosa"], [835, 385, 140, "amarelo"], [440, 380, 185, "amarelo"], [1010, 380, 200, "rosa"],
  [270, 380, 240, "rosa"], [1360, 380, 250, "rosa"], [1180, 380, 290, "amarelo"], [90, 380, 310, "amarelo"],
];
document.getElementById("trees").innerHTML = ARVORES.map(a => ipe(...a)).join("");

// as flores desabrocham ao carregar e ao rolar a página
const flores = [...scene.querySelectorAll(".fl")].map(el => ({ el, t: +el.style.getPropertyValue("--t"), s: -1 }));
let bloomBase = 0, pending = false;
function setBloom() {
  pending = false;
  const b = reduce ? 1 : Math.min(1.05, bloomBase + scrollY / (innerHeight * .7) * .5);
  for (const f of flores) {
    const s = Math.round(Math.max(0, Math.min(1, (b - f.t) * 5)) * 20) / 20;
    if (s !== f.s) { f.s = s; f.el.style.transform = `scale(${s})`; }
  }
}
addEventListener("scroll", () => { if (!pending) { pending = true; requestAnimationFrame(setBloom); } }, { passive: true });
setBloom();
// desabrocham suavemente logo depois de abrir a página
requestAnimationFrame(() => requestAnimationFrame(() => { bloomBase = .7; setBloom(); }));

// ---- Vaga-lumes na seção da floresta ----
const ff = document.querySelector(".fireflies");
for (let i = 0; i < 22; i++) {
  const d = document.createElement("i");
  d.className = "ff";
  d.style.left = Math.random() * 100 + "%";
  d.style.top = Math.random() * 100 + "%";
  d.style.setProperty("--x", (Math.random() * 120 - 60) + "px");
  d.style.setProperty("--y", (Math.random() * 120 - 60) + "px");
  d.style.setProperty("--d", (8 + Math.random() * 10) + "s");
  d.style.animationDelay = `${-Math.random() * 10}s, ${-Math.random() * 3}s`;
  ff.appendChild(d);
}

if (!reduce) {
  // ---- Pétalas de ipê no topo ----
  const petals = document.querySelector(".petals");
  const pc = ["#f2b705", "#f7d34a", "#e87aa3", "#f3a6c3"];
  for (let i = 0; i < 10; i++) {
    const p = document.createElement("i");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = pc[i % pc.length];
    p.style.animationDuration = 14 + Math.random() * 12 + "s";
    p.style.animationDelay = -Math.random() * 20 + "s";
    p.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    petals.appendChild(p);
  }

  // ---- Borboletas voando devagar ----
  const amb = Array.from({ length: QTD_BORBOLETAS }, (_, i) => ({
    el: makeBf("amb", GRADS[i % GRADS.length]),
    t: Math.random() * 100, sp: .00012 + Math.random() * .0001,
    ax: .3 + Math.random() * .15, ay: .2 + Math.random() * .15,
    cx: .25 + i * .25, cy: .3 + Math.random() * .4, ph: Math.random() * 6,
    s: .8 + Math.random() * .4
  }));
  let last = performance.now();
  function loop(ts) {
    const W = innerWidth, H = innerHeight, dt = Math.min(ts - last, 50); last = ts;
    for (const b of amb) {
      b.t += b.sp * dt;
      const x = (b.cx + Math.sin(b.t * 2 + b.ph) * b.ax) * W;
      const y = (b.cy + Math.sin(b.t * 3 + b.ph) * b.ay + Math.sin(b.t * 11) * .015) * H;
      const rot = Math.cos(b.t * 2 + b.ph) * 20;
      b.el.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg) scale(${b.s})`;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // ---- Borboleta que segue o cursor (só com mouse) ----
  if (matchMedia("(pointer: fine)").matches) {
    const c = makeBf("cursor", GRADS[0]);
    let mx = -100, my = -100, x = -100, y = -100;
    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
    (function follow() {
      x += (mx - x) * .06; y += (my - y) * .06;
      const rot = Math.max(-30, Math.min(30, (mx - x) * .4));
      c.style.transform = `translate(${x + 16}px,${y + 16}px) rotate(${rot}deg)`;
      requestAnimationFrame(follow);
    })();
  }

  // ---- Clique/toque: solta duas borboletinhas ----
  addEventListener("pointerdown", e => {
    if (e.target.closest("a,button")) return;
    for (let i = 0; i < 2; i++) {
      const b = makeBf("spawn"); b.style.width = "24px"; b.style.height = "19px";
      const dx = (Math.random() - .5) * 200;
      b.animate([
        { transform: `translate(${e.clientX}px,${e.clientY}px) scale(.5)`, opacity: 1 },
        { transform: `translate(${e.clientX + dx}px,${e.clientY - 160 - Math.random() * 80}px) scale(1)`, opacity: 0 }
      ], { duration: 3200 + Math.random() * 1200, easing: "ease-out" }).onfinish = () => b.remove();
    }
  });
}
