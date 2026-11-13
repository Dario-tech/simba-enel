// SIMBA · Mascota: al hacer clic, Simba avanza por el camino y va creciendo (cachorro → joven → adulto).
// Script clásico: comparte el ámbito global con el resto de js/*.js (ver orden en index.html).

const SIMBA_WALK_MS = 9000;
const SIMBA_YEARS = 6;
const SIMBA_STAGES = [
    { upTo: 1 / 3, name: "Cachorro", x0: 24, len: 42, h: 21, top: 30, legW: 6, hr: 15, maneR: 0, fur: "#f6d98c", dark: "#dcae55", tuft: "#c98a2c", tail: 10, eye: 0.17 },
    { upTo: 2 / 3, name: "Joven", x0: 20, len: 50, h: 24, top: 28, legW: 7, hr: 14, maneR: 19, fur: "#eab954", dark: "#c68a30", tuft: "#9a5a22", maneC: "#b9772a", maneC2: "#cf9040", tail: 14, eye: 0.13 },
    { upTo: Infinity, name: "Adulto", x0: 16, len: 58, h: 27, top: 25, legW: 8, hr: 14, maneR: 25, fur: "#dfa54a", dark: "#b5782a", tuft: "#5e2f12", maneC: "#7a4119", maneC2: "#9a5a22", tail: 17, eye: 0.11 },
];

function simbaStage(p) { return SIMBA_STAGES.findIndex((s) => p < s.upTo); }

function simbaAge(p) { return Math.round(Math.min(1, Math.max(0, p)) * SIMBA_YEARS); }

function simbaLabel(p) {
    const years = simbaAge(p);
    return `${SIMBA_STAGES[simbaStage(p)].name} · ${years} ${years === 1 ? "año" : "años"}`;
}

function simbaLionSvg(i) {
    const s = SIMBA_STAGES[i], f = (n) => +n.toFixed(1);
    const hx = s.x0 + s.len - 2, hy = s.top + [4, 0, -1][i], hr = s.hr;
    const legTop = s.top + s.h - 9, legH = 58 - legTop;
    const back = s.x0 + 5, front = s.x0 + s.len - s.legW * 2 - 7;
    const leg = (x, cls, color) => `<g class="leg ${cls}"><rect x="${x}" y="${legTop}" width="${s.legW}" height="${legH}" rx="${s.legW / 2}" fill="${color}"/></g>`;
    const tx = s.x0 + 3, ty = s.top + 7;
    const ex = hx + hr * 0.32, ey = hy - hr * 0.15;
    const mane = s.maneR
        ? `<circle cx="${hx - 4}" cy="${hy + 2}" r="${s.maneR}" fill="${s.maneC}"/><circle cx="${hx - 3}" cy="${hy + 1}" r="${s.maneR - 6}" fill="${s.maneC2}"/>`
        : "";
    const spots = i === 0 ? [[s.x0 + 12, s.top + 8], [s.x0 + 22, s.top + 12], [s.x0 + 30, s.top + 7]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${s.dark}" opacity=".55"/>`).join("") : "";
    return `<svg class="lion lion-${i}" viewBox="0 0 120 64" focusable="false" aria-hidden="true">
<ellipse cx="${f(s.x0 + s.len / 2)}" cy="59.5" rx="${f(s.len * 0.55)}" ry="1.9" fill="rgba(0,0,0,.14)"/>
${leg(back, "l1", s.dark)}${leg(front, "l2", s.dark)}
<g class="tail"><path d="M${tx} ${ty} q ${f(-s.tail * 0.7)} -3 ${-s.tail} ${f(-s.tail * 0.9)}" fill="none" stroke="${s.fur}" stroke-width="4" stroke-linecap="round"/><circle cx="${tx - s.tail}" cy="${f(ty - s.tail * 0.9)}" r="4.3" fill="${s.tuft}"/></g>
<rect x="${s.x0}" y="${s.top}" width="${s.len}" height="${s.h}" rx="${s.h / 2}" fill="${s.fur}"/>${spots}
${leg(back + s.legW + 2, "l3", s.fur)}${leg(front + s.legW + 2, "l4", s.fur)}
${mane}
<circle cx="${hx - hr * 0.4}" cy="${f(hy - hr * 0.85)}" r="${f(hr * 0.3)}" fill="${s.fur}"/><circle cx="${f(hx + hr * 0.25)}" cy="${f(hy - hr * 0.95)}" r="${f(hr * 0.3)}" fill="${s.fur}"/>
<circle cx="${hx}" cy="${hy}" r="${hr}" fill="${s.fur}"/>
<circle cx="${f(hx - hr * 0.4)}" cy="${f(hy - hr * 0.85)}" r="${f(hr * 0.15)}" fill="#f0a6a0"/><circle cx="${f(hx + hr * 0.25)}" cy="${f(hy - hr * 0.95)}" r="${f(hr * 0.15)}" fill="#f0a6a0"/>
<ellipse cx="${f(hx + hr * 0.5)}" cy="${f(hy + hr * 0.38)}" rx="${f(hr * 0.55)}" ry="${f(hr * 0.4)}" fill="#fdecc4"/>
<circle cx="${f(ex)}" cy="${f(ey)}" r="${f(hr * s.eye)}" fill="#1f1a17"/><circle cx="${f(ex + 0.7)}" cy="${f(ey - 0.8)}" r=".8" fill="#fff"/>
<ellipse cx="${f(hx + hr * 0.86)}" cy="${f(hy + hr * 0.08)}" rx="${f(hr * 0.17)}" ry="${f(hr * 0.12)}" fill="#5a3b2b"/>
<path d="M${f(hx + hr * 0.86)} ${f(hy + hr * 0.2)} q ${f(-hr * 0.1)} ${f(hr * 0.3)} ${f(-hr * 0.4)} ${f(hr * 0.32)}" fill="none" stroke="#5a3b2b" stroke-width="1.1" stroke-linecap="round"/>
</svg>`;
}

function initSimbaWalk() {
    const box = document.getElementById("simba-walk");
    if (!box) return;
    const btn = document.getElementById("simba-btn"), age = document.getElementById("simba-age");
    box.querySelector(".simba-lions").innerHTML = SIMBA_STAGES.map((_, i) => simbaLionSvg(i)).join("");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let p = 0, running = false, last = 0, raf = 0, shownStage = 0;

    function paint() {
        const stage = simbaStage(p);
        box.style.setProperty("--p", String(p));
        box.dataset.stage = String(stage);
        box.dataset.done = String(p >= 1);
        box.classList.toggle("walking", running);
        if (stage !== shownStage) {
            shownStage = stage;
            box.classList.remove("pop"); void box.offsetWidth; box.classList.add("pop");
        }
        const idle = p === 0 && !running;
        age.textContent = idle ? "Haz clic en Simba" : simbaLabel(p);
        btn.setAttribute("aria-label", `Simba, ${simbaLabel(p)}. ${p >= 1 ? "Pulsa para empezar de nuevo" : running ? "Pulsa para pausar" : "Pulsa para que avance y crezca"}`);
    }

    function tick(t) {
        if (!running) return;
        p = Math.min(1, p + (t - last) / SIMBA_WALK_MS);
        last = t;
        if (p >= 1) running = false;
        paint();
        if (running) raf = requestAnimationFrame(tick);
    }

    btn.addEventListener("click", () => {
        if (reduce) { p = p >= 1 ? 0 : 1; paint(); return; }
        if (p >= 1) p = 0;
        if (running) { running = false; cancelAnimationFrame(raf); paint(); return; }
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
        paint();
    });
    paint();
}

initSimbaWalk();
