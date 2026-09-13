import { convertClipboardHtmlToMarkdown } from './turndown';

const normalizeCellText = (value: string) => value.replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');

type ClipboardDebugWindow = Window & {
  __DOCX_CLIPBOARD_DEBUG__?: boolean;
  __DOCX_CLIPBOARD_BRIDGE_INSTALLED__?: boolean;
  __DOCX_CLIPBOARD_NOTIFY__?: (notification: ClipboardNotification) => void;
};

export type ClipboardNotification = {
  type: 'warning' | 'danger' | 'success' | 'info';
  message: string;
};

type ClipboardBridgeOptions = {
  notify?: (notification: ClipboardNotification) => void;
};

const CLIPBOARD_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const CLIPBOARD_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
// Matches the media shape used by Better Blocks 0.23.9's own Media Library
// picker. Passing the raw Strapi response can include API-only fields that
// the editor does not expect in an image element.
const BETTER_BLOCKS_MEDIA_KEYS = [
  'name', 'alternativeText', 'url', 'caption', 'width', 'height', 'formats',
  'hash', 'ext', 'mime', 'size', 'previewUrl', 'provider', 'provider_metadata',
  'createdAt', 'updatedAt',
] as const;

const isClipboardDebugEnabled = () => typeof window !== 'undefined' && (window as ClipboardDebugWindow).__DOCX_CLIPBOARD_DEBUG__ === true;

const debugClipboard = (event: string, payload: Record<string, unknown>) => {
  const output = isClipboardDebugEnabled() ? payload : Object.fromEntries(
    Object.entries(payload).filter(([key]) => !/preview|output/i.test(key)),
  );
  console.info(`[DOCX Clipboard] ${event}`, output);
};

const notifyClipboard = (notification: ClipboardNotification) => {
  if (typeof window !== 'undefined') {
    (window as ClipboardDebugWindow).__DOCX_CLIPBOARD_NOTIFY__?.(notification);
  }
};

