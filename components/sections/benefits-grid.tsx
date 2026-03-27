"use client";

import { Separator } from "@/components/ui/separator";
import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsGridProps {
  label?: string;
  title: string;
  benefits: Benefit[];
  fieldPrefix?: string;
}

export function BenefitsGrid({ label, title, benefits, fieldPrefix }: BenefitsGridProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-sm tracking-wide text-primary" />
          ) : (
            <p className="text-sm tracking-wide text-primary">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <Separator className="mt-12 opacity-40" />
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, idx) => (
            <div key={idx} className="group relative">
              {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.title`} value={b.title} as="h3" className="text-base font-medium" />
              ) : (
                <h3 className="text-base font-medium">{b.title}</h3>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.description`} value={b.description} as="p" className="mt-2 text-sm leading-relaxed text-muted-foreground" multiline />
              ) : (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              )}
            </div>
          ))}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add benefit" />}
        </div>
      </div>
    </section>
  );
}
