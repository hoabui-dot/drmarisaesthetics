/**
 * Markdown Content Component
 * 
 * Renders markdown content with proper formatting.
 * Supports GitHub Flavored Markdown (GFM) and HTML.
 * 
 * Features:
 * - Headings (h1-h6)
 * - Lists (ordered and unordered)
 * - Links
 * - Bold, italic, code
 * - Tables
 * - Blockquotes
 * - HTML tags
 * - Line breaks (single newlines preserved)
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

const strapiMediaUrl = (src: string) => {
  if (src.startsWith('/uploads/')) return `/api/strapi-media${src}`;
  try {
    const parsed = new URL(src);
    if (parsed.pathname.startsWith('/uploads/')) return `/api/strapi-media${parsed.pathname}`;
  } catch { /* Keep non-URL image sources unchanged. */ }
  return src;
};

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const headingId = (children: React.ReactNode) => React.Children.toArray(children).map((child) => typeof child === 'string' ? child : '').join(' ').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return (
    <div className={`prose max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Customize heading styles
          h1: ({ children }) => (
            <h1 id={headingId(children)} className="text-4xl font-bold text-foreground mb-6 mt-8">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 id={headingId(children)} className="text-3xl font-bold text-foreground mb-4 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={headingId(children)} className="text-2xl font-bold text-foreground mb-3 mt-5">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold text-foreground mb-2 mt-4">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold text-foreground mb-2 mt-3">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold text-foreground mb-2 mt-3">
              {children}
            </h6>
          ),
          // Customize paragraph styles
          p: ({ children }) => (
            <p className="text-sm sm:text-base md:text-lg text-foreground-secondary leading-relaxed mb-4">
              {children}
            </p>
          ),
          // Customize list styles
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-sm sm:text-base md:text-lg text-foreground-secondary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-sm sm:text-base md:text-lg text-foreground-secondary">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4">
              {children}
            </li>
          ),
          // Customize link styles
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary-600 hover:text-primary-700 underline transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={typeof src === 'string' ? strapiMediaUrl(src) : undefined}
              alt={alt || ''}
              loading="lazy"
              className="my-6 h-auto w-full rounded-2xl object-cover"
            />
          ),
          // Customize blockquote styles
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary-500 pl-4 py-2 my-4 italic text-foreground-secondary bg-gray-50 rounded-r">
              {children}
            </blockquote>
          ),
          // Customize code styles
          code: ({ children, className }) => {
            // Check if it's inline code (no language class)
            const isInline = !className || !className.startsWith('language-');

            if (isInline) {
              return (
                <code className="bg-gray-100 text-primary-600 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm">
                {children}
              </code>
            );
          },
          // Customize table styles
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-200 border border-primary-100">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr>
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-sm sm:text-base md:text-lg font-medium text-foreground-muted uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base md:text-lg text-foreground-secondary">
              {children}
            </td>
          ),
          // Customize horizontal rule
          hr: () => (
            <hr className="my-8 border-t-2 border-primary-100" />
          ),
          // Customize strong (bold)
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">
              {children}
            </strong>
          ),
          // Customize emphasis (italic)
          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