const isWordHtml = (html: string) => /(?:class\s*=\s*["'][^"']*\bmso|urn:schemas-microsoft-com|Microsoft Office|<!--[\s\S]*?\[if)/i.test(html);

const hasConvertibleHtml = (html: string) =>
  /<(?:table|p|div|h[1-6]|ul|ol|blockquote|pre|li|br|hr|span)[\s>]/i.test(html) || isWordHtml(html);

const findEditorRoot = (target: HTMLElement) => {
  const explicitRoot = target.closest<HTMLElement>('[contenteditable="true"]');
  if (explicitRoot) return explicitRoot;
  let current: HTMLElement | null = target;
  while (current) {
    if (current.isContentEditable && current.getAttribute('contenteditable') !== 'false') return current;
    current = current.parentElement;
  }
  return null;
};

const hasMeaningfulClipboardHtml = (html: string) => {
  if (!html.trim()) return false;
  try {
    const documentFragment = new DOMParser().parseFromString(html, 'text/html');
    documentFragment.querySelectorAll('img, br, meta, link, style').forEach((element) => element.remove());
    return Boolean(documentFragment.body.textContent?.replace(/\u00a0/g, ' ').trim());
  } catch {
    return false;
  }
};

const hasImageOnlyClipboardHtml = (html: string) => {
  if (!html.trim()) return false;
  try {
    const documentFragment = new DOMParser().parseFromString(html, 'text/html');
    const images = documentFragment.querySelectorAll('img');
    if (images.length !== 1) return false;
    images.forEach((element) => element.remove());
    documentFragment.querySelectorAll('br, meta, link, style').forEach((element) => element.remove());
    return !documentFragment.body.textContent?.replace(/\u00a0/g, ' ').trim();
  } catch {
    return false;
  }
};

type SelectionSnapshot = { target: HTMLElement; range: Range | null };

const captureSelection = (target: HTMLElement): SelectionSnapshot => {
  const selection = window.getSelection();
  const range = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
  return { target, range };
};

const restoreSelection = (snapshot: SelectionSnapshot) => {
  if (!snapshot.target.isConnected || snapshot.target.getAttribute('contenteditable') === 'false') return false;
  snapshot.target.focus({ preventScroll: true });
  if (!snapshot.range) return true;
  const selection = window.getSelection();
  if (!selection) return false;
  try {
    selection.removeAllRanges();
    selection.addRange(snapshot.range);
    return true;
  } catch {
    return false;
  }
};

const escapeMarkdown = (value: string) => value.replace(/[\\`*_\[\]]/g, '\\$&').replace(/\s+/g, ' ');

const inlineToMarkdown = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) return escapeMarkdown(node.textContent || '');
  if (!(node instanceof HTMLElement)) return '';
  const children = Array.from(node.childNodes).map(inlineToMarkdown).join('');
  const name = node.tagName.toLowerCase();
  const style = (node.getAttribute('style') || '').toLowerCase();
  if (name === 'br') return '\n';
  if (name === 'strong' || name === 'b' || /font-weight\s*:\s*(bold|[6-9]00)/.test(style)) return `**${children}**`;
  if (name === 'em' || name === 'i' || /font-style\s*:\s*italic/.test(style)) return `*${children}*`;
  if (name === 's' || name === 'del' || name === 'strike' || /line-through/.test(style)) return `~~${children}~~`;
  if (name === 'a') {
    const href = node.getAttribute('href') || '';
    return href && /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? `[${children}](${href})` : children;
  }
  return children;
};

type BetterBlocksInline = { type: 'text'; text: string; [key: string]: unknown } | { type: 'link'; url: string; children: Array<{ type: 'text'; text: string; [key: string]: unknown }> };
type BetterBlocksNode = { type: string; children?: unknown[]; [key: string]: unknown };

const safeClipboardUrl = (value: string) => /^(https?:|mailto:|tel:|\/|#|\.\.?\/)/i.test(value.trim());

const normalizeClipboardHtml = (documentFragment: Document) => {
  // DOMParser has already created a real DOM. Remove Office-only nodes and
  // comments before either converter sees the content.
  Array.from(documentFragment.querySelectorAll('*')).forEach((element) => {
    if (/^(?:o|w|v|m):/i.test(element.tagName)) {
      const parent = element.parentNode;
      if (!parent) return;
      while (element.firstChild) parent.insertBefore(element.firstChild, element);
      element.remove();
    }
  });
  const walker = documentFragment.createTreeWalker(documentFragment.body, NodeFilter.SHOW_COMMENT);
  const comments: Comment[] = [];
  let current: Node | null = walker.nextNode();
  while (current) {
    comments.push(current as Comment);
    current = walker.nextNode();
  }
  comments.forEach((comment) => comment.remove());
  // Column declarations describe layout only. Better Blocks derives its
  // editable grid from actual table cells; retaining <colgroup> can make the
  // browser/GFM table adapter infer a phantom trailing column.
  documentFragment.querySelectorAll('colgroup, col').forEach((element) => element.remove());

  // Word/Google Docs frequently put every row in <tbody> without a semantic
  // header. Turndown's GFM table rule needs a real header row; construct one
  // from the first row, matching Better Blocks' table convention.
  documentFragment.querySelectorAll('table').forEach((table) => {
    if (table.querySelector('thead')) return;
    const rows = Array.from(table.querySelectorAll('tr')).filter((row) => row.closest('table') === table);
    if (!rows.length) return;
    const header = rows[0];
    header.querySelectorAll(':scope > td').forEach((cell) => {
      const th = documentFragment.createElement('th');
      Array.from(cell.attributes).forEach((attribute) => th.setAttribute(attribute.name, attribute.value));
      while (cell.firstChild) th.appendChild(cell.firstChild);
      cell.replaceWith(th);
    });
    const thead = documentFragment.createElement('thead');
    thead.appendChild(header);
    const bodyRows = rows.slice(1);
    const tbody = documentFragment.createElement('tbody');
    bodyRows.forEach((row) => tbody.appendChild(row));
    table.replaceChildren(thead, ...(bodyRows.length ? [tbody] : []));
  });

  // Google Docs and Word often wrap every text run in a span. Keep spans that
  // carry semantic marks/styles, but flatten empty presentation-only wrappers.
  documentFragment.querySelectorAll('span').forEach((span) => {
    if (!span.attributes.length && span.parentNode) {
      while (span.firstChild) span.parentNode.insertBefore(span.firstChild, span);
      span.remove();
    }
  });
  return documentFragment;
};

const styleValue = (element: HTMLElement, property: string) => {
  const style = (element.getAttribute('style') || '').toLowerCase();
  const match = style.match(new RegExp(`${property}\\s*:\\s*([^;]+)`));
  return match?.[1]?.trim() || '';
};

const inlineMarks = (element: HTMLElement, inherited: Record<string, unknown> = {}) => {
  const name = element.tagName.toLowerCase();
  const marks = { ...inherited };
  const fontWeight = styleValue(element, 'font-weight');
  const fontStyle = styleValue(element, 'font-style');
  const textDecoration = styleValue(element, 'text-decoration');
  if (name === 'strong' || name === 'b' || /^(bold|[6-9]00)$/.test(fontWeight)) marks.bold = true;
  if (name === 'em' || name === 'i' || fontStyle === 'italic') marks.italic = true;
  if (name === 'u' || name === 'ins' || /underline/.test(textDecoration)) marks.underline = true;
  if (name === 's' || name === 'del' || name === 'strike' || /line-through/.test(textDecoration)) marks.strikethrough = true;
  const color = styleValue(element, 'color');
  const backgroundColor = styleValue(element, 'background-color');
  if (/^(?:#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|[a-z]+)$/i.test(color)) marks.color = color;
  if (/^(?:#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|[a-z]+)$/i.test(backgroundColor)) marks.backgroundColor = backgroundColor;
  const fontFace = element.getAttribute('face') || '';
  const fontFamily = (styleValue(element, 'font-family') || fontFace).replace(/["']/g, '').trim();
  if (fontFamily && /^[a-z0-9 ,_-]+$/i.test(fontFamily)) marks.fontFamily = fontFamily;
  const fontSize = styleValue(element, 'font-size') || element.getAttribute('size') || '';
  if (fontSize && /^\d+(?:\.\d+)?(?:px|pt|em|rem|%)$/i.test(fontSize)) marks.fontSize = fontSize;
  return marks;
};

const inlineNodes = (root: Node, inherited: Record<string, unknown> = {}): BetterBlocksInline[] => {
  const nodes: BetterBlocksInline[] = [];
  Array.from(root.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent || '';
      if (text) nodes.push({ type: 'text', text, ...inherited });
      return;
    }
    if (!(child instanceof HTMLElement)) return;
    const name = child.tagName.toLowerCase();
    if (name === 'br') {
      nodes.push({ type: 'text', text: '\n', ...inherited });
      return;
    }
    if (name === 'a') {
      const url = child.getAttribute('href') || '';
      const children = inlineNodes(child, inherited).filter((node): node is { type: 'text'; text: string; [key: string]: unknown } => node.type === 'text');
      if (safeClipboardUrl(url) && children.length) nodes.push({ type: 'link', url, children });
      else nodes.push(...children);
      return;
    }
    nodes.push(...inlineNodes(child, inlineMarks(child, inherited)));
  });
  return nodes;
};

const nonEmptyInlineNodes = (element: Element) => {
  const nodes = inlineNodes(element);
  return nodes.length ? nodes : [{ type: 'text', text: '' }];
};

const tableToBetterBlocks = (table: HTMLTableElement): BetterBlocksNode => {
  const tableRows = Array.from(table.querySelectorAll('tr'));
  const hasExplicitHeader = Boolean(table.querySelector('thead th'));
  const rows = tableRows.map((row, rowIndex) => {
    const cells = Array.from(row.children)
      .filter((cell) => /^(th|td)$/i.test(cell.tagName))
      .map((cell) => {
        // Word frequently exports header cells as <td> inside <tbody>. Better
        // Blocks needs the first semantic row to be represented as header
        // cells, otherwise the table is rendered as an unstructured grid.
        const isHeader = cell.tagName.toLowerCase() === 'th'
          || (!hasExplicitHeader && rowIndex === 0);
        const node: BetterBlocksNode = {
          type: isHeader ? 'table-header-cell' : 'table-cell',
          children: nonEmptyInlineNodes(cell),
        };
        const colSpan = Number(cell.getAttribute('colspan') || 1);
        const rowSpan = Number(cell.getAttribute('rowspan') || 1);
        if (colSpan > 1) node.colSpan = colSpan;
        if (rowSpan > 1) node.rowSpan = rowSpan;
        const align = (cell.getAttribute('align') || styleValue(cell as HTMLElement, 'text-align')).toLowerCase();
        if (align === 'left' || align === 'center' || align === 'right') node.align = align;
        return node;
      });
    return { type: 'table-row', children: cells };
  }).filter((row) => row.children.length);
  return { type: 'table', children: rows };
};

const htmlToBetterBlocks = (root: ParentNode) => {
  const blocks: BetterBlocksNode[] = [];
  const headingFromElement = (element: Element) => {
    const name = element.tagName.toLowerCase();
    if (/^h[1-6]$/.test(name)) return Number(name.slice(1));
    const className = element.getAttribute('class') || '';
    const style = element.getAttribute('style') || '';
    const outline = style.match(/mso-outline-level\s*:\s*([1-6])/i)?.[1];
    const wordHeading = className.match(/(?:mso)?heading\s*([1-6])/i)?.[1]
      || (className.match(/mso-title/i) ? '1' : undefined);
    return Number(outline || wordHeading || 0) || null;
  };
  const listToNode = (element: Element, indentLevel = 0): BetterBlocksNode => {
    const children: BetterBlocksNode[] = [];
    Array.from(element.children)
      .filter((child) => child.tagName.toLowerCase() === 'li')
      .forEach((item) => {
        const nested = Array.from(item.children).filter((child) => /^(ul|ol)$/i.test(child.tagName));
        const inlineWrapper = item.cloneNode(true) as HTMLElement;
        nested.forEach((child) => child.remove());
        children.push({ type: 'list-item', children: nonEmptyInlineNodes(inlineWrapper) });
        // Better Blocks 0.23.9 represents nested lists as sibling list nodes
        // under the parent list, distinguished by indentLevel. Putting the
        // nested list inside list-item.children makes the validator/editor
        // treat it as an invalid inline node and flatten it.
        nested.forEach((child) => {
          children.push(listToNode(child, indentLevel + 1));
        });
      });
    const node: BetterBlocksNode = {
      type: 'list',
      format: element.tagName.toLowerCase() === 'ol' ? 'ordered' : 'unordered',
      children,
    };
    if (indentLevel > 0) node.indentLevel = indentLevel;
    return node;
  };
  const visit = (element: Element) => {
    const name = element.tagName.toLowerCase();
    const headingLevel = headingFromElement(element);
    if (headingLevel) {
      blocks.push({ type: 'heading', level: headingLevel, children: nonEmptyInlineNodes(element) });
      return;
    }
    if (name === 'p') {
      blocks.push({ type: 'paragraph', children: nonEmptyInlineNodes(element) });
      return;
    }
    if (name === 'div') {
      const blockChildren = Array.from(element.children).filter((child) => /^(h[1-6]|p|div|ul|ol|blockquote|pre|table|hr)$/i.test(child.tagName));
      if (blockChildren.length) blockChildren.forEach(visit);
      else if (element.textContent?.trim()) blocks.push({ type: 'paragraph', children: nonEmptyInlineNodes(element) });
      return;
    }
    if (name === 'ul' || name === 'ol') {
      blocks.push(listToNode(element));
      return;
    }
    if (name === 'blockquote') blocks.push({ type: 'quote', children: nonEmptyInlineNodes(element) });
    else if (name === 'pre') blocks.push({ type: 'code', language: 'plaintext', children: nonEmptyInlineNodes(element) });
    else if (name === 'table') blocks.push(tableToBetterBlocks(element as HTMLTableElement));
    else if (name === 'hr') blocks.push({ type: 'horizontal-line', children: [{ type: 'text', text: '' }] });
    else Array.from(element.children).forEach(visit);
  };
  const visitInto = (element: Element, destination: BetterBlocksNode[]) => {
    const before = blocks.length;
    visit(element);
    destination.push(...blocks.splice(before));
  };
  Array.from(root.children).forEach(visit);
  return blocks;
};

const tableToMarkdown = (table: HTMLTableElement) => {
  const rows = Array.from(table.querySelectorAll('tr'))
    .map((row) => Array.from(row.children)
      .filter((cell) => /^(th|td)$/i.test(cell.tagName))
      .map((cell) => normalizeCellText(inlineToMarkdown(cell))))
    .filter((row) => row.length > 0);

  if (!rows.length) return '';
  const columnCount = Math.max(...rows.map((row) => row.length));
  const padded = rows.map((row) => [...row, ...Array(columnCount - row.length).fill('')]);
  const header = `| ${padded[0].join(' | ')} |`;
  const divider = `| ${padded[0].map(() => '---').join(' | ')} |`;
  const body = padded.slice(1).map((row) => `| ${row.join(' | ')} |`);
  return [header, divider, ...body].join('\n');
};

const blocksToMarkdown = (root: ParentNode): string => {
  const visit = (node: Element): string => {
    const name = node.tagName.toLowerCase();
    if (name === 'table') return tableToMarkdown(node as HTMLTableElement);
    if (/^h[1-6]$/.test(name)) return `${'#'.repeat(Number(name.slice(1)))} ${inlineToMarkdown(node)}`;
    if (name === 'p' || name === 'div') {
      const childBlocks = Array.from(node.children).filter((child) => /^(h[1-6]|p|div|ul|ol|blockquote|pre|table|hr)$/i.test(child.tagName));
      return childBlocks.length ? childBlocks.map(visit).join('\n\n') : inlineToMarkdown(node);
    }
    if (name === 'ul' || name === 'ol') {
      return Array.from(node.children).filter((child) => child.tagName.toLowerCase() === 'li').map((item, index) => {
        const prefix = name === 'ol' ? `${index + 1}. ` : '- ';
        return `${prefix}${inlineToMarkdown(item)}`;
      }).join('\n');
    }
    if (name === 'blockquote') return inlineToMarkdown(node).split('\n').map((line) => `> ${line}`).join('\n');
    if (name === 'pre') return ['```', node.textContent || '', '```'].join('\n');
    if (name === 'hr') return '---';
    return inlineToMarkdown(node);
  };

  return Array.from(root.children).map(visit).map((value) => value.trim()).filter(Boolean).join('\n\n');
};

const encodeSlateFragment = (blocks: BetterBlocksNode[]) => {
  // Same encoding used by slate-react's public withReact clipboard format.
  // URL encoding keeps Vietnamese and other Unicode text safe for btoa.
  return window.btoa(encodeURIComponent(JSON.stringify(blocks)));
};

const dispatchBetterBlocksPaste = (target: HTMLElement, blocks: BetterBlocksNode[], markdown: string) => {
  const data = new DataTransfer();
  const encodedFragment = encodeSlateFragment(blocks);
  // Better Blocks 0.23.9 wraps Slate's insertData. Supplying only this MIME
  // type bypasses its text/plain GFM branch and lets Slate insert the already
  // converted Better Blocks nodes, preserving marks and table structure.
  data.setData('application/x-slate-fragment', encodedFragment);

  // Slate 0.94 intentionally handles application/x-slate-fragment through its
  // native beforeinput path in Chromium. A synthetic `paste` event alone is
  // not enough there because Slate only falls back to onPaste for plain text.
  // Dispatching the same input type as a real browser paste keeps the editor's
  // own insertion/history path without using private editor APIs.
  let syntheticEvent: InputEvent;
  try {
    syntheticEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertFromPaste',
    });
  } catch {
    syntheticEvent = new Event('beforeinput', { bubbles: true, cancelable: true }) as InputEvent;
  }

  // InputEvent's dataTransfer is read-only and is not accepted by all browser
  // constructors, so define it explicitly when necessary.
  if ((syntheticEvent as InputEvent & { dataTransfer?: DataTransfer }).dataTransfer?.getData('application/x-slate-fragment') !== encodedFragment) {
    try {
      Object.defineProperty(syntheticEvent, 'clipboardData', {
        configurable: true,
        value: data,
      });
      Object.defineProperty(syntheticEvent, 'dataTransfer', {
        configurable: true,
        value: data,
      });
    } catch {
      debugClipboard('paste-dispatch-failed', {
        reason: 'clipboardData-property-not-writable',
        fragmentLength: encodedFragment.length,
        });
      return false;
    }
  }

  const eventDataTransfer = (syntheticEvent as InputEvent & { dataTransfer?: DataTransfer }).dataTransfer;
  if (!eventDataTransfer) {
    debugClipboard('paste-dispatch-failed', { reason: 'event-clipboardData-missing' });
    return false;
  }

  const clipboardFragment = eventDataTransfer.getData('application/x-slate-fragment') || '';
  if (clipboardFragment !== encodedFragment) {
    debugClipboard('paste-dispatch-failed', {
      reason: 'clipboardData-verification-failed',
      expectedLength: encodedFragment.length,
      actualLength: clipboardFragment.length,
    });
    return false;
  }

  // `dispatchEvent()` returns false when Slate calls preventDefault() on the
  // beforeinput event. That is the successful path: Slate has accepted the
  // fragment and queued the insert operation. The previous implementation
  // treated false as a dispatch failure and immediately sent the same content
  // again as Markdown, which produced duplicated literal Markdown and broken
  // tables in Better Blocks 0.23.9.
  const dispatchResult = target.dispatchEvent(syntheticEvent);
  const handled = syntheticEvent.defaultPrevented || !dispatchResult;
  debugClipboard('paste-dispatched', {
    dispatched: handled,
    dispatchResult,
    defaultPrevented: syntheticEvent.defaultPrevented,
    target: target.tagName,
    clipboardTypes: Array.from(data.types),
    eventClipboardTypes: Array.from(eventDataTransfer.types),
    eventType: syntheticEvent.type,
    outputMode: 'slate-fragment',
    fragmentLength: encodedFragment.length,
    markdownLength: markdown.length,
  });
  return handled;
};

const dispatchBetterBlocksMarkdownFallback = (target: HTMLElement, markdown: string) => {
  if (!markdown) return false;
  const data = new DataTransfer();
  // Better Blocks 0.23.9's GFM branch requires exactly one non-empty MIME
  // type. This path intentionally drops styles GFM cannot represent and is
  // used only when the richer native Slate fragment cannot be dispatched.
  data.setData('text/plain', markdown);
  let event: ClipboardEvent;
  try {
    event = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: data,
    });
  } catch {
    event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent;
  }
  if (event.clipboardData?.getData('text/plain') !== markdown) {
    try {
      Object.defineProperty(event, 'clipboardData', { configurable: true, value: data });
    } catch {
      debugClipboard('paste-dispatch-failed', { reason: 'markdown-clipboardData-property-not-writable' });
      return false;
    }
  }
  const clipboardText = event.clipboardData?.getData('text/plain') || '';
  if (clipboardText !== markdown) return false;
  const dispatched = target.dispatchEvent(event);
  debugClipboard('paste-dispatched', {
    dispatched,
    target: target.tagName,
    clipboardTypes: Array.from(data.types),
    eventType: event.type,
    outputMode: 'gfm-markdown-fallback',
    markdownLength: markdown.length,
  });
  return dispatched;
};

const imageNodeFromMedia = (media: Record<string, unknown>): BetterBlocksNode => {
  const url = typeof media.url === 'string' ? media.url : '';
  const backendURL = (window as Window & { strapi?: { backendURL?: string } }).strapi?.backendURL || '';
  const resolvedURL = url.startsWith('/') && backendURL ? `${backendURL}${url}` : url;
  const resolvedMedia = Object.fromEntries(BETTER_BLOCKS_MEDIA_KEYS.map((key) => [
    key,
    key === 'url' ? resolvedURL : key === 'alternativeText' ? (media.alternativeText || media.name || '') : media[key],
  ]));
  return {
    type: 'image',
    image: resolvedMedia,
    children: [{ type: 'text', text: '' }],
  };
};

const uploadClipboardImage = async (file: File) => {
  const body = new FormData();
  body.append('file', file, file.name || 'clipboard-image');
  const response = await fetch('/docx-importer/upload-clipboard-image', {
    method: 'POST',
    body,
    credentials: 'include',
  });
  let payload: { data?: { media?: Record<string, unknown> }; error?: { message?: string } } = {};
  try {
    payload = await response.json() as typeof payload;
  } catch {
    throw new Error('The image upload returned an invalid response.');
  }
  if (!response.ok || !payload.data?.media?.url) {
    throw new Error(payload.error?.message || 'The image could not be uploaded.');
  }
  return imageNodeFromMedia(payload.data.media);
};

const readNativeClipboardImage = async () => {
  if (!navigator.clipboard?.read) return null;
  const clipboardItems = await Promise.race([
    navigator.clipboard.read(),
    new Promise<never>((_, reject) => {
      window.setTimeout(() => reject(new Error('clipboard-read-timeout')), 4000);
    }),
  ]);
  debugClipboard('image-paste-native-read-complete', { itemCount: clipboardItems.length, types: clipboardItems.flatMap((item) => item.types) });
  const imageTypes = clipboardItems.flatMap((item) => item.types.filter((type) => CLIPBOARD_IMAGE_TYPES.has(type.toLowerCase())));
  if (imageTypes.length !== 1) {
    if (imageTypes.length > 1) throw new Error('multiple-images');
    return null;
  }
  const clipboardItem = clipboardItems.find((item) => item.types.includes(imageTypes[0]));
  if (!clipboardItem) return null;
  const blob = await clipboardItem.getType(imageTypes[0]);
  debugClipboard('image-paste-native-image-resolved', { type: blob.type, size: blob.size });
  return new File([blob], `clipboard-image.${imageTypes[0].split('/')[1] === 'jpeg' ? 'jpg' : imageTypes[0].split('/')[1]}`, { type: imageTypes[0] });
};

const clipboardImageItems = (dataTransfer: DataTransfer) => Array.from(dataTransfer.items)
  .filter((item) => item.kind === 'file' && item.type.toLowerCase().startsWith('image/'));

const clipboardFileItems = (dataTransfer: DataTransfer) => Array.from(dataTransfer.items)
  .filter((item) => item.kind === 'file');

const handleImageClipboardPaste = async (event: ClipboardEvent, dataTransfer: DataTransfer) => {
  const imageItems = clipboardImageItems(dataTransfer);
  const html = dataTransfer.getData('text/html');
  const plainText = dataTransfer.getData('text/plain');
  const imageOnlyHtml = !imageItems.length && !plainText.trim() && hasImageOnlyClipboardHtml(html);
  if (!imageItems.length && !imageOnlyHtml) return false;

  const hasMixedText = hasMeaningfulClipboardHtml(html) || Boolean(plainText.trim());
  const fileItems = clipboardFileItems(dataTransfer);

  // This listener is deliberately narrow: a text-only or HTML-only paste is
  // left to the existing DOCX/Turndown bridge below it.
  event.preventDefault();
  event.stopImmediatePropagation();

  if (imageItems.length > 1) {
    notifyClipboard({ type: 'warning', message: 'Pasting multiple images is not supported yet. Please paste one image at a time.' });
    debugClipboard('image-paste-blocked', { reason: 'multiple-images', imageCount: imageItems.length });
    return true;
  }
  if ((!imageOnlyHtml && fileItems.length !== 1) || hasMixedText) {
    notifyClipboard({ type: 'warning', message: 'Pasting text and images together is not supported yet. Please paste the image separately or use Import DOCX.' });
    debugClipboard('image-paste-blocked', { reason: 'mixed-content', imageCount: imageItems.length, fileCount: fileItems.length, hasMixedText });
    return true;
  }

  const item = imageItems[0];
  let file: File | null = item?.getAsFile() || null;
  if (!file && imageOnlyHtml) {
    notifyClipboard({ type: 'info', message: 'Reading image from the clipboard…' });
    debugClipboard('image-paste-native-read-started', { reason: 'browser-did-not-expose-image-file' });
    try {
      file = await readNativeClipboardImage();
    } catch (error) {
      if (error instanceof Error && error.message === 'multiple-images') {
        notifyClipboard({ type: 'warning', message: 'Pasting multiple images is not supported yet. Please paste one image at a time.' });
        debugClipboard('image-paste-blocked', { reason: 'multiple-images-native-clipboard' });
        return true;
      }
      notifyClipboard({ type: 'warning', message: 'The browser did not expose the copied image. Please paste the image separately or use Import DOCX.' });
      debugClipboard('image-paste-native-read-failed', { reason: error instanceof Error ? error.message : String(error) });
      return true;
    }
  }
  if (!file) {
    notifyClipboard({ type: 'danger', message: 'The clipboard image could not be read. Please try copying it again.' });
    return true;
  }
  if (!CLIPBOARD_IMAGE_TYPES.has(file.type.toLowerCase())) {
    notifyClipboard({ type: 'warning', message: 'This image format is not supported. Please use PNG, JPEG or WebP.' });
    debugClipboard('image-paste-blocked', { reason: 'unsupported-image-type', type: file.type });
    return true;
  }
  if (!file.size || file.size > CLIPBOARD_IMAGE_MAX_BYTES) {
    notifyClipboard({ type: 'warning', message: `This image is too large. Please choose an image smaller than ${CLIPBOARD_IMAGE_MAX_BYTES / 1024 / 1024} MB.` });
    debugClipboard('image-paste-blocked', { reason: 'image-too-large', size: file.size });
    return true;
  }

  const sourceTarget = event.target instanceof HTMLElement ? event.target : null;
  const editorTarget = sourceTarget ? findEditorRoot(sourceTarget) : null;
  if (!editorTarget) {
    notifyClipboard({ type: 'warning', message: 'Place the cursor inside Better Blocks before pasting an image.' });
    return true;
  }

  const selectionSnapshot = captureSelection(editorTarget);
  notifyClipboard({ type: 'info', message: 'Uploading image to the Media Library…' });
  debugClipboard('image-paste-started', { type: file.type, size: file.size, name: file.name });
  try {
    debugClipboard('image-paste-upload-started', { type: file.type, size: file.size, name: file.name });
    const imageNode = await uploadClipboardImage(file);
    debugClipboard('image-paste-upload-complete', { type: file.type, size: file.size });
    if (!restoreSelection(selectionSnapshot)) {
      notifyClipboard({ type: 'warning', message: 'The image was uploaded, but the original editor position is no longer available.' });
      debugClipboard('image-paste-failed', { reason: 'selection-not-restored' });
      return true;
    }
    const dispatched = dispatchBetterBlocksPaste(editorTarget, [imageNode], '');
    if (!dispatched) throw new Error('Better Blocks did not accept the image node.');
    notifyClipboard({ type: 'success', message: 'Image uploaded and inserted into Better Blocks.' });
    debugClipboard('image-paste-inserted', { type: file.type, size: file.size, name: file.name, outputMode: 'slate-fragment' });
  } catch (error) {
    notifyClipboard({ type: 'danger', message: 'The image could not be uploaded. Please try again.' });
    debugClipboard('image-paste-failed', { reason: error instanceof Error ? error.message : String(error) });
  }
  return true;
};

/**
 * Word places copied content in text/html. Convert it to a constrained
 * Better Blocks fragment and GFM fallback, then redispatch it through Slate's
 * own insertion path so the editor updates its React state and history.
 */
export const installWordTableClipboardBridge = (options: ClipboardBridgeOptions = {}) => {
  const debugWindow = window as ClipboardDebugWindow;
  if (options.notify) debugWindow.__DOCX_CLIPBOARD_NOTIFY__ = options.notify;
  if (debugWindow.__DOCX_CLIPBOARD_BRIDGE_INSTALLED__) {
    debugClipboard('bridge-already-installed', {});
    return () => {};
  }
  debugWindow.__DOCX_CLIPBOARD_BRIDGE_INSTALLED__ = true;
  debugClipboard('bridge-installed', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  });

  const onKeyDown = (event: KeyboardEvent) => {
    if (!(event.target instanceof HTMLElement) || !event.target.isContentEditable) return;
    const key = event.key.toLowerCase();
    if (!['c', 'v', 'z'].includes(key) || (!event.ctrlKey && !event.metaKey)) return;
    debugClipboard('shortcut', {
      key: event.key,
      modifier: event.metaKey ? 'Command' : 'Control',
      platform: navigator.platform,
      defaultPrevented: event.defaultPrevented,
    });
  };

  const onPaste = (event: ClipboardEvent) => {
    if (!event.isTrusted || !(event.target instanceof HTMLElement) || !event.target.isContentEditable) return;
    if (event.defaultPrevented) return;
    const html = event.clipboardData?.getData('text/html') || '';
    const plainText = event.clipboardData?.getData('text/plain') || '';
    debugClipboard('paste-received', {
      trusted: event.isTrusted,
      types: event.clipboardData ? Array.from(event.clipboardData.types) : [],
      files: event.clipboardData ? Array.from(event.clipboardData.files).map((file) => ({ name: file.name, type: file.type, size: file.size })) : [],
      htmlLength: html.length,
      plainTextLength: plainText.length,
      htmlPreview: html.slice(0, 500),
      plainTextPreview: plainText.slice(0, 500),
    });
    const convertibleHtml = hasConvertibleHtml(html);
    if (!convertibleHtml) {
      debugClipboard('paste-not-intercepted', {
        reason: 'no-convertible-html',
        htmlLength: html.length,
        plainTextLength: plainText.length,
      });
      return;
    }

    const parser = new DOMParser();
    const documentFragment = parser.parseFromString(html, 'text/html');
    documentFragment.querySelectorAll('script,style,iframe,object,embed,form,noscript').forEach((element) => element.remove());
    documentFragment.querySelectorAll('*').forEach((element) => {
      Array.from(element.attributes).forEach((attribute) => {
        if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
      });
      ['href', 'src'].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value && !safeClipboardUrl(value)) element.removeAttribute(attribute);
      });
    });
    normalizeClipboardHtml(documentFragment);
    // Direct paste cannot upload embedded clipboard images safely. Use the
    // Import DOCX modal for image-bearing content so Media Library upload and
    // Better Blocks image nodes are preserved.
    if (documentFragment.querySelector('img')) return;
    const blocks = htmlToBetterBlocks(documentFragment.body);
    let markdown = '';
    try {
      markdown = convertClipboardHtmlToMarkdown(documentFragment.body);
    } catch (error) {
      debugClipboard('markdown-conversion-fallback', {
        reason: error instanceof Error ? error.message : String(error),
      });
      markdown = blocksToMarkdown(documentFragment.body);
    }
    markdown ||= plainText.trim();
    if (!markdown && !blocks.length) return;

    const tableCount = documentFragment.querySelectorAll('table').length;
    const tableRowCount = Array.from(documentFragment.querySelectorAll('table')).reduce((count, table) => count + table.querySelectorAll('tr').length, 0);
    const tableColumnCounts = Array.from(documentFragment.querySelectorAll('table')).map((table) => Math.max(
      0,
      ...Array.from(table.querySelectorAll('tr')).map((row) => Array.from(row.children).filter((cell) => /^(th|td)$/i.test(cell.tagName)).length),
    ));

    debugClipboard('paste-converted', {
      source: 'text/html',
      tableCount,
      tableRowCount,
      tableColumnCounts,
      output: markdown,
      outputMode: 'slate-fragment',
      fragmentBlockCount: blocks.length,
      fragmentBlockTypes: blocks.map((block) => block.type),
    });

    const sourceTarget = event.target;
    const editorTarget = findEditorRoot(sourceTarget);
    if (!editorTarget) {
      debugClipboard('paste-native-restored', { reason: 'contenteditable-root-not-found', sourceTarget: sourceTarget.tagName });
      return;
    }
    try {
      // Stop the original Word HTML before Slate sees it. The native Slate
      // fragment path keeps the exact Better Blocks node tree; Markdown is
      // retained only as a diagnostic/fallback representation.
      // The native Slate fragment is the primary path for every rich payload,
      // including tables. It inserts the already validated table-cell tree and
      // cannot be flattened into literal Markdown text by Better Blocks.
      let dispatched = dispatchBetterBlocksPaste(editorTarget, blocks, markdown || plainText.trim());
      if (!dispatched) {
        dispatched = dispatchBetterBlocksMarkdownFallback(editorTarget, markdown || plainText.trim());
      }
      debugClipboard('paste-target-resolved', {
        sourceTarget: sourceTarget.tagName,
        editorTarget: editorTarget.tagName,
        editorContentEditable: editorTarget.getAttribute('contenteditable'),
      });
      if (!dispatched) {
        debugClipboard('paste-native-restored', { reason: 'synthetic-paste-dispatch-failed' });
        return;
      }
      // Only consume the original event after the replacement event has been
      // constructed, verified, and dispatched successfully. If construction
      // fails, the browser keeps its native paste behavior instead of losing
      // the user's clipboard action.
      event.preventDefault();
      event.stopImmediatePropagation();
    } catch (error) {
      debugClipboard('paste-dispatch-failed', {
        reason: 'exception',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const onImagePaste = (event: ClipboardEvent) => {
    if (!event.isTrusted || !(event.target instanceof HTMLElement) || !event.target.isContentEditable || !event.clipboardData) return;
    void handleImageClipboardPaste(event, event.clipboardData);
  };

  document.addEventListener('keydown', onKeyDown, true);
  // Register before the existing rich-text listener. Image-only and mixed
  // image payloads are consumed here; all other paste payloads continue to
  // the established DOCX/Turndown path unchanged.
  document.addEventListener('paste', onImagePaste, true);
  document.addEventListener('paste', onPaste, true);
  return () => {
    document.removeEventListener('keydown', onKeyDown, true);
    document.removeEventListener('paste', onImagePaste, true);
    document.removeEventListener('paste', onPaste, true);
  };
};
