"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  className = "",
  eager = false,
}: {
  children: React.ReactNode;
  className?: string;
  eager?: boolean;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "-60px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate3d(0,0,0)" : "translate3d(0,24px,0)",
        transition: "opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
}
