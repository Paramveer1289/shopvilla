const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'TECH_STACK_GUIDE.md');
const md = fs.readFileSync(mdPath, 'utf-8');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseMarkdownToHtml(md) {
  const lines = md.split('\r\n').join('\n').split('\n');
  let html = '';
  let inCode = false;
  let codeBuffer = [];
  let inTable = false;
  let tableBuffer = [];
  let inUl = false;
  let inOl = false;

  function closeLists() {
    if (inUl) { html += '</ul>\n'; inUl = false; }
    if (inOl) { html += '</ol>\n'; inOl = false; }
  }

  function flushTable() {
    if (!inTable || tableBuffer.length < 2) {
      inTable = false;
      tableBuffer = [];
      return;
    }
    const parseRow = (r) => r.slice(1, -1).split('|').map(c => c.trim());
    const headers = parseRow(tableBuffer[0]);
    const dataRows = tableBuffer.slice(2).map(parseRow);

    html += '<div class="table-container"><table>\n<thead>\n<tr>\n';
    headers.forEach(h => {
      html += `  <th>${formatInline(h)}</th>\n`;
    });
    html += '</tr>\n</thead>\n<tbody>\n';
    dataRows.forEach((row, idx) => {
      html += `<tr class="${idx % 2 === 0 ? 'even' : 'odd'}">\n`;
      row.forEach(c => {
        html += `  <td>${formatInline(c)}</td>\n`;
      });
      html += '</tr>\n';
    });
    html += '</tbody>\n</table></div>\n';
    inTable = false;
    tableBuffer = [];
  }

  function formatInline(text) {
    let t = escapeHtml(text);
    // Bold
    t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    t = t.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code / terms
    t = t.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Math formulas: \( ... \) or $$ ... $$
    t = t.replace(/\\\((.*?)\\\)/g, '<span class="math">$1</span>');
    return t;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code / ASCII block
    if (line.trim().startsWith('```')) {
      closeLists();
      if (inTable) flushTable();
      if (inCode) {
        html += `<pre class="ascii-diagram"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>\n`;
        codeBuffer = [];
        inCode = false;
      } else {
        inCode = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCode) {
      codeBuffer.push(line);
      continue;
    }

    // Markdown Table line
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      closeLists();
      inTable = true;
      tableBuffer.push(line.trim());
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      closeLists();
      html += '<hr class="section-divider" />\n';
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      closeLists();
      const text = line.replace('# ', '').trim();
      html += `<h1 id="${slugify(text)}">${formatInline(text)}</h1>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      closeLists();
      const text = line.replace('## ', '').trim();
      html += `<h2 id="${slugify(text)}">${formatInline(text)}</h2>\n`;
      continue;
    }
    if (line.startsWith('### ')) {
      closeLists();
      const text = line.replace('### ', '').trim();
      html += `<h3 id="${slugify(text)}">${formatInline(text)}</h3>\n`;
      continue;
    }
    if (line.startsWith('#### ')) {
      closeLists();
      const text = line.replace('#### ', '').trim();
      html += `<h4>${formatInline(text)}</h4>\n`;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      closeLists();
      const quoteText = line.replace(/^>\s?/, '').trim();
      html += `<blockquote>${formatInline(quoteText)}</blockquote>\n`;
      continue;
    }

    // Unordered List
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (inOl) { html += '</ol>\n'; inOl = false; }
      if (!inUl) { html += '<ul>\n'; inUl = true; }
      const itemText = line.trim().replace(/^[-*]\s+/, '');
      html += `  <li>${formatInline(itemText)}</li>\n`;
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(line.trim())) {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      if (!inOl) { html += '<ol>\n'; inOl = true; }
      const itemText = line.trim().replace(/^\d+\.\s+/, '');
      html += `  <li>${formatInline(itemText)}</li>\n`;
      continue;
    }

    // Normal Paragraph
    if (line.trim().length > 0) {
      closeLists();
      html += `<p>${formatInline(line.trim())}</p>\n`;
      continue;
    }
  }

  closeLists();
  if (inTable) flushTable();

  return html;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const htmlBody = parseMarkdownToHtml(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShopVilla — Master System Design & Engineering Theory Guide</title>
  <style>
    :root {
      --primary: #1A365D;
      --secondary: #2B6CB0;
      --accent: #3182CE;
      --text: #2D3748;
      --text-muted: #718096;
      --bg-light: #F7FAFC;
      --border: #E2E8F0;
      --code-bg: #EDF2F7;
      --code-color: #9B2C2C;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      background-color: #FFFFFF;
      line-height: 1.7;
      font-size: 15px;
      padding: 40px 20px;
    }

    .container {
      max-width: 960px;
      margin: 0 auto;
      background: #FFFFFF;
      padding: 20px 40px;
    }

    /* Print Action Bar */
    .action-bar {
      position: sticky;
      top: 10px;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1A365D;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 30px;
    }

    .action-bar span {
      font-weight: 600;
      font-size: 14px;
    }

    .btn-print {
      background: #3182CE;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s ease;
    }

    .btn-print:hover {
      background: #2B6CB0;
    }

    /* Typography */
    h1 {
      color: var(--primary);
      font-size: 28px;
      font-weight: 800;
      border-bottom: 3px solid var(--accent);
      padding-bottom: 12px;
      margin-top: 40px;
      margin-bottom: 20px;
    }

    h2 {
      color: var(--secondary);
      font-size: 22px;
      font-weight: 700;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
      margin-top: 36px;
      margin-bottom: 16px;
    }

    h3 {
      color: var(--text);
      font-size: 18px;
      font-weight: 700;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    h4 {
      color: var(--text-muted);
      font-size: 16px;
      font-weight: 600;
      margin-top: 18px;
      margin-bottom: 8px;
    }

    p {
      margin-bottom: 14px;
      text-align: justify;
    }

    /* Blockquote / Callout */
    blockquote {
      border-left: 4px solid var(--accent);
      background-color: var(--bg-light);
      padding: 14px 20px;
      margin: 18px 0;
      border-radius: 0 6px 6px 0;
      color: #2D3748;
      font-style: italic;
    }

    /* Lists */
    ul, ol {
      margin-left: 24px;
      margin-bottom: 16px;
    }

    li {
      margin-bottom: 6px;
    }

    /* Tables */
    .table-container {
      overflow-x: auto;
      margin: 20px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin: 10px 0;
    }

    th {
      background-color: var(--primary);
      color: #FFFFFF;
      font-weight: 600;
      text-align: left;
      padding: 10px 14px;
      border: 1px solid #CBD5E0;
    }

    td {
      padding: 10px 14px;
      border: 1px solid var(--border);
      vertical-align: top;
    }

    tr.even td {
      background-color: #FFFFFF;
    }

    tr.odd td {
      background-color: var(--bg-light);
    }

    /* ASCII Diagrams */
    pre.ascii-diagram {
      background-color: #1A202C;
      color: #E2E8F0;
      padding: 18px 20px;
      border-radius: 6px;
      font-family: "Cascadia Code", Consolas, "Courier New", monospace;
      font-size: 12px;
      line-height: 1.45;
      overflow-x: auto;
      margin: 20px 0;
    }

    code.inline-code {
      font-family: Consolas, monospace;
      background-color: var(--code-bg);
      color: var(--code-color);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
    }

    hr.section-divider {
      border: none;
      border-top: 2px dashed var(--border);
      margin: 40px 0;
    }

    /* Print Styles */
    @media print {
      body {
        padding: 0;
        font-size: 11pt;
        color: #000;
      }
      .action-bar {
        display: none !important;
      }
      .container {
        max-width: 100%;
        padding: 0;
      }
      h1 {
        page-break-before: always;
        font-size: 20pt;
        border-bottom: 2pt solid #000;
      }
      h1:first-of-type {
        page-break-before: avoid;
      }
      h2 {
        font-size: 16pt;
        page-break-after: avoid;
      }
      h3 {
        font-size: 13pt;
        page-break-after: avoid;
      }
      table, blockquote, pre {
        page-break-inside: avoid;
      }
      th {
        background-color: #E2E8F0 !important;
        color: #000 !important;
      }
      pre.ascii-diagram {
        background-color: #F7FAFC;
        color: #000;
        border: 1px solid #CBD5E0;
        font-size: 9pt;
      }
      @page {
        margin: 15mm;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="action-bar">
      <span>📄 ShopVilla — Master System Design & Engineering Theory Guide (1-Day Blueprint)</span>
      <button class="btn-print" onclick="window.print()">
        🖨️ Print / Save as PDF (Ctrl + P)
      </button>
    </div>

    ${htmlBody}
  </div>
</body>
</html>`;

const outHtmlPath = path.join(__dirname, 'ShopVilla_System_Design_and_Theory_Guide.html');
fs.writeFileSync(outHtmlPath, fullHtml);
console.log(`Successfully generated printable HTML at: ${outHtmlPath} (${(fullHtml.length / 1024).toFixed(1)} KB)`);
