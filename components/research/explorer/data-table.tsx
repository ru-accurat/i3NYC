// Plain table for the research pages, styled like the tables in the March 2026
// report. Cells are React nodes so callers can put links in them. Scrolls
// sideways inside its own box on narrow screens.

interface DataTableProps {
  head: string[];
  rows: React.ReactNode[][];
  /** Tailwind min-width class for the table, e.g. "min-w-[760px]". */
  minWidth?: string;
  /** Index of a column that should not wrap (dates, amounts). */
  nowrap?: number[];
}

export function DataTable({ head, rows, minWidth = "min-w-[720px]", nowrap = [] }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className={`w-full text-sm ${minWidth}`}>
        <thead>
          <tr className="border-b border-border bg-background/50">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-normal tracking-wide text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, r) => (
            <tr key={r} className="border-b border-border/50 align-top transition-colors last:border-0 hover:bg-primary/5">
              {cells.map((cell, c) => (
                <td
                  key={c}
                  className={`px-4 py-3 leading-relaxed ${c === 0 ? "font-medium text-foreground" : "text-foreground/80"} ${
                    nowrap.includes(c) ? "whitespace-nowrap tabular-nums" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
