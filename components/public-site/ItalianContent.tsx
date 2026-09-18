import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { translate, translateDeep } from "@/lib/public-site/i18n";

const localizedProps = new Set([
  "label",
  "title",
  "text",
  "headline",
  "accent",
  "promise",
  "rateNote",
  "cta",
  "timing",
  "aria-label",
  "alt",
  "placeholder",
  "intro",
  "description",
  "service",
  "experience",
  "property",
  "steps",
]);

function localizeNode(node: ReactNode): ReactNode {
  if (typeof node === "string") return translate(node, "it");
  if (Array.isArray(node)) return node.map(localizeNode);
  if (!isValidElement(node)) return node;

  const element = node as ReactElement<Record<string, unknown>>;
  if (element.props["data-no-translate"] !== undefined) return element;

  const nextProps: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(element.props)) {
    if (name === "children") {
      nextProps.children = Children.map(value as ReactNode, localizeNode);
    } else if (localizedProps.has(name)) {
      nextProps[name] = translateDeep(value, "it");
    }
  }

  return cloneElement(element, nextProps);
}

/** Renders the public editorial tree in Italian directly in the server HTML. */
export function ItalianContent({ children }: { children: ReactNode }) {
  return <>{Children.map(children, localizeNode)}</>;
}
