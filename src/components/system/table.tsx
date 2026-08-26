"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Data table.
 *
 * Six tables were being written out by hand across the dashboard. The wrapper
 * was already identical in all seven places, the header row had drifted into
 * three near-identical variants, and the cell padding split cleanly into two —
 * which is the one difference that turned out to be a real decision rather
 * than drift.
 *
 * Density is a prop on the table rather than a class on every cell. The cells
 * stay dumb and inherit it through descendant selectors, so switching a table
 * from comfortable to compact is one word instead of editing forty cells and
 * missing three.
 *
 * Not from shadcn's table wholesale: that one styles a wrapper div, a caption
 * and a footer this project has no use for, and its padding is fixed. The
 * shape of the API is the same because it is the obvious shape.
 */
const DENSITY = {
  /** Reading a list — leads, landing pages. */
  default: "px-4 py-3",
  /** Scanning numbers — experiment results, coverage, channel breakdowns. */
  compact: "px-3 py-2",
} as const;

/**
 * Density reaches the cells through context rather than through a descendant
 * selector on the table. `[&_td]:px-4` compiles to `.class td`, which outranks
 * a plain `px-2` on the cell itself — so a cell that wanted different padding
 * would be silently overruled with nothing in the markup explaining why. Going
 * through context means the padding lands in the cell's own cn(), where an
 * override behaves the way every other class in this codebase behaves.
 */
const DensityContext = React.createContext<keyof typeof DENSITY>("default");

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  density?: keyof typeof DENSITY;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, density = "default", ...props }, ref) => (
    <DensityContext.Provider value={density}>
      {/* overflow-x-auto goes on the parent, not here: a table cannot scroll
          itself. */}
      <table ref={ref} className={cn("w-full text-body-sm", className)} {...props} />
    </DensityContext.Provider>
  ),
);
Table.displayName = "Table";

const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        "border-y border-border bg-secondary/40 text-left text-label uppercase text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("divide-y divide-border", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("transition-colors duration-quick", className)} {...props} />
  ),
);
TableRow.displayName = "TableRow";

/**
 * `numeric` right-aligns and switches on tabular figures, so digits line up
 * column-wise instead of dancing as values change. It was being written out as
 * `text-right tabular-nums` in some columns and just `text-right` in others,
 * which is why some numbers jitter on refresh and others do not.
 */
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

const TableHeaderCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, numeric, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      // font-medium, not semibold: the header row is already uppercase micro
      // text, and semibold on top of that reads as shouting. 27 of the 38
      // existing header cells agreed; the other 11 did not.
      className={cn(DENSITY[React.useContext(DensityContext)], "font-medium", numeric && "text-right", className)}
      {...props}
    />
  ),
);
TableHeaderCell.displayName = "TableHeaderCell";

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, numeric, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(DENSITY[React.useContext(DensityContext)], numeric && "text-right tabular-nums", className)}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

export { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell };
