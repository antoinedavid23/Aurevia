import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import styles from "@/app/administration/strategia/strategia.module.css";

type TableNode = { children?: ReactNode; role?: string; scope?: string; "data-label"?: string };

/** Labels come from the translated headers; no duplicate mobile dataset. */
export function StrategyTable({ children }: { children: ReactNode }) {
  const groups = Children.toArray(children);
  const head = groups.find(node => isValidElement<TableNode>(node) && node.type === "thead");
  const headerRow = isValidElement<TableNode>(head) ? Children.toArray(head.props.children)[0] : null;
  const labels = isValidElement<TableNode>(headerRow)
    ? Children.toArray(headerRow.props.children).map(cell => isValidElement<TableNode>(cell) ? String(cell.props.children) : "")
    : [];

  return <table className={styles.table} role="table">{groups.map(group => {
    if (!isValidElement<TableNode>(group)) return group;
    const isHead = group.type === "thead";
    return cloneElement(group, { role: "rowgroup", children: Children.map(group.props.children, row => {
      if (!isValidElement<TableNode>(row)) return row;
      return cloneElement(row, { role: "row", children: Children.map(row.props.children, (cell, index) => {
        if (!isValidElement<TableNode>(cell)) return cell;
        return cloneElement(cell, isHead
          ? { role: "columnheader", scope: "col" }
          : { role: "cell", "data-label": labels[index] });
      }) });
    }) });
  })}</table>;
}
