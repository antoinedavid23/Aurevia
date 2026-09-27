"use client";

import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import styles from "@/app/administration/strategia/strategia.module.css";

/** The translated anchors also power the compact picker and no-JS fallback. */
export function StrategyNavigation({ children, label }: { children: ReactNode; label: string }) {
  const id = useId();
  const nav = useRef<HTMLElement>(null);
  const chapters = useMemo(() => Children.toArray(children).flatMap(child =>
    isValidElement<{ href: string; children: string }>(child)
      ? [{ id: child.props.href.slice(1), label: child.props.children }]
      : []), [children]);
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = (nav.current?.getBoundingClientRect().height ?? 80) + 40;
      let current = chapters[0]?.id ?? "";
      for (const chapter of chapters) {
        if ((document.getElementById(chapter.id)?.getBoundingClientRect().top ?? Infinity) <= offset) current = chapter.id;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [chapters]);

  const index = Math.max(0, chapters.findIndex(chapter => chapter.id === active));
  return <nav ref={nav} className={styles.nav} aria-label={label}>
    <div className={styles.chapterPicker}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.chapterSelect}>
        <select id={id} value={active} onChange={event => {
          const chapter = event.target.value;
          setActive(chapter);
          window.history.replaceState(window.history.state, "", `#${chapter}`);
          const section = document.getElementById(chapter);
          if (section) window.scrollTo({
            top: window.scrollY + section.getBoundingClientRect().top - (nav.current?.getBoundingClientRect().height ?? 80) - 16,
            behavior: "instant",
          });
        }}>
          {chapters.map((chapter, position) => <option key={chapter.id} value={chapter.id}>{String(position).padStart(2, "0")} · {chapter.label}</option>)}
        </select>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
      </div>
      <span className={styles.chapterCount} aria-hidden="true">{String(index + 1).padStart(2, "0")} / {chapters.length}</span>
    </div>
    <noscript><div className={styles.chapterFallback}>{children}</div></noscript>
  </nav>;
}
