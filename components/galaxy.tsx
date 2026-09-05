"use client";

import { useEffect, useRef } from "react";

type GalaxyProps = {
  mouseRepulsion?: boolean;
  mouseInteraction?: boolean;
  density?: number;
  glowIntensity?: number;
  saturation?: number;
  hueShift?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  repulsionStrength?: number;
  autoCenterRepulsion?: number;
  starSpeed?: number;
  speed?: number;
};

type Star = { angle: number; radius: number; size: number; alpha: number; phase: number; depth: number };

export default function Galaxy({
  mouseRepulsion = true,
  mouseInteraction = true,
  density = 1,
  glowIntensity = 0.3,
  saturation = 0,
  hueShift = 140,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  repulsionStrength = 2,
  autoCenterRepulsion = 0,
  starSpeed = 0.5,
  speed = 1,
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let stars: Star[] = [];
    const pointer = { x: 0, y: 0, active: false };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const seedStars = () => {
      const count = Math.max(80, Math.floor((width * height / 6500) * density));
      const reach = Math.hypot(width, height) * 0.62;
      stars = Array.from({ length: count }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: Math.pow(Math.random(), 0.72) * reach,
        size: 0.35 + Math.random() * 1.65,
        alpha: 0.25 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        depth: 0.45 + Math.random() * 0.9,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      seedStars();
    };
    const move = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const t = reducedMotion ? 0 : time * 0.00008 * speed;
      const centerX = width * 0.5;
      const centerY = height * 0.5;

      for (const star of stars) {
        const spiral = star.angle + t * rotationSpeed * 18 + star.radius * 0.00125;
        const pulse = Math.sin(t * starSpeed * 24 + star.phase);
        let x = centerX + Math.cos(spiral) * star.radius;
        let y = centerY + Math.sin(spiral) * star.radius * 0.42;

        if (mouseInteraction && pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          if (mouseRepulsion && distance < 150) {
            const force = (1 - distance / 150) * repulsionStrength * 18;
            x += dx / distance * force;
            y += dy / distance * force;
          }
        } else if (autoCenterRepulsion > 0) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const force = Math.max(0, 120 - distance) / 120 * autoCenterRepulsion * 12;
          x += dx / distance * force;
          y += dy / distance * force;
        }

        const alpha = star.alpha * (1 + pulse * twinkleIntensity);
        const radius = star.size * star.depth;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `hsla(${hueShift}, ${saturation}%, 88%, ${alpha})`;
        context.shadowColor = `hsla(${hueShift}, ${Math.max(20, saturation)}%, 70%, ${glowIntensity})`;
        context.shadowBlur = radius * 8 * glowIntensity;
        context.fill();
      }
      context.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [autoCenterRepulsion, density, glowIntensity, hueShift, mouseInteraction, mouseRepulsion, repulsionStrength, rotationSpeed, saturation, speed, starSpeed, twinkleIntensity]);

  return <canvas ref={canvasRef} className="galaxy-canvas" aria-hidden="true" />;
}
