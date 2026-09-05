"use client";

import { useEffect, useState } from "react";

const stops = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "articles", label: "Articles" },
  { id: "contact", label: "Contact" },
];

export function FormationLine() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? Math.min(1, window.scrollY / available) : 0);
    };
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = stops.findIndex((stop) => stop.id === entry.target.id);
          if (index >= 0) setActive(index);
        }
      }),
      { rootMargin: "-35% 0px -55%", threshold: 0 },
    );
    stops.forEach(({ id }) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", updateProgress); };
  }, []);

  return <aside className="formation-nav" aria-label="Page sections">
    <div className="formation-progress" aria-hidden="true"><span style={{ height: `${progress * 100}%` }} /></div>
    <p><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(stops.length).padStart(2, "0")}</p>
    <a href={`#${stops[active].id}`}>{stops[active].label}</a>
    <div className="formation-stops">{stops.map((stop, index) => <a key={stop.id} href={`#${stop.id}`} className={index === active ? "active" : ""} aria-label={`Go to ${stop.label}`} />)}</div>
  </aside>;
}
