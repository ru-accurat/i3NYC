import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import type { Components } from "react-markdown";

interface ContentRendererProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-12 mb-4 text-3xl font-light tracking-tight md:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-3 text-2xl font-light tracking-tight md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-2 text-lg font-medium">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-base leading-relaxed text-muted-foreground">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6 text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-base leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-primary pl-6 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-foreground">{children}</strong>
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: ({ src, alt }) =>
    src ? (
      <Image
        src={src}
        alt={alt || ""}
        width={800}
        height={450}
        className="my-6 rounded-lg"
      />
    ) : null,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
};

export function ContentRenderer({ content }: ContentRendererProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
