import { Table as DataTable, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "@/components/system/table";
import { Pill } from "@/components/system/badge";
import { STATUS_LABEL, STATUS_TONE, type LeadStatus } from "@/lib/dashboard/leads";
import { PageHeader, Section, Preview, Code, BestPractices, Rule, Mono, Table } from "../../_components/docs";

export const metadata = { title: "Table" };

const LEADS: { name: string; city: string; service: string; date: string; status: LeadStatus }[] = [
  { name: "Steven Cochrane", city: "Oxford", service: "Residential", date: "5 Oct, 23:10", status: "new" },
  { name: "Jack Raven", city: "South Norfolk", service: "Residential", date: "5 Oct, 22:26", status: "contacted" },
  { name: "Priya Shah", city: "Leeds", service: "Business", date: "4 Oct, 14:02", status: "quoted" },
  { name: "Tom Ellis", city: "Bath", service: "Static caravan", date: "3 Oct, 09:41", status: "booked" },
];

const PAGES = [
  { page: "/install-quote", visitors: 2431, leads: 128, rate: "5.3%" },
  { page: "/starlink-installation", visitors: 1186, leads: 49, rate: "4.1%" },
  { page: "/commercial-starlink-installation", visitors: 402, leads: 21, rate: "5.2%" },
];

export default function TablePage() {
  return (
    <>
      <PageHeader
        title="Table"
        lead="Rows of records you read or compare: leads, landing pages, experiment results. The dashboard's most used component, on seven screens."
      />

      <Section title="Default" note="For reading a list, one record per row.">
        <Preview>
          <div className="w-full overflow-x-auto">
            <DataTable>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>City</TableHeaderCell>
                  <TableHeaderCell>Service</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {LEADS.map((l) => (
                  <TableRow key={l.name} className="hover:bg-secondary/30">
                    <TableCell className="font-medium text-foreground">{l.name}</TableCell>
                    <TableCell>{l.city}</TableCell>
                    <TableCell>{l.service}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{l.date}</TableCell>
                    <TableCell>
                      <Pill variant={STATUS_TONE[l.status]}>{STATUS_LABEL[l.status]}</Pill>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </div>
        </Preview>
        <Code>{`<Table>
  <TableHead>
    <TableRow>
      <TableHeaderCell>Name</TableHeaderCell>
      <TableHeaderCell>Status</TableHeaderCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Steven Cochrane</TableCell>
      <TableCell><Pill variant="brand">New</Pill></TableCell>
    </TableRow>
  </TableBody>
</Table>`}</Code>
      </Section>

      <Section title="Compact, with numbers" note="For scanning figures. Tighter rows, and numeric columns line up on the right.">
        <Preview>
          <div className="w-full overflow-x-auto">
            <DataTable density="compact">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Page</TableHeaderCell>
                  <TableHeaderCell numeric>Visitors</TableHeaderCell>
                  <TableHeaderCell numeric>Leads</TableHeaderCell>
                  <TableHeaderCell numeric>Conversion</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PAGES.map((p) => (
                  <TableRow key={p.page}>
                    <TableCell className="font-mono text-foreground">{p.page}</TableCell>
                    <TableCell numeric>{p.visitors.toLocaleString("en-GB")}</TableCell>
                    <TableCell numeric>{p.leads}</TableCell>
                    <TableCell numeric>{p.rate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </div>
        </Preview>
        <Code>{`<Table density="compact">
  ...
  <TableCell numeric>2,431</TableCell>
</Table>`}</Code>
        <Rule>
          Set the density once, on the table, and every cell follows. <Mono>numeric</Mono> right-aligns
          the column and gives every digit the same width, so figures line up and do not jump around
          when they change.
        </Rule>
      </Section>

      <Section title="Sizes">
        <Table
          head={["Part", "Default", "Compact"]}
          rows={[
            ["Cell padding", "16px × 12px", "12px × 8px"],
            ["Header", <span key="h">Label size, uppercase, muted, on a light grey band</span>, "Same"],
            ["Body text", <Mono key="b">text-body-sm</Mono>, "Same"],
            ["Row divider", <Mono key="d">border-border</Mono>, "Same"],
          ]}
        />
      </Section>

      <BestPractices
        when={[
          "Records with the same fields, where people compare across rows: leads, pages, results.",
          "<code>default</code> when each row is read on its own; <code>compact</code> when the point is the numbers.",
          "Not for a single record's details. That is a list of labels and values, not a table with one row.",
        ]}
        behavior={[
          "Wide tables scroll sideways inside their card; the page itself never scrolls sideways.",
          "On phones the leads list becomes cards, one per lead. A table that needs five columns is not readable at 375px.",
          "A clickable row opens the record. Links and buttons inside it stop the click from also opening the row.",
        ]}
        content={[
          "Header labels are one or two words, in sentence case; the uppercase is styling.",
          "Dates and times in one format per table. Numbers formatted for the UK (2,431).",
          "No data in a cell: say so (&ldquo;No data&rdquo;) rather than leave it blank or write a zero.",
        ]}
        accessibility={[
          "A real <code>&lt;table&gt;</code> with <code>&lt;th&gt;</code> headers, so screen readers announce the column for each cell.",
          "Status is a word plus a dot, never the colour alone.",
        ]}
      />
    </>
  );
}
