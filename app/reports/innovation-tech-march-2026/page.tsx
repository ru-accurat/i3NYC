import { ReportNav } from "@/components/report/report-nav";
import { KPICard } from "@/components/report/kpi-card";
import { OverviewCharts } from "./sections/overview-charts";
import { TechCharts } from "./sections/tech-charts";
import { AcademiaCharts } from "./sections/academia-charts";
import { CommunityCharts } from "./sections/community-charts";
import { MethodologyCharts } from "./sections/methodology-charts";

export default function InnovationTechReportPage() {
  return (
    <main>
      {/* Hero */}
      <section className="flex min-h-[50vh] flex-col items-start justify-center px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm tracking-wide text-primary">Italian Innovation Community</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Innovation & Tech Report{" "}
            <span className="text-primary">· March 2026</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
            A data-driven analysis of 1,473 Italian and Italian-American innovation and technology professionals across the TriState area.
          </p>
          <p className="mt-3 text-xs text-muted-foreground/60">
            Stakeholder Report · TriState Area · I3/NYC
          </p>
        </div>
      </section>

      <ReportNav />

      {/* ═══ OVERVIEW ═══ */}
      <section id="overview" className="scroll-mt-32 border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-sm tracking-wide text-primary">Overview</p>
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
            Community Composition
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            A comprehensive mapping of Italian and Italian-American professionals working in innovation and technology sectors across New York, New Jersey, and Connecticut.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPICard value="1,473" label="Innovation/Tech Profiles" />
            <KPICard value="1,066" label="Confirmed Italian" sublabel="72.4%" />
            <KPICard value="407" label="Italian-American" sublabel="27.6%" />
            <KPICard value="567" label="In Tech Companies" sublabel="38.5%" />
          </div>

          <div className="mt-16">
            <OverviewCharts />
          </div>
        </div>
      </section>

      {/* ═══ TECH STARTUP & COMPANY ═══ */}
      <section id="tech-startup" className="scroll-mt-32 border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-sm tracking-wide text-primary">Tech Startup & Company</p>
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
            Technology Company Focus
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Deep dive into the 567 professionals working in technology companies — from Big Tech to startups.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPICard value="567" label="Tech Company Profiles" sublabel="38.5% of Innovation/Tech" />
            <KPICard value="162" label="C-Suite & Founders" sublabel="28.6% of Tech Co." />
            <KPICard value="295" label="Software & IT" sublabel="52.0% — Top Sector" />
            <KPICard value="129" label="Life Sciences" sublabel="22.8%" />
          </div>

          <div className="mt-16">
            <TechCharts />
          </div>

          {/* Top Companies Table */}
          <div className="mt-16">
            <h4 className="text-sm tracking-wide text-muted-foreground">Top Tech Companies by Italian Talent</h4>
            <p className="mt-2 mb-6 text-xs text-muted-foreground/60">
              Google, IBM, and Amazon collectively host 59 Italian innovation professionals — the largest concentration in Big Tech.
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-4 py-3 text-left text-xs font-normal tracking-wide text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left text-xs font-normal tracking-wide text-muted-foreground">Company</th>
                    <th className="px-4 py-3 text-right text-xs font-normal tracking-wide text-muted-foreground">Profiles</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Google", 26], ["IBM", 18], ["Amazon", 15], ["Regeneron", 13],
                    ["Bristol Myers Squibb", 9], ["Meta", 7], ["Novartis", 6], ["EY", 6],
                    ["Apple", 6], ["AWS", 6], ["Merck", 6], ["Nokia", 4],
                    ["Mt Sinai Health Sys", 4], ["Sanofi", 4], ["Uber", 4],
                  ].map(([company, count], i) => (
                    <tr key={i} className="border-b border-border/50 transition-colors hover:bg-primary/5">
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2.5 text-foreground/80">{company}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-primary">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ACADEMIA & RESEARCH ═══ */}
      <section id="academia" className="scroll-mt-32 border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-sm tracking-wide text-primary">Academia & Research</p>
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
            Academic Professionals
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            145 academic professionals across the TriState area, with 80% being Italian-born — concentrated in top research universities.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <KPICard value="145" label="Academic Profiles" sublabel="9.8% of Innovation/Tech" />
            <KPICard value="116" label="Italian-Born" sublabel="80.0% of academic" />
            <KPICard value="29" label="Top Title" sublabel="Assistant Professor" />
            <KPICard value="11" label="Top Institution" sublabel="Columbia University" />
          </div>

          <div className="mt-16">
            <AcademiaCharts />
          </div>

          <div className="mt-10 rounded-lg border border-primary/20 bg-primary/5 px-6 py-4">
            <p className="text-sm leading-relaxed text-foreground/80">
              <span className="font-medium text-primary">Key Insight:</span>{" "}
              Columbia University and NYU alone account for 13.8% of all academic profiles — a significant cluster for fostering university-industry partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ COMMUNITY DEEP-DIVE ═══ */}
      <section id="community" className="scroll-mt-32 border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-sm tracking-wide text-primary">Community Deep-Dive</p>
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
            Full Community Analysis
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Cross-tabulations of the full 1,473-member community by origin, seniority, industry, and employer.
          </p>

          <div className="mt-16">
            <CommunityCharts />
          </div>

          {/* Top Employers Table */}
          <div className="mt-16">
            <h4 className="text-sm tracking-wide text-muted-foreground">Top 20 Employers</h4>
            <div className="mt-6 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="px-4 py-3 text-left text-xs font-normal tracking-wide text-muted-foreground">#</th>
                    <th className="px-4 py-3 text-left text-xs font-normal tracking-wide text-muted-foreground">Organization</th>
                    <th className="px-4 py-3 text-right text-xs font-normal tracking-wide text-muted-foreground">Profiles</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Columbia University", 35], ["New York University", 28], ["Google", 26],
                    ["Mt Sinai School of Medicine", 21], ["Weill Cornell Medicine", 19],
                    ["IBM", 18], ["Memorial Sloan Kettering", 16], ["Columbia Irving Medical Center", 16],
                    ["Amazon", 15], ["Princeton University", 13], ["Yale University", 13],
                    ["Regeneron", 13], ["Bristol Myers Squibb", 9], ["Brookhaven National Lab", 8],
                    ["Bloomberg", 8], ["Yale School of Medicine", 7], ["Meta", 7],
                    ["Stony Brook University", 6], ["Simons Foundation", 6], ["AWS", 6],
                  ].map(([org, count], i) => (
                    <tr key={i} className="border-b border-border/50 transition-colors hover:bg-primary/5">
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2.5 text-foreground/80">{org}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-primary">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ METHODOLOGY ═══ */}
      <section id="methodology" className="scroll-mt-32 border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-8">
          <p className="text-sm tracking-wide text-primary">Methodology</p>
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
            Classification Framework
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            A three-layer identification framework ensures comprehensive and accurate classification of innovation and technology professionals.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-border p-6">
              <p className="font-mono text-2xl font-light text-primary">599</p>
              <p className="mt-1 text-sm font-medium text-foreground/80">Layer 1: Industry Match</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                IT services, biotechnology, pharmaceuticals, telecom, semiconductors, R&D, e-learning, aerospace, medical devices
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <p className="font-mono text-2xl font-light text-primary">742</p>
              <p className="mt-1 text-sm font-medium text-foreground/80">Layer 2: Title/Role Match</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Engineer, scientist, developer, professor, researcher, CTO, data scientist, ML engineer, product manager, architect, PhD (80+ patterns)
              </p>
            </div>
            <div className="rounded-lg border border-border p-6">
              <p className="font-mono text-2xl font-light text-primary">969</p>
              <p className="mt-1 text-sm font-medium text-foreground/80">Layer 3: Headline Match</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                AI, ML, startup, software, digital, biotech, fintech, research, cloud, blockchain, venture capital, patent (50+ terms)
              </p>
            </div>
          </div>

          <div className="mt-16">
            <MethodologyCharts />
          </div>

          <div className="mt-10 rounded-lg border border-border/50 bg-background/50 px-6 py-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              A profile is classified as Innovation/Tech if it matches on at least one layer (OR logic). 44.3% of confirmed profiles matched on 2 or more layers, providing high classification confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-8 text-center">
          <p className="text-xs text-muted-foreground">
            Italian Innovation Community · TriState Area
          </p>
          <p className="mt-1 text-xs text-muted-foreground/50">
            Non-profit initiative endorsed by the Italian Consulate in New York · Report generated March 2026
          </p>
        </div>
      </section>
    </main>
  );
}
