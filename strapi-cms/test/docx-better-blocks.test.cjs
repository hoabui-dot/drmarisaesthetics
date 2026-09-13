const test = require('node:test');
const assert = require('node:assert/strict');
const { transformHtml } = require('../src/lib/docx-better-blocks');
const { validateDocument } = require('@qkix/better-blocks-core');

const getBlock = (blocks, type) => blocks.find((block) => block.type === type);

test('converts Word semantic HTML into valid Better Blocks', () => {
  const result = transformHtml(`
    <div class="MsoNormal">
      <h1>Planning</h1>
      <p><strong>Bold</strong> <em>italic</em> <s>removed</s> <a href="https://example.com">source</a></p>
      <ul><li>First<ul><li>Nested</li></ul></li></ul>
      <blockquote>Clinical guidance</blockquote>
      <table><tr><th>Procedure</th><th>Price</th></tr><tr><td>Rhinoplasty</td><td>100</td></tr></table>
    </div>
  `);

  assert.equal(result.warnings.length, 0);
  assert.equal(getBlock(result.blocks, 'heading').level, 1);
  assert.equal(getBlock(result.blocks, 'list').children[1].type, 'list');
  assert.equal(getBlock(result.blocks, 'table').children[0].children[0].type, 'table-header-cell');
  assert.deepEqual(validateDocument(result.blocks), { valid: true, issues: [] });
});

test('removes executable markup and unsafe URLs before transformation', () => {
  const result = transformHtml(`
    <p onclick="alert(1)"><a href="javascript:alert(1)">unsafe</a> <a href="mailto:editor@example.com">safe</a></p>
    <script>alert(1)</script><iframe src="https://evil.example"></iframe>
  `);
  const paragraph = getBlock(result.blocks, 'paragraph');
  assert.equal(paragraph.children.some((child) => child.type === 'link' && child.url.startsWith('javascript:')), false);
  assert.equal(paragraph.children.some((child) => child.type === 'link' && child.url.startsWith('mailto:')), true);
  assert.equal(result.blocks.some((block) => block.type === 'script' || block.type === 'iframe'), false);
  assert.deepEqual(validateDocument(result.blocks), { valid: true, issues: [] });
});

test('preserves Unicode and Vietnamese content', () => {
  const result = transformHtml('<p>Phẫu thuật thẩm mỹ cho bệnh nhân quốc tế — bình an và tự nhiên.</p>');
  assert.equal(result.blocks[0].children[0].text, 'Phẫu thuật thẩm mỹ cho bệnh nhân quốc tế — bình an và tự nhiên.');
  assert.deepEqual(validateDocument(result.blocks), { valid: true, issues: [] });
});

test('converts GFM clipboard fallback without storing Markdown', () => {
  const result = transformHtml('# Heading\n\n- One\n- Two\n\n| A | B |\n| --- | --- |\n| 1 | 2 |');
  assert.equal(result.blocks[0].type, 'heading');
  assert.equal(result.blocks[1].type, 'list');
  assert.equal(result.blocks[2].type, 'table');
  assert.equal(JSON.stringify(result.blocks).includes('contentMarkdown'), false);
  assert.deepEqual(validateDocument(result.blocks), { valid: true, issues: [] });
});
