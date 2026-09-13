import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

/**
 * One deterministic HTML -> GFM adapter for the direct clipboard fallback.
 * It is deliberately not used as the primary rich-paste representation:
 * GFM cannot express Better Blocks marks such as fontSize/fontFamily/color.
 */
export const createBetterBlocksTurndown = () => {
  const service = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    strongDelimiter: '**',
    emDelimiter: '*',
    hr: '---',
    blankReplacement: (_content, node) => {
      if (node.nodeName === 'P' && !node.textContent?.trim()) return '';
      return '\n\n';
    },
  });

  service.use(gfm);
  return service;
};

const turndown = createBetterBlocksTurndown();

/**
 * Convert only the already-sanitized/normalized clipboard DOM. Raw Office
 * HTML must never be passed to this function.
 */
export const convertClipboardHtmlToMarkdown = (root: HTMLElement) => {
  const markdown = turndown.turndown(root).trim();
  return markdown;
};

