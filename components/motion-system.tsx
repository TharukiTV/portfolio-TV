"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function MotionSystem() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 0.85, smoothWheel: true });
    const tick = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el, i) => gsap.fromTo(el, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, delay: (i % 3) * 0.06, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }));
      gsap.fromTo(".skill-token", { x: (i) => (i % 2 ? 22 : -22), opacity: 0.35 }, { x: 0, opacity: 1, stagger: 0.04, ease: "power2.out", scrollTrigger: { trigger: "#skills", start: "top 70%", end: "center 60%", scrub: 0.6 } });
      gsap.fromTo(".formation-underline", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: "#about", start: "top 72%", end: "center 55%", scrub: true } });
      gsap.fromTo(".formation-branches i", { scaleX: 0 }, { scaleX: 1, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: "#skills", start: "top 68%", end: "center 58%", scrub: 0.5 } });
      gsap.utils.toArray<HTMLElement>(".project").forEach((project) => gsap.fromTo(project.querySelectorAll("[data-project-part]"), { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: project, start: "top 80%", once: true } }));
    });
    return () => { ctx.revert(); gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return null;
}
