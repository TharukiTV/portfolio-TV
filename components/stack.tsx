"use client";

import { Children, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

type StackProps = {
  cards: ReactNode;
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  onActiveChange?: (index: number) => void;
};

export default function Stack({ cards, randomRotation = false, sensitivity = 200, sendToBackOnClick = true, onActiveChange }: StackProps) {
  const initial = Children.toArray(cards);
  const [order, setOrder] = useState(() => initial.map((_, index) => index));

  useEffect(() => {
    if (order.length) onActiveChange?.(order[0]);
  }, [onActiveChange, order]);

  const sendBack = (index: number) => {
    setOrder((current) => {
      if (current[0] !== index) return current;
      return [...current.slice(1), index];
    });
  };

  return (
    <div className="article-stack">
      {order.map((cardIndex, position) => {
        const depth = position;
        const isFront = position === 0;
        const rotation = randomRotation ? ((cardIndex * 7) % 9) - 4 : depth * 1.25;
        return (
          <motion.div
            className="article-stack-card"
            key={cardIndex}
            animate={{ x: depth * 12, y: depth * 12, rotate: rotation, scale: 1 - depth * .025 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            style={{ zIndex: order.length - position }}
            drag={isFront}
            dragConstraints={{ left: -70, right: 70, top: -45, bottom: 45 }}
            dragElastic={.18}
            onDragEnd={(_, info) => { if (Math.hypot(info.offset.x, info.offset.y) > sensitivity / 4) sendBack(cardIndex); }}
            onClick={() => { if (sendToBackOnClick && isFront) sendBack(cardIndex); }}
          >
            {initial[cardIndex]}
          </motion.div>
        );
      })}
    </div>
  );
}
