(function () {
  if (window.NesFX) return;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v), lerp = (a, b, t) => a + (b - a) * t;

  const CODE = `import UIKit
import Combine

protocol LedgerViewInput: AnyObject {
    func render(_ state: LedgerViewState)
}

final class LedgerPresenter {
    weak var view: LedgerViewInput?
    private let interactor: LedgerInteractorInput
    private let router: LedgerRouterInput
    private var bag = Set<AnyCancellable>()

    func viewDidLoad() {
        interactor.transactions
            .receive(on: DispatchQueue.main)
            .map(LedgerViewState.init)
            .sink { [weak self] in self?.view?.render($0) }
            .store(in: &bag)
    }
}

struct PortCalculator {
    let volume: Double   // liters
    let tuning: Double   // hertz

    func length(diameter d: Double) -> Double {
        let f = tuning, v = volume
        return (23562.5 * d * d) / (f * f * v) - 0.732 * d
    }
}

extension Calendar {
    func shifts(from start: Date, _ p: [Bool]) -> [Date] {
        (0..<365).compactMap { day in
            guard p[day % p.count] else { return nil }
            return date(byAdding: .day, value: day, to: start)
        }
    }
}

final class SpringCell: UICollectionViewCell {
    override var isHighlighted: Bool {
        didSet {
            UIView.animate(withDuration: 0.35, delay: 0,
                usingSpringWithDamping: 0.7,
                initialSpringVelocity: 0.4) {
                self.transform = self.isHighlighted
                    ? CGAffineTransform(scaleX: 0.96, y: 0.96)
                    : .identity
            }
        }
    }
}
`.split('\n');

  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;uniform float I;uniform vec4 pu;uniform float ph;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r.y;vec2 mm=m/r.y;vec2 dm=uv-mm;float d=length(dm);
 float sw=exp(-d*d*9.)*(.9+1.6*I);float cs=cos(sw),sn=sin(sw);
 vec2 q=mm+mat2(cs,-sn,sn,cs)*dm;q.y-=s*.35;
 vec2 pp=pu.xy/r.y;float pt=t-pu.z;vec2 dp=uv-pp;float pd=length(dp);
 float fr=pt*.5,rip=step(0.,pt)*exp(-pow((pd-fr)*16.,2.))*exp(-pt*1.4);
 q+=dp/(pd+.001)*rip*.035*(.6+.8*I);
 float tt=t*.06;
 vec2 w1=vec2(fb(q*1.5+vec2(0.,tt)),fb(q*1.5+vec2(5.2,1.3)-tt));
 vec2 w2=vec2(fb(q*1.5+3.*w1+vec2(1.7,9.2)+tt*1.3+ph*.7),fb(q*1.5+3.*w1+vec2(8.3,2.8)-tt));
 float f=fb(q*1.5+3.2*w2);
 vec3 bg=vec3(.086,.094,.149),ind=vec3(.149,.165,.376),ac=vec3(.569,.518,.851),hi=vec3(.82,.81,.99);
 vec3 col=mix(bg,ind,smoothstep(.25,.85,f)*(.55+.45*I));
 float g=smoothstep(.5,1.05,f*length(w2)*1.25);
 col=mix(col,ac,g*g*(.35+.4*I));
 float iso=abs(fract(f*7.+t*.03)-.5);
 col+=hi*smoothstep(.035,0.,iso)*.05*(.4+I)*smoothstep(.3,.7,f);
 col+=ac*exp(-d*d*14.)*.16*I;
 col*=1.+rip*.14;
 vec2 v=gl_FragCoord.xy/r-.5;col*=1.-dot(v,v)*.9;
 gl_FragColor=vec4(col,1.);
}`;

  function rrect(o, x, y, w, h, r) {
    o.beginPath(); o.moveTo(x + r, y);
    o.arcTo(x + w, y, x + w, y + h, r); o.arcTo(x + w, y + h, x, y + h, r);
    o.arcTo(x, y + h, x, y, r); o.arcTo(x, y, x + w, y, r); o.closePath();
  }

  function mount(host, init) {
    const o = Object.assign({ mode: 'particles', intensity: 0.8, cursor: true, dot: 'square' }, init || {});
    const fine = matchMedia('(pointer:fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const I = () => o.intensity * (reduce ? 0.35 : 1);
    let W = innerWidth, H = innerHeight, DPR = Math.min(2, devicePixelRatio || 1);
    let T = 0, last = performance.now(), t0 = last, raf = 0, alive = true, fc = 0;
    const M = { x: -1e4, y: -1e4, sx: -1e4, sy: -1e4, down: 0 }, BG = { x: -1e4, y: -1e4 };
    let sy = scrollY, lastSy = sy, vel = 0, curKey = 'none', phase = 0, phaseT = 0;
    const pulses = [];
    const mk = () => { const c = document.createElement('canvas'); Object.assign(c.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'none' }); host.appendChild(c); return c; };
    const c3 = mk(), c2 = mk(), cg = mk(), ctx = c2.getContext('2d'), ctx3 = c3.getContext('2d');
    const GL = '{}()<>[]=;:.#@&*01/';
    let gl = null, U = {};

    /* ---------- particles ---------- */
    const P = { n: 0, key: '', mode: 'none' };
    function box() { const wide = W > 900; return { cx: wide ? W * 0.72 : W * 0.5, cy: wide ? H * 0.5 : H * 0.42, s: wide ? Math.min(W * 0.42, H * 0.78) : Math.min(W * 0.9, H * 0.5) }; }
    function pInit() {
      if (!W || !H) { P.n = 0; return; }
      const mob = W < 760, n = Math.round((mob ? 700 : 1400) + (mob ? 1100 : 2600) * I());
      P.n = n;
      ['x', 'y', 'vx', 'vy', 'tx', 'ty', 'hx', 'hy', 'sd', 'ux', 'uy', 'uz'].forEach(k => (P[k] = new Float32Array(n)));
      P.f = new Uint8Array(n);
      const ga = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < n; i++) {
        P.x[i] = Math.random() * W; P.y[i] = Math.random() * H;
        P.hx[i] = Math.random() * W; P.hy[i] = Math.random() * H; P.sd[i] = Math.random();
        const yy = 1 - (2 * (i + 0.5)) / n, rr = Math.sqrt(1 - yy * yy), th = ga * i;
        P.ux[i] = Math.cos(th) * rr; P.uy[i] = yy; P.uz[i] = Math.sin(th) * rr;
      }
      P.key = ''; setShape(curKey);
    }
    function sample(key, raw) {
      const b = box(), S = Math.max(80, Math.round(b.s)), oc = document.createElement('canvas');
      oc.width = oc.height = S;
      const g = oc.getContext('2d');
      g.fillStyle = g.strokeStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
      const ci = key.indexOf(':'), k = ci < 0 ? key : key.slice(0, ci), arg = ci < 0 ? '' : key.slice(ci + 1);
      if (k === 'text') {
        let fs = S * 0.92; g.font = `600 ${fs}px Jura, sans-serif`;
        const w = g.measureText(arg).width;
        if (w > S * 0.94) { fs *= (S * 0.94) / w; g.font = `600 ${fs}px Jura, sans-serif`; }
        g.fillText(arg, S / 2, S / 2 + fs * 0.02);
      } else if (k === 'app') {
        const n = +arg || 0;
        g.translate(S / 2, S / 2); g.rotate((n - 1) * 0.08); g.translate(-S / 2, -S / 2);
        const a = S * 0.14; g.lineWidth = Math.max(2, S * 0.016); rrect(g, a, a, S - 2 * a, S - 2 * a, (S - 2 * a) * 0.23); g.stroke();
        const c = S * 0.02; g.lineWidth = Math.max(1, S * 0.004); rrect(g, c, c, S - 2 * c, S - 2 * c, (S - 2 * c) * 0.25); g.stroke();
      }
      const d = g.getImageData(0, 0, S, S).data;
      if (raw) return { d, S, ox: b.cx - S / 2, oy: b.cy - S / 2 };
      const pts = [], st = Math.max(1, Math.round(S / 300));
      for (let y = 0; y < S; y += st) for (let x = 0; x < S; x += st) if (d[(y * S + x) * 4 + 3] > 110) pts.push(b.cx - S / 2 + x, b.cy - S / 2 + y);
      return pts;
    }
    function setShape(key) {
      if (!P.n || key === P.key) return;
      P.key = key;
      const k = key.split(':')[0];
      if (k === 'sphere') P.mode = 'sphere';
      else if (k === 'none') P.mode = 'none';
      else {
        const pts = sample(key), m = pts.length / 2;
        P.mode = m ? 'shape' : 'none';
        for (let i = 0; i < P.n; i++) { const j = ((Math.random() * m) | 0) * 2; P.tx[i] = pts[j] + (Math.random() - 0.5) * 2; P.ty[i] = pts[j + 1] + (Math.random() - 0.5) * 2; }
      }
      const b = 9 * I();
      for (let i = 0; i < P.n; i++) { P.vx[i] += (Math.random() - 0.5) * b; P.vy[i] += (Math.random() - 0.5) * b; }
    }
    function glow(R, ctx) {
      ctx = ctx || c2.getContext('2d');
      if (M.sx < -1e3) return;
      const gr = ctx.createRadialGradient(M.sx, M.sy, 0, M.sx, M.sy, R);
      gr.addColorStop(0, `rgba(145,132,217,${0.06 + 0.07 * I()})`); gr.addColorStop(1, 'rgba(145,132,217,0)');
      ctx.globalAlpha = 1; ctx.fillStyle = gr; ctx.fillRect(M.sx - R, M.sy - R, R * 2, R * 2);
    }
    function rings() {
      ctx.globalCompositeOperation = 'lighter';
      for (const p of pulses) {
        const a = T - p.t; if (a > 1.4) continue;
        ctx.globalAlpha = (1 - a / 1.4) * 0.5; ctx.strokeStyle = '#b5abfc'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(p.x, p.y, a * 720, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    function pStep(dt, fused) {
      const n = P.n, b = box(), inten = I(), R = 100 + 110 * inten, R2 = R * R, F = (1.2 + 2.2 * inten) * dt;
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      if (fused) { ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
      else { ctx.fillStyle = 'rgba(22,24,38,0.28)'; ctx.fillRect(0, 0, W, H); glow(R * 2.2); }
      ctx.font = '500 10px Jura, sans-serif'; ctx.textBaseline = 'middle';
      ctx.globalCompositeOperation = 'lighter';
      const ry = T * 0.18 + (M.sx > -1e3 ? (M.sx / W - 0.5) * 1.4 : 0), rx = 0.35 + (M.sy > -1e3 ? (M.sy / H - 0.5) * 0.9 : 0);
      const cy = Math.cos(ry), sny = Math.sin(ry), cx = Math.cos(rx), snx = Math.sin(rx), rad = b.s * 0.4, lag = -vel * 0.9;
      const damp = Math.pow(0.88, dt), k = 0.018 * dt;
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass ? '#b5abfc' : '#b2b6ca';
        for (let i = 0; i < n; i++) {
          let tx, ty, al = 0.55, sz = 1.3;
          const s = P.sd[i];
          if (pass === 0) {
            if (P.mode === 'none' || s < 0.24) {
              let hy = (P.hy[i] - sy * (0.08 + s * 0.25)) % H; if (hy < 0) hy += H;
              tx = P.hx[i] + Math.sin(T * 0.25 + s * 50) * 36; ty = hy + Math.cos(T * 0.21 + s * 40) * 36;
              if (Math.abs(ty - P.y[i]) > H * 0.5) P.y[i] = ty;
            } else if (P.mode === 'sphere') {
              const x = P.ux[i], y = P.uy[i], z = P.uz[i];
              const x1 = x * cy + z * sny, z1 = -x * sny + z * cy, y1 = y * cx - z1 * snx, z2 = y * snx + z1 * cx;
              const pr = 1.3 / (1.9 - z2 * 0.6);
              tx = b.cx + x1 * rad * pr; ty = b.cy + y1 * rad * pr + lag;
              P.uz2 = z2;
            } else { tx = P.tx[i]; ty = P.ty[i] + lag; }
            let vx = P.vx[i], vy = P.vy[i], x = P.x[i], y = P.y[i];
            vx += (tx - x) * k; vy += (ty - y) * k;
            const dx = x - M.sx, dy = y - M.sy, d2 = dx * dx + dy * dy;
            if (d2 < R2) { const d = Math.sqrt(d2) + 0.01, f = (1 - d / R) * F; vx += (dx / d) * f - (dy / d) * f * 0.6; vy += (dy / d) * f + (dx / d) * f * 0.6; }
            vx *= damp; vy *= damp; x += vx * dt; y += vy * dt;
            P.x[i] = x; P.y[i] = y; P.vx[i] = vx; P.vy[i] = vy;
            P.f[i] = vx * vx + vy * vy > 3 ? 1 : 0;
            if (P.mode === 'sphere' && s >= 0.24) P.tx[i] = P.uz2; // reuse as depth
          }
          if (P.f[i] !== pass) continue;
          if (P.mode === 'none' || s < 0.24) { al = 0.2 + s * 0.35; sz = 0.8 + s; }
          else if (P.mode === 'sphere') { const z = P.tx[i] * 0.5 + 0.5; al = 0.15 + 0.65 * z; sz = 0.8 + 1.2 * z; }
          ctx.globalAlpha = pass ? Math.min(1, al + 0.35) : al;
          if (fused && s > 0.8 && P.mode !== 'none') ctx.fillText(GL[(i * 7) % GL.length], P.x[i], P.y[i]);
          else ctx.fillRect(P.x[i], P.y[i], sz, sz);
        }
      }
      rings();
    }

    /* ---------- code grid ---------- */
    const OF = new Map(), FALL = []; let OFs = '', FN = 1.5;
    const CF = '500 12px Jura, sans-serif', SCR = '{}<>/=*&#01ABCDEF';
    function cStep(ctx, dim) {
      dim = dim || 1;
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.fillStyle = '#161826'; ctx.fillRect(0, 0, W, H);
      const inten = I(), R = 150 + 120 * inten;
      glow(R * 1.6, ctx);
      ctx.font = CF; ctx.textBaseline = 'middle';
      const cw = ctx.measureText('MMMMMMMMMM').width / 10, lh = 19, colW = Math.max(380, 66 * cw), nc = Math.ceil(W / colW) + 1;
      const band = ((T * 70) % (H + 400)) - 200, has = M.sx > -1e3, rows = Math.ceil(H / lh) + 2, L = CODE.length;
      const WL = 1.4, WW = 34, waves = [];
      for (const p of pulses) { const age = T - p.t; if (age >= 0 && age < WL) { const fade = 1 - age / WL; waves.push({ x: p.x, y: p.y, rw: age * 560, amp: 11 * fade * fade * (0.6 + 0.8 * inten) }); } }
      if (document.fonts && document.fonts.status !== OFs) { OF.clear(); OFs = document.fonts.status; }
      const offs = line => { let q = OF.get(line); if (!q) { q = new Float32Array(line.length + 1); for (let i = 0; i < line.length; i++) q[i + 1] = q[i] + ctx.measureText(line[i]).width; OF.set(line, q); } return q; };
      if (dim === 1 && T > FN) {
        FN = T + 0.33 + Math.random() * 0.17;
        const c = (Math.random() * Math.min(nc, Math.ceil(W / colW))) | 0, r = 1 + ((Math.random() * (rows - 3)) | 0);
        const x0 = c * colW + 20, off = sy * (0.2 + ((c * 3) % 4) * 0.08) + c * 211, first = Math.floor(off / lh), li = first + r;
        const line = CODE[(((li + c * 17) % L) + L) % L];
        if (line && line.trim()) {
          let k, tries = 0; do { k = (Math.random() * line.length) | 0; } while (!/[A-Za-z]/.test(line[k]) && ++tries < 60);
          if (/[A-Za-z]/.test(line[k]) && !FALL.some(f => f.c === c && f.li === li && f.k === k)) { const o = offs(line); FALL.push({ c, li, k, ch: line[k], x: x0 + o[k], w: o[k + 1] - o[k], y: r * lh - (off - first * lh) + lh / 2, vx: (Math.random() - 0.5) * 50, vy: -Math.random() * 60, vr: (Math.random() - 0.5) * 5, t0: T }); }
        }
      }
      for (let i = FALL.length - 1; i >= 0; i--) if (T - FALL[i].t0 > 4.5) FALL.splice(i, 1);
      for (let c = 0; c < nc; c++) {
        const x0 = c * colW + 20, spd = 0.2 + ((c * 3) % 4) * 0.08, off = sy * spd + c * 211, first = Math.floor(off / lh), sub = off - first * lh;
        for (let r = 0; r < rows; r++) {
          const y = r * lh - sub + lh / 2, line = CODE[(((first + r + c * 17) % L) + L) % L];
          if (!line) continue;
          const dy = y - M.sy, base = (0.1 + Math.max(0, 1 - Math.abs(y - band) / 90) * 0.14) * dim;
          const mRow = has && Math.abs(dy) < R;
          let wr = null, hole = null;
          for (const w of waves) if (Math.abs(y - w.y) < w.rw + WW * 2.5) (wr || (wr = [])).push(w);
          for (const f of FALL) if (f.c === c && f.li === first + r) (hole || (hole = [])).push(f);
          ctx.fillStyle = '#b2b6ca'; ctx.globalAlpha = base;
          if (!mRow && !wr && !hole) { ctx.fillText(line, x0, y); continue; }
          const o = offs(line);
          for (let k = 0; k < line.length; k++) {
            const ch = line[k]; if (ch === ' ') continue;
            let hf = 1;
            if (hole) { const hh = hole.find(f => f.k === k); if (hh) { hf = clamp((T - hh.t0 - 3.5) / 1, 0, 1); if (!hf) continue; } }
            const hw = (o[k + 1] - o[k]) / 2, px0 = x0 + o[k] + hw;
            let ox = 0, oy = 0, al = base, col = '#b2b6ca', gch = ch;
            if (mRow) {
              const ddx = px0 - M.sx, d = Math.hypot(ddx, dy);
              if (d < R) {
                const q = 1 - d / R, push = q * q * 30 * inten;
                ox += (ddx / (d + 0.01)) * push; oy += (dy / (d + 0.01)) * push;
                al = Math.min(1, base + q * 0.85); col = q > 0.35 ? '#b5abfc' : '#cfd3e5';
                if (q > 0.6 && Math.random() < 0.12 * q * inten) gch = SCR[(Math.random() * SCR.length) | 0];
              }
            }
            if (wr) for (const w of wr) {
              const ex = px0 - w.x, ey = y - w.y, d = Math.hypot(ex, ey), s = (d - w.rw) / WW;
              if (s > 2.5 || s < -2.5) continue;
              const g = Math.exp(-s * s) * w.amp;
              ox += (ex / (d + 0.01)) * g; oy += (ey / (d + 0.01)) * g;
              al = Math.min(1, al + g * 0.035); if (g > 5 && col === '#b2b6ca') col = '#cfd3e5';
            }
            ctx.globalAlpha = al * hf; ctx.fillStyle = col;
            ctx.fillText(gch, px0 - hw + ox, y + oy);
          }
        }
      }
      for (const f of FALL) {
        const a = T - f.t0, al = a < 0.9 ? 0.6 : Math.max(0, 0.6 * (1 - (a - 0.9) / 0.7));
        if (!al) continue;
        ctx.save(); ctx.translate(f.x + f.w / 2 + f.vx * a, f.y + f.vy * a + 450 * a * a); ctx.rotate(f.vr * a);
        ctx.globalAlpha = al * dim; ctx.fillStyle = '#cfd3e5'; ctx.fillText(f.ch, -f.w / 2, 0); ctx.restore();
      }
    }

    /* ---------- compile: particles made of the code itself ---------- */
    const G = { n: 0, key: '', mode: 'none' }, BK = [[], [], []].flatMap(() => Array.from({ length: 8 }, () => []));
    const GC = ['#9397ab', '#d2cefd', '#f3f5fe'];
    function gInit() {
      G.n = 0; if (!W || !H) return;
      ctx.font = CF;
      const cw = ctx.measureText('MMMMMMMMMM').width / 10, lh = 19, cols = Math.ceil(W / cw) + 1, rows = Math.ceil(H / lh) + 3;
      Object.assign(G, { cw, lh, cols, rows, n: cols * rows });
      ['x', 'y', 'vx', 'vy', 'px', 'py', 'm', 'L', 'scr'].forEach(k => (G[k] = new Float32Array(G.n)));
      G.key = ''; gShape(curKey);
    }
    function gShape(key) {
      if (!G.n || key === G.key) return;
      G.key = key;
      const k = key.split(':')[0], { n, cols, rows, cw, lh } = G, old = G.m.slice(), inten = I();
      G.px.fill(0); G.py.fill(0); G.m.fill(0);
      G.mode = k === 'sphere' ? 'sphere' : k === 'none' ? 'none' : 'mask';
      if (G.mode === 'mask') {
        const R = sample(key, true), ins = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          const x = ((i % cols) * cw + cw / 2 - R.ox) | 0, y = ((((i / cols) | 0) - 1) * lh + lh / 2 - R.oy) | 0;
          if (x >= 0 && y >= 0 && x < R.S && y < R.S && R.d[(y * R.S + x) * 4 + 3] > 90) { ins[i] = 1; G.m[i] = 1; }
        }
        const Rp = 6.5 * cw;
        for (let i = 0; i < n; i++) {
          if (ins[i]) continue;
          const c = i % cols, r = (i / cols) | 0;
          let best = 1e9, bc = 0, br = 0;
          for (let dr = -2; dr <= 2; dr++) {
            const rr = r + dr; if (rr < 0 || rr >= rows) continue;
            for (let dc = -6; dc <= 6; dc++) {
              const cc = c + dc; if (cc < 0 || cc >= cols || !ins[rr * cols + cc]) continue;
              const d = Math.hypot(dc * cw, dr * lh); if (d < best) { best = d; bc = dc; br = dr; }
            }
          }
          if (best < Rp) { const f = 1 - best / Rp; G.px[i] = bc * cw * 0.82; G.py[i] = br * lh * 0.82; G.m[i] = 0.12 + 0.5 * f; }
        }
      }
      for (let i = 0; i < n; i++) {
        if (G.m[i] > 0.5 && old[i] <= 0.5) G.scr[i] = T + 0.1 + Math.random() * 0.9;
        G.vx[i] += (Math.random() - 0.5) * 7 * inten; G.vy[i] += (Math.random() - 0.5) * 7 * inten;
      }
    }
    function gStep(dt) {
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = '#161826'; ctx.fillRect(0, 0, W, H);
      if (!G.n) return;
      const { n, cols, cw, lh } = G, inten = I(), b = box(), R = 90 + 110 * inten;
      glow(R * 2, ctx);
      ctx.font = CF; ctx.textBaseline = 'middle';
      const nb = Math.ceil(cols / 64) + 1, first = [], sub = [], L = CODE.length;
      for (let k = 0; k < nb; k++) { const off = sy * (0.2 + ((k * 3) % 4) * 0.08) + k * 211; first[k] = Math.floor(off / lh); sub[k] = off - first[k] * lh; }
      const band = ((T * 70) % (H + 400)) - 200, has = M.sx > -1e3, R2 = R * R, F = (1.4 + 2.4 * inten) * dt, damp = Math.pow(0.86, dt), kk = 0.05 * dt, ls = Math.min(1, 0.1 * dt), lag = -vel * 1.1;
      const sph = G.mode === 'sphere', rad = b.s * 0.42;
      const ry = T * 0.3 + (has ? (M.sx / W - 0.5) * 1.6 : 0), cr = Math.cos(ry), sr = Math.sin(ry);
      const tl = has ? (M.sy / H - 0.5) * 0.9 : 0.35, ct = Math.cos(tl), st = Math.sin(tl);
      for (let k = 0; k < BK.length; k++) BK[k].length = 0;
      for (let i = 0; i < n; i++) {
        const c = i % cols, r = (i / cols) | 0, bk = (c / 64) | 0, ci = c - bk * 64;
        const hx = c * cw, hy = (r - 1) * lh + lh / 2 - sub[bk];
        let tx = G.px[i], ty = G.py[i], mt = G.m[i];
        if (sph) {
          mt = 0;
          const dx = (hx + cw / 2 - b.cx) / rad, dy = (hy - b.cy) / rad, r2 = dx * dx + dy * dy;
          if (r2 < 1) {
            const rn = Math.sqrt(r2), f = Math.sin((rn * Math.PI) / 2) / (rn + 1e-4), X = dx * f, Y = dy * f, Z = Math.sqrt(Math.max(0, 1 - X * X - Y * Y));
            tx = (X - dx) * rad; ty = (Y - dy) * rad;
            const y1 = Y * ct - Z * st, z1 = Y * st + Z * ct, x2 = X * cr + z1 * sr, z2 = -X * sr + z1 * cr;
            const lo = Math.abs(((Math.atan2(x2, z2) * 6) / Math.PI) % 1), la = Math.abs(((Math.asin(clamp(y1, -1, 1)) * 6) / Math.PI) % 1);
            const ln = Math.max(0, 1 - Math.min(lo, 1 - lo) * 7, 1 - Math.min(la, 1 - la) * 7);
            mt = Math.min(1, 0.1 + 0.35 * Z + 0.75 * ln * (0.3 + 0.7 * Z));
          }
        }
        let Lv = G.L[i] += (mt - G.L[i]) * ls;
        ty += lag * Lv;
        let ox = G.x[i], oy = G.y[i], vx = G.vx[i], vy = G.vy[i], q = 0;
        vx += (tx - ox) * kk; vy += (ty - oy) * kk;
        const x = hx + ox, y = hy + oy;
        if (has) {
          const dx = x - M.sx, dy = y - M.sy, d2 = dx * dx + dy * dy;
          if (d2 < R2) { const d = Math.sqrt(d2) + 0.01; q = 1 - d / R; const f = q * F; vx += (dx / d) * f - (dy / d) * f * 0.6; vy += (dy / d) * f + (dx / d) * f * 0.6; }
        }
        vx *= damp; vy *= damp; ox += vx * dt; oy += vy * dt;
        G.x[i] = ox; G.y[i] = oy; G.vx[i] = vx; G.vy[i] = vy;
        const line = CODE[(((first[bk] + r + bk * 17) % L) + L) % L] || '';
        let ch = ci < line.length ? line[ci] : ' ', fill = 0;
        if (ch === ' ') { if (Lv < 0.4) continue; const t = (line.trim() ? line : 'weak var view: LedgerViewInput?').replace(/\s+/g, ''); ch = t[(ci * 7 + r) % t.length]; fill = 1; }
        const sc = G.scr[i];
        if (T < sc) ch = GL[(Math.random() * GL.length) | 0];
        const sp = vx * vx + vy * vy;
        let a = 0.07 + Math.max(0, 1 - Math.abs(y - band) / 90) * 0.12 * (1 - Lv) + Lv * 0.85 + q * 0.55 + Math.min(0.3, sp * 0.02);
        if (fill) a *= 0.55;
        const col = sp > 5 || q > 0.55 || T < sc ? 2 : Lv > 0.42 ? 1 : 0;
        BK[col * 8 + Math.min(7, (a * 8) | 0)].push(x, y, ch);
      }
      for (let k = 0; k < BK.length; k++) {
        const arr = BK[k]; if (!arr.length) continue;
        ctx.fillStyle = GC[(k / 8) | 0]; ctx.globalAlpha = ((k % 8) + 0.6) / 8;
        for (let j = 0; j < arr.length; j += 3) ctx.fillText(arr[j + 2], arr[j], arr[j + 1]);
      }
      rings();
    }

    /* ---------- liquid (webgl) ---------- */
    function glInit() {
      gl = cg.getContext('webgl', { antialias: false });
      if (!gl) return false;
      const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(x)); return x; };
      const pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { gl = null; return false; }
      gl.useProgram(pr);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['r', 't', 'm', 's', 'I', 'pu', 'ph'].forEach(k => (U[k] = gl.getUniformLocation(pr, k)));
      return true;
    }
    function glStep() {
      const sc = cg.width / W;
      gl.viewport(0, 0, cg.width, cg.height);
      gl.uniform2f(U.r, cg.width, cg.height); gl.uniform1f(U.t, T);
      gl.uniform2f(U.m, BG.x * sc, (H - BG.y) * sc); gl.uniform1f(U.s, sy / H); gl.uniform1f(U.I, I());
      const p = pulses[pulses.length - 1];
      gl.uniform4f(U.pu, p ? p.x * sc : -1e4, p ? (H - p.y) * sc : -1e4, p ? p.t : -100, 0);
      phase = lerp(phase, phaseT, 0.03); gl.uniform1f(U.ph, phase);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* ---------- DOM fx ---------- */
    let ring = null, dot = null, lab = null, hov = null;
    const C = { x: -100, y: -100 };
    function mkCursor() {
      if (!fine || ring) return;
      ring = document.createElement('div');
      Object.assign(ring.style, { position: 'fixed', left: '0', top: '0', width: '34px', height: '34px', borderRadius: '50%', border: '1px solid rgba(181,171,252,.65)', pointerEvents: 'none', zIndex: '9999', display: 'grid', placeItems: 'center', boxSizing: 'border-box', opacity: '0', transition: 'width .35s cubic-bezier(.2,.7,.2,1),height .35s cubic-bezier(.2,.7,.2,1),background-color .3s,border-color .3s,opacity .3s' });
      lab = document.createElement('span');
      Object.assign(lab.style, { font: '500 10px Jura, sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#f5f4ff', opacity: '0', transition: 'opacity .2s' });
      ring.appendChild(lab);
      dot = document.createElement('div');
      Object.assign(dot.style, { position: 'fixed', left: '0', top: '0', width: '4px', height: '4px', borderRadius: '50%', background: '#d2cefd', pointerEvents: 'none', zIndex: '10000', opacity: '0' });
      document.body.append(ring, dot);
    }
    function rmCursor() { ring && ring.remove(); dot && dot.remove(); ring = dot = lab = null; }
    function setHover() {
      if (!ring) return;
      const l = hov && hov.getAttribute('data-cursor');
      const [w, bg, bc] = l ? ['76px', 'rgba(145,132,217,.22)', 'rgba(181,171,252,.9)'] : hov ? ['54px', 'rgba(145,132,217,.12)', 'rgba(181,171,252,.8)'] : ['34px', 'transparent', 'rgba(181,171,252,.65)'];
      ring.style.width = ring.style.height = w; ring.style.backgroundColor = bg; ring.style.borderColor = bc;
      lab.textContent = l || ''; lab.style.opacity = l ? '1' : '0';
    }
    function ripple(x, y) {
      const el = document.createElement('div');
      Object.assign(el.style, { position: 'fixed', left: x + 'px', top: y + 'px', width: '12px', height: '12px', margin: '-6px 0 0 -6px', borderRadius: '50%', border: '1px solid rgba(181,171,252,.9)', pointerEvents: 'none', zIndex: '9998' });
      document.body.appendChild(el);
      const a = el.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(10)', opacity: 0 }], { duration: 800, easing: 'cubic-bezier(.2,.7,.2,1)' });
      a.onfinish = () => el.remove();
    }

    const st = new WeakMap(), S = el => { let s = st.get(el); if (!s) st.set(el, (s = { x: 0, y: 0, k: 0, rx: 0, ry: 0, gx: 50, gy: 30, in: 0 })); return s; };
    const seen = new WeakSet();
    const reveal = el => { el.style.opacity = '1'; el.style.translate = '0 0'; el.style.filter = 'blur(0px)'; io.unobserve(el); };
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target; el.style.opacity = '1'; el.style.translate = '0 0'; el.style.filter = 'blur(0px)'; io.unobserve(el);
    }), { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    /* ---------- headings made of particles (liquid): assemble in view, scatter out of view ---------- */
    const AS = new Map(), AC = ['#b5abfc', '#d2cefd', '#f3f5fe'], APAD = 220;
    let aLast = 0; const SPR = {};
    function sprite(col) { if (SPR[col]) return SPR[col]; const s = document.createElement('canvas'); s.width = s.height = 32; const g = s.getContext('2d'); g.fillStyle = col; g.beginPath(); g.arc(16, 16, 15, 0, 6.2832); g.fill(); return (SPR[col] = s); }
    function freeze(el) {
      const anc = []; for (let p = el.parentElement; p; p = p.parentElement) if (p.hasAttribute && p.hasAttribute('data-reveal')) anc.push(p);
      [...anc, el, ...el.querySelectorAll('[data-reveal]')].forEach(n => { if (!n.hasAttribute('data-reveal')) return; n.style.transition = 'none'; n.style.opacity = '1'; n.style.translate = '0 0'; n.style.filter = 'none'; io.unobserve(n); });
    }
    function asmSync() {
      if (o.mode !== 'liquid' || reduce) { AS.forEach((a, el) => { a.cv && a.cv.remove(); el.style.visibility = ''; }); AS.clear(); return; }
      document.querySelectorAll('main h1, main h2, main [data-particles]').forEach(el => {
        let a = AS.get(el);
        if (!a) { a = { p: 0, cv: null }; AS.set(el, a); freeze(el); el.style.visibility = 'hidden'; }
        const r = el.getBoundingClientRect(), L = r.left + scrollX, Tp = r.top + scrollY;
        if (r.width && (!a.cv || Math.abs(a.L - L) > 1 || Math.abs(a.T - Tp) > 1 || Math.abs(a.w - r.width) > 1 || Math.abs(a.h - r.height) > 1 || a.dw !== document.documentElement.clientWidth)) build(el, a, r);
      });
      AS.forEach((a, el) => { if (!el.isConnected) { a.cv && a.cv.remove(); AS.delete(el); } });
    }
    function build(el, a, r) {
      const cw = Math.ceil(r.width + APAD * 2), ch = Math.ceil(r.height + APAD * 2);
      if (cw * ch > 9e6) return;
      const oc = document.createElement('canvas'); oc.width = cw; oc.height = ch;
      const ox = oc.getContext('2d'); ox.fillStyle = '#fff'; ox.textAlign = 'center'; ox.textBaseline = 'middle';
      let fs = 40;
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), rg = document.createRange();
      for (let t = tw.nextNode(); t; t = tw.nextNode()) {
        const cs = getComputedStyle(t.parentElement); fs = parseFloat(cs.fontSize) || fs;
        ox.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const s = t.textContent;
        for (let i = 0; i < s.length; i++) {
          if (!s[i].trim()) continue;
          rg.setStart(t, i); rg.setEnd(t, i + 1);
          const b = rg.getBoundingClientRect(); if (!b.width) continue;
          ox.fillText(s[i], b.left - r.left + APAD + b.width / 2, b.top - r.top + APAD + b.height / 2);
        }
      }
      const d = ox.getImageData(0, 0, cw, ch).data; let step = Math.max(2, Math.round(fs / 26)), pts;
      do { pts = []; for (let y = 0; y < ch; y += step) for (let x = 0; x < cw; x += step) if (d[(y * cw + x) * 4 + 3] > 120) pts.push(x, y); step++; } while (pts.length > 9000);
      const n = pts.length / 2; if (!n) return;
      if (!a.cv) { a.cv = document.createElement('canvas'); Object.assign(a.cv.style, { position: 'absolute', pointerEvents: 'none', zIndex: '5' }); document.body.appendChild(a.cv); a.c = a.cv.getContext('2d'); }
      const dpr = Math.min(2, devicePixelRatio || 1), dl0 = r.left + scrollX - APAD, cl = Math.max(0, dl0), cr = Math.min(document.documentElement.clientWidth, dl0 + cw), vw = Math.max(1, cr - cl);
      a.cv.width = vw * dpr; a.cv.height = ch * dpr; a.c.setTransform(dpr, 0, 0, dpr, -(cl - dl0) * dpr, 0);
      Object.assign(a.cv.style, { left: cl + 'px', top: (r.top + scrollY - APAD) + 'px', width: vw + 'px', height: ch + 'px' });
      a.dw = document.documentElement.clientWidth; a.L = r.left + scrollX; a.T = r.top + scrollY; a.w = r.width; a.h = r.height; a.cw = cw; a.ch = ch; a.n = n; a.pts = pts; a.sz = Math.max(1.2, (step - 1) * 0.62);
      a.sx = new Float32Array(n); a.sy = new Float32Array(n); a.dl = new Float32Array(n); a.cu = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const an = Math.random() * 6.283, dd = 80 + Math.random() * 300 * (0.5 + I());
        a.sx[i] = pts[i * 2] + Math.cos(an) * dd * 1.4; a.sy[i] = pts[i * 2 + 1] + Math.sin(an) * dd;
        a.dl[i] = (pts[i * 2] / cw) * 0.35 + Math.random() * 0.25; a.cu[i] = (Math.random() - 0.5) * 140;
      }
      a.drawn = true;
    }
    if (document.fonts) document.fonts.addEventListener('loadingdone', () => AS.forEach(q => { q.w = -1; }));
    function asmStep(now) {
      const dt = Math.min(0.05, (now - (aLast || now)) / 1000); aLast = now;
      if (!AS.size) return;
      const vh = innerHeight, t = now / 1000, R = 90, R2 = R * R;
      AS.forEach(a => {
        if (!a.cv || !a.n) return;
        const top = a.T - scrollY, bot = top + a.h;
        const cy = (top + a.h / 2) / vh, pin = clamp((1 - cy) / 0.22, 0, 1), pout = clamp((cy + 0.04) / 0.2, 0, 1), tg = Math.min(pin, pout);
        a.p = lerp(a.p, tg, 1 - Math.exp(-dt * (a.init ? 14 : 4.5))); if (a.p > 0.97) a.init = true;
        if (Math.abs(a.p - tg) < 0.002) a.p = tg;
        const on = top - APAD < vh && bot + APAD > 0;
        if (!on || (a.p === 0 && !tg)) { if (a.drawn) { a.c.clearRect(0, 0, a.cw, a.ch); a.drawn = false; } return; }
        const c = a.c, n = a.n, pts = a.pts, sz = a.sz, hs = sz / 2, P = a.p * 1.8;
        const ox0 = a.L - APAD - scrollX, oy0 = a.T - APAD - scrollY, mx = M.sx - ox0, my = M.sy - oy0, has = M.sx > -1e3;
        const wv = []; for (const q of pulses) { const age = T - q.t; if (age >= 0 && age < 1.4) { const fd = 1 - age / 1.4; wv.push({ x: q.x - ox0, y: q.y - oy0, rw: age * 620, amp: 16 * fd * fd * (0.6 + 0.8 * I()) }); } }
        c.clearRect(0, 0, a.cw, a.ch); c.globalCompositeOperation = 'lighter'; a.drawn = true;
        for (let ci = 0; ci < 3; ci++) {
          c.fillStyle = AC[ci]; const spr = o.dot === 'round' ? sprite(AC[ci]) : null, rs = sz * 1.25, rh = rs / 2;
          for (let i = ci; i < n; i += 3) {
            const k = clamp(P - a.dl[i], 0, 1); if (k <= 0) continue;
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, w = Math.sin(k * Math.PI);
            let x = lerp(a.sx[i], pts[i * 2], e) + a.cu[i] * w * 0.4, y = lerp(a.sy[i], pts[i * 2 + 1], e) - a.cu[i] * w * 0.25;
            const u = 1 - e, ph = (i * 0.618034 % 1) * 6.283, fq = 0.5 + (i * 0.371 % 1) * 1.3;
            if (k === 1) { x += Math.sin(t * 1.3 + i) * 0.4; y += Math.cos(t * 1.1 + i * 1.7) * 0.4; }
            else { x += Math.sin(t * fq * 0.6 + ph) * 30 * u; y += Math.cos(t * fq * 0.5 + ph * 1.3) * 24 * u; }
            if (has) { const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy; if (d2 < R2 && d2 > 0.01) { const d = Math.sqrt(d2), f = (1 - d / R) * 22 * (0.4 + I()); x += dx / d * f; y += dy / d * f; } }
            let tw = 0.5 + 0.5 * Math.sin(t * fq * 1.4 + ph * 3.1); tw = tw * tw * tw;
            let al = k * (1 - u * (0.92 - 0.92 * tw));
            for (const w of wv) { const ex = x - w.x, ey = y - w.y, d = Math.hypot(ex, ey), s = (d - w.rw) / 36; if (s > 2.5 || s < -2.5) continue; const g = Math.exp(-s * s) * w.amp; x += ex / (d + 0.01) * g; y += ey / (d + 0.01) * g; al = Math.min(1, al + g * 0.02); }
            c.globalAlpha = al; if (spr) c.drawImage(spr, x - rh, y - rh, rs, rs); else c.fillRect(x - hs, y - hs, sz, sz);
          }
        }
        c.globalAlpha = 1;
      });
    }

    let E = { mag: [], tilt: [], spot: [], let: [], fill: [], par: [], mar: [], prog: [], hud: {} };
    function scan() {
      asmSync();
      const q = s => Array.from(document.querySelectorAll(s));
      E = { mag: q('[data-magnetic]'), tilt: q('[data-tilt]'), spot: q('[data-spot]'), let: q('[data-letter]'), fill: q('[data-fill]'), par: q('[data-parallax]'), mar: q('[data-marquee]'), prog: q('[data-progress]'), hud: { x: q('[data-hud="x"]'), y: q('[data-hud="y"]'), s: q('[data-hud="s"]') } };
      q('[data-reveal]').forEach(el => {
        if (seen.has(el)) return; seen.add(el);
        const d = parseFloat(el.getAttribute('data-reveal-delay')) || 0, ty = el.getAttribute('data-reveal-y') || '28px';
        el.style.transition = `opacity 1s cubic-bezier(.2,.7,.2,1) ${d}s, translate 1.1s cubic-bezier(.2,.7,.2,1) ${d}s, filter 1s ease ${d}s`;
        el.style.opacity = '0'; el.style.translate = `0 ${ty}`; el.style.filter = 'blur(8px)';
        io.observe(el);
      });
      const vh = innerHeight || 800;
      q('[data-reveal]').forEach(el => { if (el.style.opacity === '1') return; const r = el.getBoundingClientRect(); if (r.top < vh && r.bottom > 0 && r.width) reveal(el); });
    }
    function detect() {
      let key = 'none', idx = 0;
      document.querySelectorAll('[data-bg-shape]').forEach((el, i) => { const r = el.getBoundingClientRect(); if (r.top <= H * 0.5 && r.bottom > H * 0.5) { key = el.getAttribute('data-bg-shape'); idx = i; } });
      phaseT = idx; curKey = key;
      if (o.mode === 'particles' || o.mode === 'fusion') setShape(key); else if (o.mode === 'compile') gShape(key);
    }
    function dom(dt) {
      const has = M.x > -1e3;
      if (ring) {
        C.x = lerp(C.x, M.x, 0.22); C.y = lerp(C.y, M.y, 0.22);
        const w = ring.offsetWidth;
        ring.style.transform = `translate3d(${C.x - w / 2}px,${C.y - w / 2}px,0) scale(${M.down ? 0.8 : 1})`;
        dot.style.transform = `translate3d(${M.x - 2}px,${M.y - 2}px,0)`;
      }
      // letters: read, then write
      const lr = E.let.map(el => el.getBoundingClientRect());
      E.let.forEach((el, i) => {
        const r = lr[i], s = S(el);
        const d = has ? Math.hypot(M.x - (r.left + r.width / 2), M.y - (r.top + r.height / 2)) : 1e4;
        s.k = lerp(s.k, Math.pow(clamp(1 - d / 300, 0, 1), 1.4), 0.14);
        const k = s.k;
        el.style.fontWeight = String(Math.round(500 - 340 * k));
        el.style.transform = `translate3d(0,${(-k * 10).toFixed(2)}px,0)`;
        el.style.color = `rgb(${Math.round(233 - 23 * k)},${Math.round(233 - 27 * k)},${Math.round(237 + 16 * k)})`;
      });
      const mr = E.mag.map(el => el.getBoundingClientRect());
      E.mag.forEach((el, i) => {
        const r = mr[i], s = S(el);
        const cx = r.left + r.width / 2 - s.x, cy = r.top + r.height / 2 - s.y, dx = M.x - cx, dy = M.y - cy, hx = r.width / 2 + 12, hy = r.height / 2 + 12;
        let tx = 0, ty = 0;
        if (has && Math.abs(dx) < hx && Math.abs(dy) < hy) {
          const f = parseFloat(el.getAttribute('data-magnetic')) || 0.3, cap = Math.min(10, Math.min(r.width, r.height) * 0.18);
          tx = Math.max(-cap, Math.min(cap, dx * f * 0.35)); ty = Math.max(-cap, Math.min(cap, dy * f * 0.35));
        }
        s.x = lerp(s.x, tx, 0.18); s.y = lerp(s.y, ty, 0.18);
        if (!tx && Math.abs(s.x) < 0.05 && Math.abs(s.y) < 0.05) { if (s.in) { el.style.translate = ''; s.in = 0; } return; }
        el.style.translate = `${s.x.toFixed(2)}px ${s.y.toFixed(2)}px`; s.in = 1;
      });
      E.tilt.forEach(el => {
        const r = el.getBoundingClientRect(), s = S(el);
        const nx = (M.x - (r.left + r.width / 2)) / (r.width / 2 + 160), ny = (M.y - (r.top + r.height / 2)) / (r.height / 2 + 160);
        const inside = has && Math.abs(nx) < 1 && Math.abs(ny) < 1;
        s.rx = lerp(s.rx, inside ? -ny * 16 : Math.sin(T * 0.7) * 4, 0.1);
        s.ry = lerp(s.ry, inside ? nx * 20 : Math.cos(T * 0.55) * 6, 0.1);
        s.gx = lerp(s.gx, inside ? 50 + nx * 70 : 50 + Math.cos(T * 0.55) * 18, 0.1);
        s.gy = lerp(s.gy, inside ? 50 + ny * 70 : 30 + Math.sin(T * 0.7) * 12, 0.1);
        el.style.setProperty('--rx', s.rx.toFixed(2) + 'deg'); el.style.setProperty('--ry', s.ry.toFixed(2) + 'deg');
        el.style.setProperty('--gx', s.gx.toFixed(1) + '%'); el.style.setProperty('--gy', s.gy.toFixed(1) + '%');
      });
      E.spot.forEach(el => {
        const r = el.getBoundingClientRect(), s = S(el);
        const inside = has && M.x >= r.left && M.x <= r.right && M.y >= r.top && M.y <= r.bottom;
        if (inside) { el.style.setProperty('--mx', (M.x - r.left).toFixed(0) + 'px'); el.style.setProperty('--my', (M.y - r.top).toFixed(0) + 'px'); s.in = 1; }
        else if (s.in) { el.style.setProperty('--mx', '-999px'); el.style.setProperty('--my', '-999px'); s.in = 0; }
      });
      E.fill.forEach(el => { const r = el.getBoundingClientRect(); el.style.setProperty('--p', clamp((H * 0.82 - r.top) / (r.height + H * 0.25), 0, 1).toFixed(3)); });
      E.par.forEach(el => { const f = parseFloat(el.getAttribute('data-parallax')) || 0.2; el.style.transform = `translate3d(0,${(sy * f).toFixed(1)}px,0)`; });
      E.mar.forEach(el => {
        const s = S(el), dir = parseFloat(el.getAttribute('data-marquee')) || 1, half = el.scrollWidth / 2;
        if (!half) return;
        s.x -= dir * (0.55 + Math.min(40, Math.abs(vel)) * 0.35) * dt;
        if (s.x <= -half) s.x += half; if (s.x > 0) s.x -= half;
        el.style.transform = `translate3d(${s.x.toFixed(1)}px,0,0) skewX(${clamp(-vel * 0.25, -10, 10).toFixed(2)}deg)`;
      });
      const dh = document.documentElement.scrollHeight - H, pr = dh > 0 ? clamp(sy / dh, 0, 1) : 0;
      E.prog.forEach(el => (el.style.transform = `scaleX(${pr.toFixed(4)})`));
      if (fc % 3 === 0) {
        const pad = v => String(Math.max(0, Math.round(v))).padStart(4, '0');
        E.hud.x.forEach(el => (el.textContent = has ? pad(M.x) : '----'));
        E.hud.y.forEach(el => (el.textContent = has ? pad(M.y) : '----'));
        E.hud.s.forEach(el => (el.textContent = String(Math.round(pr * 100)).padStart(3, '0') + '%'));
      }
    }

    /* ---------- events & loop ---------- */
    const onMove = e => {
      M.x = e.clientX; M.y = e.clientY;
      if (M.sx < -1e3) { M.sx = M.x; M.sy = M.y; C.x = M.x; C.y = M.y; }
      if (ring && ring.style.opacity !== '1') { ring.style.opacity = '1'; dot.style.opacity = '1'; }
    };
    const onLeave = () => { M.x = M.y = M.sx = M.sy = -1e4; if (ring) { ring.style.opacity = '0'; dot.style.opacity = '0'; } };
    const onDown = e => {
      M.down = 1; onMove(e);
      pulses.push({ x: e.clientX, y: e.clientY, t: T }); if (pulses.length > 6) pulses.shift();
      const inten = I();
      for (let i = 0; i < P.n; i++) {
        const dx = P.x[i] - e.clientX, dy = P.y[i] - e.clientY, d = Math.hypot(dx, dy) + 0.01;
        if (d < 380) { const f = (1 - d / 380) * 18 * inten; P.vx[i] += (dx / d) * f; P.vy[i] += (dy / d) * f; }
      }
      for (let i = 0; i < G.n; i++) {
        const dx = (i % G.cols) * G.cw + G.x[i] - e.clientX, dy = (((i / G.cols) | 0) - 1) * G.lh + G.y[i] - e.clientY, d = Math.hypot(dx, dy) + 0.01;
        if (d < 420) { const f = (1 - d / 420) * 22 * inten; G.vx[i] += (dx / d) * f; G.vy[i] += (dy / d) * f; }
      }
      if (o.mode !== 'code' && o.mode !== 'liquid') ripple(e.clientX, e.clientY);
    };
    const onUp = e => { M.down = 0; if (e.pointerType && e.pointerType !== 'mouse') onLeave(); };
    const onOver = e => { const el = e.target && e.target.closest ? e.target.closest('a,button,[data-cursor]') : null; if (el !== hov) { hov = el; setHover(); } };
    let lastW = W, lastH = H;
    function resize() {
      W = innerWidth; H = innerHeight; DPR = Math.min(2, devicePixelRatio || 1);
      c2.width = (W * DPR) | 0; c2.height = (H * DPR) | 0; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const gs = Math.min(DPR, 1.5) * 0.5; cg.width = (W * gs) | 0; cg.height = (H * gs) | 0;
      c3.width = c2.width; c3.height = c2.height; ctx3.setTransform(DPR, 0, 0, DPR, 0, 0);
      if ((o.mode === 'particles' || o.mode === 'fusion') && (W !== lastW || Math.abs(H - lastH) > 120 || !P.n)) pInit();
      if (o.mode === 'compile' && (W !== lastW || H !== lastH || !G.n)) gInit();
      lastW = W; lastH = H;
    }
    function apply() {
      if (o.mode === 'liquid' && !gl && !glInit()) o.mode = 'particles';
      c2.style.display = o.mode === 'liquid' ? 'none' : 'block';
      c3.style.display = o.mode === 'fusion' ? 'block' : 'none';
      cg.style.display = o.mode === 'liquid' ? 'block' : 'none';
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = '#161826'; ctx.fillRect(0, 0, W, H);
      if (o.mode === 'particles' || o.mode === 'fusion') pInit(); else P.n = 0;
      if (o.mode === 'compile') gInit(); else G.n = 0;
      asmSync();
    }
    function frame(now) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (innerWidth && (innerWidth !== W || innerHeight !== H || !c2.width)) resize();
      const dt = Math.min(3, (now - last) / 16.667); last = now; T = (now - t0) / 1000; fc++;
      if (M.x > -1e3) { M.sx = lerp(M.sx, M.x, 0.2); M.sy = lerp(M.sy, M.y, 0.2); if (BG.x < -1e3) { BG.x = M.x; BG.y = M.y; } const kb = 1 - Math.pow(1 - 0.035, dt); BG.x = lerp(BG.x, M.x, kb); BG.y = lerp(BG.y, M.y, kb); }
      sy = scrollY; vel = lerp(vel, sy - lastSy, 0.2); lastSy = sy;
      if (fc % 30 === 1) scan();
      if (fc % 6 === 0) detect();
      if (o.mode === 'particles') pStep(dt); else if (o.mode === 'fusion') { cStep(ctx3, 0.75); pStep(dt, true); } else if (o.mode === 'code') cStep(ctx); else if (o.mode === 'compile') gStep(dt); else if (gl) glStep();
      dom(dt);
      asmStep(now);
    }

    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('pointerup', onUp, { passive: true });
    addEventListener('pointerover', onOver, { passive: true });
    addEventListener('resize', resize);
    document.documentElement.addEventListener('mouseleave', onLeave);
    if (o.cursor) mkCursor();
    resize(); scan(); detect(); apply();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (alive && (o.mode === 'particles' || o.mode === 'fusion')) { P.key = ''; setShape(curKey); } if (alive && o.mode === 'compile') { G.key = ''; gShape(curKey); } });
    raf = requestAnimationFrame(frame);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { if (innerWidth && (innerWidth !== W || innerHeight !== H || !c2.width)) resize(); }) : null;
    ro && ro.observe(document.documentElement);
    const fb = setTimeout(() => { if (innerWidth && !c2.width) resize(); document.querySelectorAll('[data-reveal]').forEach(el => { if (el.style.opacity !== '1') { const r = el.getBoundingClientRect(); if (r.top < (innerHeight || 800) * 1.2) reveal(el); } }); }, 1500);
    const fb2 = setTimeout(() => document.querySelectorAll('[data-reveal]').forEach(reveal), 4000);

    return {
      update(n) {
        const pm = o.mode, pi = o.intensity;
        Object.assign(o, n || {});
        if (o.cursor) mkCursor(); else rmCursor();
        if (o.mode !== pm) apply();
        else if (Math.abs(o.intensity - pi) > 0.001 && (o.mode === 'particles' || o.mode === 'fusion')) pInit();
      },
      destroy() {
        alive = false; cancelAnimationFrame(raf); clearTimeout(fb); clearTimeout(fb2); ro && ro.disconnect(); io.disconnect(); rmCursor(); AS.forEach((a, el) => { a.cv && a.cv.remove(); el.style.visibility = ''; }); AS.clear();
        removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onDown);
        removeEventListener('pointerup', onUp); removeEventListener('pointerover', onOver);
        removeEventListener('resize', resize); document.documentElement.removeEventListener('mouseleave', onLeave);
        c2.remove(); cg.remove(); c3.remove();
      }
    };
  }
  window.NesFX = { mount };
})();
