"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/LocaleController";
import { translate } from "@/lib/public-site/i18n";

const textSources = new WeakMap<Node, string>();
const lastOutputs = new WeakMap<Node, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();

/** Isolated public translation: private screens keep AUREVIA's original translator. */
export function PublicLocaleController() {
  const { locale } = useLocale();
  const pathname = usePathname();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-aurevia-site]");
    if (!root) return;
    const skipped = (element: Element) => element.closest("[data-no-translate]") !== root;
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    });
    function apply() {
      if (!root) return;
      observer.disconnect();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent || skipped(parent) || parent.closest("script,style")) continue;
        const current = node.textContent ?? "";
        const prior = textSources.get(node);
        const base = prior === undefined || (current !== lastOutputs.get(node) && current !== prior)
          ? current : prior;
        textSources.set(node, base);
        const next = base.replace(base.trim(), translate(base.trim(), locale));
        lastOutputs.set(node, next);
        if (next !== current) node.textContent = next;
      }
      root.querySelectorAll<HTMLElement>("[placeholder],[aria-label],[title],[alt]").forEach(element => {
        if (skipped(element)) return;
        const source = attributeSources.get(element) ?? new Map<string, string>();
        attributeSources.set(element, source);
        for (const name of ["placeholder", "aria-label", "title", "alt"]) {
          const current = element.getAttribute(name);
          if (!current) continue;
          if (!source.has(name)) source.set(name, current);
          element.setAttribute(name, translate(source.get(name)!, locale));
        }
      });
      observer.observe(root, { childList: true, subtree: true, characterData: true });
    }
    frame = requestAnimationFrame(apply);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [locale, pathname]);
  return null;
}
