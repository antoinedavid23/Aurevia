"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ROOT_CLASS = "scroll-reveal-ready";
const ITEM_ATTRIBUTE = "data-scroll-reveal-item";
const VISIBLE_CLASS = "is-scroll-revealed";

function canReveal(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false;
  if (element.matches("[data-scroll-reveal-ignore], [aria-hidden='true'], script, style, noscript")) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  return getComputedStyle(element).animationName === "none";
}

function sectionItems(section: HTMLElement) {
  const directChildren = Array.from(section.children).filter(canReveal);
  const items = directChildren.flatMap((child) => {
    const shouldOpenGroup = child.classList.contains("container") || child.classList.contains("footer-grid");
    if (!shouldOpenGroup) return [child];

    const children = Array.from(child.children).filter(canReveal);
    return children.length > 0 ? children : [child];
  });

  return items.filter((item) => !item.hasAttribute("data-scroll-reveal-ignore"));
}

export function ScrollRevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

    const root = document.querySelector<HTMLElement>("[data-aurevia-site]");
    if (!root) return;
    const items = new Set<HTMLElement>();

    const reveal = (item: HTMLElement) => {
      item.classList.add(VISIBLE_CLASS);
      observer.unobserve(item);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    const registerItems = () => {
      const mainSections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
      const followingSections = mainSections.slice(1);
      const closingSections = Array.from(
        document.querySelectorAll<HTMLElement>(".site-footer-cta, .aurevia-footer"),
      );
      const sections = [...followingSections, ...closingSections];

      sections.forEach((section) => {
        sectionItems(section).forEach((item, index) => {
          if (items.has(item)) return;

          item.setAttribute(ITEM_ATTRIBUTE, "");
          item.style.setProperty("--scroll-reveal-delay", `${Math.min(index, 4) * 75}ms`);
          items.add(item);

          if (item.getBoundingClientRect().bottom < 0) item.classList.add(VISIBLE_CLASS);
          else observer.observe(item);
        });
      });

      if (items.size > 0) root.classList.add(ROOT_CLASS);
    };

    let registrationFrame = 0;
    let registrationTimer = window.setTimeout(() => {
      registrationFrame = requestAnimationFrame(registerItems);
    }, 240);
    const scheduleRegistration = () => {
      window.clearTimeout(registrationTimer);
      cancelAnimationFrame(registrationFrame);
      registrationTimer = window.setTimeout(() => {
        registrationFrame = requestAnimationFrame(registerItems);
      }, 180);
    };
    const domObserver = new MutationObserver(scheduleRegistration);
    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const revealFocusedItem = (event: FocusEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>(`[${ITEM_ATTRIBUTE}]`)
        : null;
      if (target) reveal(target);
    };

    document.addEventListener("focusin", revealFocusedItem);

    return () => {
      window.clearTimeout(registrationTimer);
      cancelAnimationFrame(registrationFrame);
      observer.disconnect();
      domObserver.disconnect();
      document.removeEventListener("focusin", revealFocusedItem);
      root.classList.remove(ROOT_CLASS);
      items.forEach((item) => {
        item.removeAttribute(ITEM_ATTRIBUTE);
        item.classList.remove(VISIBLE_CLASS);
        item.style.removeProperty("--scroll-reveal-delay");
      });
    };
  }, [pathname]);

  return null;
}
