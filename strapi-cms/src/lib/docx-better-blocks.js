const mammoth = require("mammoth");
const cheerio = require("cheerio");
const { marked } = require("marked");
const { validateDocument } = require("@qkix/better-blocks-core");

const TRANSFORM_LIMITS = Object.freeze({
  maxBlocks: 2000,
  maxTableRows: 300,
  maxTableColumns: 100,
});

const DOCX_STYLE_MAP = [
  "p[style-name='Heading 1'] => h1:fresh",
  "p[style-name='Heading 2'] => h2:fresh",
  "p[style-name='Heading 3'] => h3:fresh",
  "p[style-name='Heading 4'] => h4:fresh",
  "p[style-name='Quote'] => blockquote:fresh",
];

function cleanText(value) {
  return String(value || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function marksFromElement(element, inherited = {}) {
  const name = String(element?.name || "").toLowerCase();
  const marks = { ...inherited };
  const style = String(element?.attribs?.style || "").toLowerCase();
  if (["strong", "b"].includes(name)) marks.bold = true;
  if (["em", "i"].includes(name)) marks.italic = true;
  if (["u", "ins"].includes(name)) marks.underline = true;
  if (["s", "del", "strike"].includes(name)) marks.strikethrough = true;
  if (/font-weight\s*:\s*(bold|[6-9]00)/.test(style)) marks.bold = true;
  if (/font-style\s*:\s*italic/.test(style)) marks.italic = true;
  if (/text-decoration[^;]*(underline)/.test(style)) marks.underline = true;
  if (/text-decoration[^;]*(line-through)/.test(style)) marks.strikethrough = true;
  if (name === "code") marks.code = true;
  return marks;
}

function inlineChildren($, element, inherited = {}) {
  const result = [];
  $(element).contents().each((_, child) => {
    if (child.type === "text") {
      const text = String(child.data || "").replace(/\s+/g, " ");
      if (text.trim()) result.push({ type: "text", text, ...inherited });
      return;
    }
    if (child.type !== "tag") return;
    const name = String(child.name || "").toLowerCase();
    if (name === "br") {
      result.push({ type: "text", text: "\n", ...inherited });
      return;
    }
    if (name === "a") {
      const textChildren = inlineChildren($, child, inherited).filter((node) => node.type === "text");
      const href = $(child).attr("href");
      if (href && textChildren.length) {
        result.push({ type: "link", url: href, children: textChildren });
      } else result.push(...textChildren);
      return;
    }
    result.push(...inlineChildren($, child, marksFromElement(child, inherited)));
  });
  return result;
}

function inlineText($, element) {
  const nodes = inlineChildren($, element);
  return nodes.map((node) => (node.type === "text" ? node.text : node.children.map((child) => child.text).join(""))).join("").trim();
}

function safeInline($, element) {
  const children = inlineChildren($, element);
  return children.length ? children : [{ type: "text", text: "" }];
}

function listNode($, element) {
  const ordered = String(element.name).toLowerCase() === "ol";
  const children = [];
  $(element).children("li").each((_, li) => {
    const nested = $(li).children("ul, ol").first();
    const inline = $(li).clone().children("ul, ol").remove().end();
    const itemChildren = safeInline($, inline[0]);
    children.push({ type: "list-item", children: itemChildren });
    if (nested.length) children.push(listNode($, nested[0]));
  });
  return { type: "list", format: ordered ? "ordered" : "unordered", children };
}

function tableNode($, element, warnings) {
  const rows = [];
  $(element).find("tr").each((rowIndex, row) => {
    const cells = [];
    $(row).children("th, td").each((_, cell) => {
      const tag = String(cell.name).toLowerCase();
      const node = {
        type: tag === "th" ? "table-header-cell" : "table-cell",
        children: safeInline($, cell),
      };
      const colSpan = Number($(cell).attr("colspan") || 1);
      const rowSpan = Number($(cell).attr("rowspan") || 1);
      if (colSpan > 1) node.colSpan = colSpan;
      if (rowSpan > 1) {
        node.rowSpan = rowSpan;
        warnings.push("Merged table rows were preserved using rowSpan.");
      }
      cells.push(node);
    });
    if (cells.length) {
      if (cells.length > TRANSFORM_LIMITS.maxTableColumns) throw new Error(`A table exceeds the limit of ${TRANSFORM_LIMITS.maxTableColumns} columns.`);
      rows.push({ type: "table-row", children: cells });
    }
  });
  if (rows.length > TRANSFORM_LIMITS.maxTableRows) throw new Error(`A table exceeds the limit of ${TRANSFORM_LIMITS.maxTableRows} rows.`);
  return { type: "table", children: rows };
}

function countNestedBlocks(blocks) {
  return blocks.reduce((count, block) => count + 1 + (Array.isArray(block.children)
    ? block.children.filter((child) => child && typeof child === "object" && typeof child.type === "string" && child.type !== "text" && child.type !== "link").reduce((nested, child) => nested + countNestedBlocks([child]), 0)
    : 0), 0);
}

function transformHtml(html, options = {}) {
  // Word/Google Docs normally provides HTML on the clipboard. When the user
  // pastes plain Markdown, convert it first so headings, GFM tables, lists,
  // quotes and inline marks follow the same Better Blocks mapping. This is
  // intentionally scoped to the importer route; the native editor history
  // (including Ctrl+Z) remains untouched.
  const source = String(html || "");
  const hasHtml = /<\/?[a-z][^>]*>/i.test(source);
  const normalizedHtml = hasHtml ? source : marked.parse(source, { gfm: true, breaks: true });
  const $ = cheerio.load(normalizedHtml, { xmlMode: false });
  // Clipboard HTML is untrusted. Keep only the semantic/inline markup that
  // the transformer understands and reject executable or unsafe URLs before
  // any link/image node can be persisted.
  $("script, style, iframe, object, embed, form, noscript").remove();
  const safeUrl = /^(https?:|mailto:|tel:|\/|#|\.\.?\/|docx-image:)/i;
  $("*").each((_, element) => {
    for (const attribute of Object.keys(element.attribs || {})) {
      if (/^on/i.test(attribute)) $(element).removeAttr(attribute);
    }
    for (const attribute of ["href", "src"]) {
      const value = $(element).attr(attribute);
      if (value && !safeUrl.test(value.trim())) $(element).removeAttr(attribute);
    }
  });
  const blocks = [];
  const warnings = [];
  const blockElements = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "ul", "ol", "blockquote", "pre", "table", "hr", "img"]);
  const roots = $("body").length ? $("body").contents() : $.root().contents();
  const visit = (element) => {
    if (!element || element.type !== "tag") return;
    const name = String(element.name || "").toLowerCase();
    if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(name)) {
      blocks.push({ type: "heading", level: Number(name.slice(1)), children: safeInline($, element) });
    } else if (name === "p" || name === "div") {
      // Word clipboard HTML commonly wraps a table in one or more <div>
      // elements (for example <div class="MsoNormalTable"><table>...).
      // Treating that wrapper as a paragraph flattens the table into text and
      // loses rows/cells. Descend into block children before creating a
      // paragraph so tables, lists and nested blocks retain their structure.
      const childBlocks = $(element).children().filter((_, child) => blockElements.has(String(child.name || "").toLowerCase()));
      if (name === "div" && childBlocks.length) {
        childBlocks.each((_, child) => visit(child));
        return;
      }
      const className = String($(element).attr("class") || "").toLowerCase();
      const headingClass = className.match(/msoheading([1-6])|heading[-_ ]?([1-6])/);
      if (headingClass) {
        blocks.push({ type: "heading", level: Number(headingClass[1] || headingClass[2]), children: safeInline($, element) });
        return;
      }
      const children = safeInline($, element);
      if (children.some((child) => child.type === "text" && child.text.trim())) blocks.push({ type: "paragraph", children });
    } else if (name === "ul" || name === "ol") blocks.push(listNode($, element));
    else if (name === "blockquote") blocks.push({ type: "quote", children: safeInline($, element) });
    else if (name === "pre") blocks.push({ type: "code", language: "plaintext", children: safeInline($, $(element).find("code")[0] || element) });
    else if (name === "table") blocks.push(tableNode($, element, warnings));
    else if (name === "hr") blocks.push({ type: "horizontal-line", children: [{ type: "text", text: "" }] });
    else if (name === "img") {
      const src = $(element).attr("src");
      const imported = src && options.images?.[src];
      if (imported?.url) {
        blocks.push({
          type: "image",
          image: {
            url: imported.url,
            alternativeText: imported.alternativeText ?? null,
            ...(imported.width ? { width: imported.width } : {}),
            ...(imported.height ? { height: imported.height } : {}),
          },
          children: [{ type: "text", text: "" }],
        });
      } else warnings.push("An embedded DOCX image could not be imported and was skipped.");
    }
    else $(element).children().each((_, child) => visit(child));
  };
  roots.each((_, element) => visit(element));
  if (countNestedBlocks(blocks) > TRANSFORM_LIMITS.maxBlocks) {
    throw new Error(`The document exceeds the limit of ${TRANSFORM_LIMITS.maxBlocks} Better Blocks nodes.`);
  }
  return { blocks, warnings };
}

async function docxToBetterBlocks(buffer, options = {}) {
  const mammothOptions = { styleMap: DOCX_STYLE_MAP, includeDefaultStyleMap: true };
  if (options.convertImage) mammothOptions.convertImage = options.convertImage;
  const result = await mammoth.convertToHtml({ buffer }, mammothOptions);
  const transformed = transformHtml(result.value, options);
  const warnings = [...(result.messages || []).map((message) => message.message), ...transformed.warnings];
  const validation = validateDocument(transformed.blocks);
  if (!validation.valid) {
    const error = new Error("Generated Better Blocks document failed validation.");
    error.details = validation.issues;
    throw error;
  }
  return { blocks: transformed.blocks, warnings };
}

module.exports = { docxToBetterBlocks, transformHtml, DOCX_STYLE_MAP, TRANSFORM_LIMITS, cleanText, inlineText };
