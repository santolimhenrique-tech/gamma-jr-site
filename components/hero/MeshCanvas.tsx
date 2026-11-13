"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Malha generativa derivada da textura "plexus" do kit de marca.
 * - Estado livre: nós à deriva, conectados por proximidade.
 * - `progress` (0→1, vindo do scroll): os nós convergem para uma grade
 *   regular — o "caos" se organiza em estrutura.
 * - Cursor (apenas ponteiros finos): conexões em turquesa ao redor.
 * - prefers-reduced-motion: um único quadro estático.
 * - Pausa fora da tela e com a aba oculta.
 */

const TURQ = "31, 221, 189";
const PETR = "29, 126, 142";

type Node = { x: number; y: number; vx: number; vy: number; gx: number; gy: number; r: number };

export function MeshCanvas({
  progress,
  className = "",
}: {
  progress: RefObject<number>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let linkDist = 140;
    let gridStep = 80;
    let raf = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, k: 0, tk: 0 };
    let intro = reduce ? 1 : 0;

    const build = () => {
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mobile = w < 768;
      const count = Math.max(26, Math.min(mobile ? 46 : 115, Math.round((w * h) / (mobile ? 9000 : 15000))));
      const cols = Math.max(3, Math.round(Math.sqrt((count * w) / h)));
      const rows = Math.ceil(count / cols);
      const cw = w / cols;
      const ch = h / rows;
      gridStep = Math.max(cw, ch);
      linkDist = Math.min(mobile ? 120 : 165, Math.max(90, Math.sqrt((w * h) / count) * 1.35));

      nodes = Array.from({ length: cols * rows }, (_, i) => {
        const speed = mobile ? 0.12 : 0.18;
        const a = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          gx: (i % cols) * cw + cw / 2,
          gy: Math.floor(i / cols) * ch + ch / 2,
          r: 0.9 + Math.random() * 1.3,
        };
      });
    };

    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const draw = (step: boolean) => {
      const p = ease(Math.min(1, Math.max(0, progress.current ?? 0)));
      ctx.clearRect(0, 0, w, h);

      if (step) {
        intro = Math.min(1, intro + 0.012);
        pointer.k += (pointer.tk - pointer.k) * 0.08;
      }
      const globalA = intro;
      const maxD = linkDist + (gridStep * 1.05 - linkDist) * p;
      const maxD2 = maxD * maxD;

      const pts = nodes.map((n) => {
        if (step) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20 || n.x > w + 20) n.vx *= -1;
          if (n.y < -20 || n.y > h + 20) n.vy *= -1;
          if (pointer.k > 0.01) {
            const dx = n.x - pointer.x;
            const dy = n.y - pointer.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 22000 && d2 > 1) {
              const f = (1 - d2 / 22000) * 0.35 * pointer.k;
              const d = Math.sqrt(d2);
              n.x += (dx / d) * f;
              n.y += (dy / d) * f;
            }
          }
        }
        return { x: n.x + (n.gx - n.x) * p, y: n.y + (n.gy - n.y) * p, r: n.r };
      });

      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD2) continue;
          const t = 1 - Math.sqrt(d2) / maxD;
          let near = 0;
          if (pointer.k > 0.01) {
            const mx = (a.x + b.x) / 2 - pointer.x;
            const my = (a.y + b.y) / 2 - pointer.y;
            near = Math.max(0, 1 - Math.sqrt(mx * mx + my * my) / 220) * pointer.k;
          }
          const alpha = (t * (0.3 + 0.12 * p) + near * t * 0.55) * globalA;
          ctx.strokeStyle = `rgba(${near > 0.05 ? TURQ : PETR}, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const pt of pts) {
        ctx.fillStyle = `rgba(${TURQ}, ${(0.55 * globalA).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      // Totalmente coberta pela seção seguinte: não desenha (economiza CPU).
      if ((progress.current ?? 0) < 0.995) draw(true);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    draw(false);
    start();

    const ro = new ResizeObserver(() => {
      build();
      draw(false);
    });
    ro.observe(parent);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.tk = 1;
    };
    const onLeave = () => (pointer.tk = 0);
    if (finePointer && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [progress]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none block ${className}`} />;
}
