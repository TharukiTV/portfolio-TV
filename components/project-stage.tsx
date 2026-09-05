"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { PointerEvent } from "react";

type ProjectImage = { src: string; label: string; portrait?: boolean };
type Props = { number: string; title: string; tone: string; images?: ProjectImage[] };

export function ProjectStage({ number, title, tone, images = [] }: Props) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 150, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 150, damping: 24 });
  const rotateY = useTransform(smoothX, [0, 1], [-3, 3]);
  const rotateX = useTransform(smoothY, [0, 1], [3, -3]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };

  const reset = () => { pointerX.set(0.5); pointerY.set(0.5); };
  const select = (next: number) => setActive((next + images.length) % images.length);
  const endSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" || touchStart === null || images.length < 2) return;
    const distance = event.clientX - touchStart;
    if (Math.abs(distance) > 45) select(active + (distance < 0 ? 1 : -1));
    setTouchStart(null);
  };

  return <div className="stage-perspective">
    <motion.div className={`project-stage ${tone} ${images.length ? "has-images" : ""}`} style={reducedMotion ? undefined : { rotateX, rotateY }} onPointerMove={move} onPointerLeave={reset} onPointerDown={(event) => event.pointerType === "touch" && setTouchStart(event.clientX)} onPointerUp={endSwipe} role="group" aria-label={`${title} project gallery`}>
      <span className="stage-index">{number}</span>
      {images.length ? <>
        <div className={`stage-image ${images[active].portrait ? "portrait-shot" : ""}`}>
          <Image src={images[active].src} alt={images[active].label} fill sizes="(max-width: 820px) 100vw, 45vw" quality={85} />
        </div>
        <div className="gallery-controls">
          <button onClick={() => select(active - 1)} aria-label={`Previous ${title} screenshot`}><ChevronLeft size={18} /></button>
          <span>{String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          <button onClick={() => select(active + 1)} aria-label={`Next ${title} screenshot`}><ChevronRight size={18} /></button>
        </div>
      </> : <><div className="stage-formation" aria-hidden="true"><i /><i /><i /><i /></div><span className="stage-caption">Interactive project stage</span></>}
      <div className="stage-title">{title}</div>
    </motion.div>
  </div>;
}
