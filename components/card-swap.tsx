"use client";

import { Children, cloneElement, isValidElement, useEffect, useState } from "react";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

type CardSwapProps = {
  children: ReactNode;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
};

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`swap-card ${className}`} {...props} />;
}

export default function CardSwap({ children, cardDistance = 60, verticalDistance = 70, delay = 5000, pauseOnHover = false }: CardSwapProps) {
  const cards = Children.toArray(children).filter(isValidElement) as ReactElement<HTMLAttributes<HTMLDivElement>>[];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (cards.length < 2 || (pauseOnHover && paused)) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % cards.length), delay);
    return () => window.clearInterval(timer);
  }, [cards.length, delay, pauseOnHover, paused]);

  return <div className="card-swap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    {cards.map((card, index) => {
      const depth = (index - active + cards.length) % cards.length;
      const visible = depth < 4;
      return cloneElement(card, {
        ...card.props,
        className: `${card.props.className ?? ""} ${depth === 0 ? "is-front" : ""}`,
        "aria-hidden": !visible,
        style: {
          ...card.props.style,
          zIndex: cards.length - depth,
          opacity: visible ? 1 : 0,
          pointerEvents: depth === 0 ? "auto" : "none",
          transform: `translate3d(${depth * cardDistance}px, ${depth * -verticalDistance}px, 0) scale(${1 - depth * .035})`,
        },
      });
    })}
    <div className="card-swap-dots" aria-label="Choose featured project">
      {cards.map((_, index) => <button type="button" className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-label={`Show project ${index + 1}`} aria-pressed={index === active} key={index} />)}
    </div>
  </div>;
}
