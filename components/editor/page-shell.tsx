"use client";

import { EditButton } from "./edit-button";
import { BlockRenderer } from "./block-renderer";
import { SectionWrapper, AddSectionButton } from "./section-wrapper";
import { useEditor } from "./editor-provider";
import type { PageSections } from "@/lib/sections";

interface PageShellProps {
  slug: string;
  data: PageSections;
  isAdmin: boolean;
}

export function PageShell({ slug, data, isAdmin }: PageShellProps) {
  return (
    <>
      <PageContent data={data} />
      {isAdmin && <EditButton slug={slug} pageData={data} />}
    </>
  );
}

/** Renders either live-editing sections or static sections */
function PageContent({ data }: { data: PageSections }) {
  const { isEditing, sections: liveSections } = useEditor();
  const sections = isEditing ? liveSections : data.sections;

  return (
    <>
      {isEditing && <AddSectionButton afterIndex={-1} />}
      {sections.map((section, idx) => (
        <div key={section.id}>
          <SectionWrapper section={section} index={idx} total={sections.length}>
            <BlockRenderer section={section} />
          </SectionWrapper>
          {isEditing && <AddSectionButton afterIndex={idx} />}
        </div>
      ))}
    </>
  );
}
