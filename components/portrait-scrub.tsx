"use client";

import { useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import Image from "next/image";

const portraits = [
  { className: "portrait-one", src: "/portraits/hero-01.jpeg", position: "50% 50%" },
  { className: "portrait-two", src: "/portraits/hero-02.png", position: "50% 50%" },
  { className: "portrait-three", src: "/portraits/hero-03.png", position: "50% 50%" },
];

export function PortraitScrub() {
  const area = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [used, setUsed] = useState(false);

  const update = (clientX: number) => {
    if (!area.current) return;
    const box = area.current.getBoundingClientRect();
    const next = Math.min(portraits.length - 1, Math.max(0, Math.floor(((clientX - box.left) / box.width) * portraits.length)));
    setActive(next);
    setUsed(true);
  };

  return (
    <div className="portrait-shell">
      <div ref={area} className="portrait" onPointerMove={(e) => update(e.clientX)} onPointerDown={(e) => update(e.clientX)} role="group" aria-label="Three portraits of Tharuki Vinodya. Move pointer or use buttons to reveal each image.">
        {portraits.map((portrait, index) => <div key={portrait.src} className={`portrait-layer ${portrait.className} ${index === active ? "is-active" : ""}`} aria-hidden={index !== active}>
          <Image className="portrait-backdrop" src={portrait.src} alt="" fill priority={index === 0} sizes="(max-width: 820px) 100vw, 42vw" aria-hidden="true" />
          <Image className="portrait-photo" src={portrait.src} alt={index === active ? "Portrait of Tharuki Vinodya" : ""} fill priority={index === 0} sizes="(max-width: 820px) 100vw, 42vw" style={{ objectPosition: portrait.position }} />
        </div>)}
        <div className="portrait-tabs" aria-label="Select portrait">{portraits.map((portrait, index) => <button key={portrait.src} className={index === active ? "active" : ""} onClick={() => { setActive(index); setUsed(true); }} aria-label={`Show portrait ${index + 1}`} />)}</div>
      </div>
      <div className={`scrub-hint ${used ? "used" : ""}`}><ArrowLeftRight size={14} aria-hidden="true" /> move / swipe</div>
    </div>
  );
}
