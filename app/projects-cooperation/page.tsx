export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";

const DEFAULT_DATA = {
  sections: [
    {
      id: "projects-hero",
      type: "hero",
      data: {
        label: "Projects & Cooperation",
        title: "Global innovation flows and",
        titleAccent: "institutional advisory.",
        description:
          "Highlighting the partnerships and missions that connect Italian institutions, regions, and organizations with the NYC innovation ecosystem.",
      },
    },
    {
      id: "projects-list",
      type: "cooperation-list",
      data: {
        label: "Strategic Cooperation",
        title: "Active projects and institutional missions.",
        items: [
          {
            name: "Fondazione Brodolini",
            description:
              "Strategic joint activities focusing on HR & Tech and human capital development.",
            contact: "Description and contact",
          },
          {
            name: "Regione Lazio Mission",
            description:
              "Leading and advising institutional missions on ecosystem discovery, market access, and custom innovation reports.",
            contact: "Description and contact",
          },
        ],
      },
    },
    {
      id: "projects-partners",
      type: "partners",
      data: {
        items: [
          "Italian Tech Alliance",
          "Italian United Italian Societies",
          "Italian Tech Club",
          "NIAF Young Professional Network",
        ],
      },
    },
    {
      id: "projects-cta",
      type: "cta",
      data: {
        title: "Partner with us as a",
        titleAccent: "convener of Italian innovation.",
        primaryLabel: "Become Member",
        primaryHref: "/membership",
        secondaryLabel: "Get in touch",
        secondaryHref: "/contact-us",
      },
    },
  ],
};

export default async function ProjectsCooperationPage() {
  const raw = (await getPageData("projects-cooperation")) ?? DEFAULT_DATA;
  const data = migratePageData("projects-cooperation", raw);
  const admin = await isAdmin();

  return (
    <PageShell slug="projects-cooperation" data={data} isAdmin={admin} />
  );
}
