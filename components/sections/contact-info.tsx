"use client";

import Link from "next/link";
import { EditableText } from "@/components/editor/editable-text";

interface ContactInfoProps {
  contact: {
    label: string;
    title: string;
    description: string;
    email: string;
    linkedin: string;
    linkedinLabel: string;
    location: string;
  };
  fieldPrefix?: string;
}

export function ContactInfo({ contact, fieldPrefix }: ContactInfoProps) {
  return (
    <section className="py-28">
      <div className="mx-auto grid max-w-6xl gap-16 px-8 md:grid-cols-2">
        <div>
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={contact.label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary" />
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{contact.label}</p>
          )}
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.title`} value={contact.title} as="h2" className="mt-4 text-3xl font-light tracking-tight md:text-4xl" multiline />
          ) : (
            <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">{contact.title}</h2>
          )}
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.description`} value={contact.description} as="p" className="mt-6 text-base leading-relaxed text-muted-foreground" multiline />
          ) : (
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{contact.description}</p>
          )}
          <div className="mt-10 flex items-center gap-6">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Email Us
            </a>
            <Link
              href="/membership"
              className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              View membership
            </Link>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">Email</p>
            <a href={`mailto:${contact.email}`} className="mt-2 block text-base text-foreground transition-colors hover:text-primary">
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.email`} value={contact.email} as="span" />
              ) : (
                contact.email
              )}
            </a>
          </div>
          <div>
            <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">LinkedIn</p>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 block text-base text-foreground transition-colors hover:text-primary">
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.linkedinLabel`} value={contact.linkedinLabel} as="span" />
              ) : (
                contact.linkedinLabel
              )}
            </a>
          </div>
          <div>
            <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">Location</p>
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.location`} value={contact.location} as="p" className="mt-2 text-base text-muted-foreground" />
            ) : (
              <p className="mt-2 text-base text-muted-foreground">{contact.location}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
