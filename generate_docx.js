const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  NumberFormat
} = require('docx');

const mdPath = path.join(__dirname, 'TECH_STACK_GUIDE.md');
const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Parse Markdown into structured blocks
function parseMarkdownToBlocks(md) {
  const lines = md.split('\r\n').join('\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal Rule
    if (line.trim() === '---') {
      i++;
      continue;
    }

    // Code / Diagram block
    if (line.trim().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: 'code',
        content: codeLines.join('\n')
      });
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      // Process table lines
      if (tableLines.length >= 2) {
        const parseRow = (r) => r.slice(1, -1).split('|').map(c => c.trim());
        const headers = parseRow(tableLines[0]);
        // line 1 is separator | :--- | :--- |
        const dataRows = tableLines.slice(2).map(parseRow);
        blocks.push({
          type: 'table',
          headers,
          rows: dataRows
        });
      }
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.replace('# ', '').trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.replace('## ', '').trim() });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.replace('### ', '').trim() });
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      blocks.push({ type: 'h4', text: line.replace('#### ', '').trim() });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, '').trim());
        i++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') });
      continue;
    }

    // Bullet list
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      blocks.push({ type: 'bullet', text: line.trim().replace(/^[-*]\s+/, '') });
      i++;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line.trim())) {
      blocks.push({ type: 'number', text: line.trim().replace(/^\d+\.\s+/, '') });
      i++;
      continue;
    }

    // Normal paragraph
    if (line.trim().length > 0) {
      let pText = line.trim();
      // accumulate consecutive non-empty lines
      while (i + 1 < lines.length && lines[i + 1].trim().length > 0 &&
             !lines[i + 1].trim().startsWith('#') &&
             !lines[i + 1].trim().startsWith('|') &&
             !lines[i + 1].trim().startsWith('```') &&
             !lines[i + 1].trim().startsWith('>') &&
             !lines[i + 1].trim().startsWith('- ') &&
             !lines[i + 1].trim().startsWith('* ') &&
             !/^\d+\.\s+/.test(lines[i + 1].trim()) &&
             lines[i + 1].trim() !== '---') {
        i++;
        pText += ' ' + lines[i].trim();
      }
      blocks.push({ type: 'p', text: pText });
      i++;
      continue;
    }

    i++;
  }

  return blocks;
}

// Convert inline formatting (bold, italic, code) into TextRun objects
function parseInlineRuns(text, baseOpts = {}) {
  // Simple token regex matching **bold**, *italic*, `code`, or plain text
  const tokens = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
    if (boldMatch) {
      tokens.push(new TextRun({
        text: boldMatch[2],
        bold: true,
        ...baseOpts
      }));
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/);
    if (italicMatch) {
      tokens.push(new TextRun({
        text: italicMatch[2],
        italics: true,
        ...baseOpts
      }));
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline Code / Term: `term`
    const codeMatch = remaining.match(/^`(.*?)`/);
    if (codeMatch) {
      tokens.push(new TextRun({
        text: codeMatch[1],
        font: 'Consolas',
        color: '9B2C2C', // Crimson dark
        shading: {
          type: ShadingType.CLEAR,
          fill: 'EDF2F7'
        },
        ...baseOpts
      }));
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Plain text up to next special char
    const nextSpecial = remaining.search(/[\*_`]/);
    if (nextSpecial === -1) {
      tokens.push(new TextRun({ text: remaining, ...baseOpts }));
      remaining = '';
    } else if (nextSpecial === 0) {
      // Stray delimiter, consume 1 char
      tokens.push(new TextRun({ text: remaining[0], ...baseOpts }));
      remaining = remaining.slice(1);
    } else {
      tokens.push(new TextRun({ text: remaining.slice(0, nextSpecial), ...baseOpts }));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return tokens.length > 0 ? tokens : [new TextRun({ text: '', ...baseOpts })];
}

async function buildDocx() {
  console.log('Parsing markdown blocks...');
  const blocks = parseMarkdownToBlocks(mdContent);
  console.log(`Parsed ${blocks.length} structured blocks.`);

  const docChildren = [];

  // Title & Header Banner
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'SHOPVILLA',
          size: 48,
          bold: true,
          color: '1A365D', // Dark Blue
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'Master System Design, Architecture & Engineering Theory Guide',
          size: 28,
          bold: true,
          color: '2B6CB0', // Teal/Blue
          font: 'Calibri'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '1-Day Intensive Study Roadmap for Software Engineering Interviews & Technical Vivas',
          size: 20,
          italics: true,
          color: '4A5568',
          font: 'Calibri'
        })
      ]
    })
  );

  for (const block of blocks) {
    if (block.type === 'h1') {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 150 },
          children: [
            new TextRun({
              text: block.text,
              bold: true,
              size: 32,
              color: '1A365D',
              font: 'Calibri'
            })
          ]
        })
      );
    } else if (block.type === 'h2') {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 120 },
          children: [
            new TextRun({
              text: block.text,
              bold: true,
              size: 26,
              color: '2B6CB0',
              font: 'Calibri'
            })
          ]
        })
      );
    } else if (block.type === 'h3') {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 100 },
          children: [
            new TextRun({
              text: block.text,
              bold: true,
              size: 22,
              color: '2D3748',
              font: 'Calibri'
            })
          ]
        })
      );
    } else if (block.type === 'h4') {
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 80 },
          children: [
            new TextRun({
              text: block.text,
              bold: true,
              size: 20,
              color: '4A5568',
              font: 'Calibri'
            })
          ]
        })
      );
    } else if (block.type === 'quote') {
      docChildren.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          shading: {
            type: ShadingType.CLEAR,
            fill: 'EDF2F7' // Light Grayish Blue
          },
          border: {
            left: {
              color: '3182CE',
              space: 12,
              value: BorderStyle.SINGLE,
              size: 24
            }
          },
          children: parseInlineRuns(block.text, {
            size: 20,
            italics: true,
            color: '2D3748',
            font: 'Calibri'
          })
        })
      );
    } else if (block.type === 'bullet') {
      docChildren.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
          children: parseInlineRuns(block.text, {
            size: 21,
            color: '2D3748',
            font: 'Calibri'
          })
        })
      );
    } else if (block.type === 'number') {
      docChildren.push(
        new Paragraph({
          numbering: { reference: 'numbered-list', level: 0 },
          spacing: { before: 60, after: 60 },
          children: parseInlineRuns(block.text, {
            size: 21,
            color: '2D3748',
            font: 'Calibri'
          })
        })
      );
    } else if (block.type === 'code') {
      // Render ASCII diagrams & architectures with monospace
      const lines = block.content.split('\n');
      for (const cl of lines) {
        docChildren.push(
          new Paragraph({
            spacing: { before: 20, after: 20 },
            shading: {
              type: ShadingType.CLEAR,
              fill: 'F7FAFC'
            },
            children: [
              new TextRun({
                text: cl.length > 0 ? cl : ' ',
                font: 'Consolas',
                size: 16,
                color: '1A202C'
              })
            ]
          })
        );
      }
    } else if (block.type === 'table') {
      // Build a styled docx table
      const colCount = block.headers.length;
      const cellWidthPct = Math.floor(100 / colCount);

      const headerCells = block.headers.map(h => new TableCell({
        width: { size: cellWidthPct, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: '1A365D' }, // Dark Navy
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: h,
                bold: true,
                color: 'FFFFFF',
                size: 19,
                font: 'Calibri'
              })
            ]
          })
        ]
      }));

      const rows = [new TableRow({ children: headerCells, tableHeader: true })];

      block.rows.forEach((row, rowIndex) => {
        const isEven = rowIndex % 2 === 0;
        const dataCells = row.map(c => new TableCell({
          width: { size: cellWidthPct, type: WidthType.PERCENTAGE },
          shading: {
            type: ShadingType.CLEAR,
            fill: isEven ? 'FFFFFF' : 'F7FAFC' // Zebra striping
          },
          children: [
            new Paragraph({
              children: parseInlineRuns(c, {
                size: 18,
                color: '2D3748',
                font: 'Calibri'
              })
            })
          ]
        }));
        rows.push(new TableRow({ children: dataCells }));
      });

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows
        }),
        new Paragraph({ spacing: { after: 150 } }) // Spacing after table
      );
    } else if (block.type === 'p') {
      docChildren.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: parseInlineRuns(block.text, {
            size: 21,
            color: '2D3748',
            font: 'Calibri'
          })
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'ShopVilla — System Design & Engineering Theory Master Guide',
                    size: 16,
                    color: '718096',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.SPACE_BETWEEN,
                children: [
                  new TextRun({
                    text: 'Confidential / Engineering Study Document',
                    size: 16,
                    color: 'A0AEC0',
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: '718096',
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        children: docChildren
      }
    ]
  });

  console.log('Generating docx buffer...');
  const buffer = await Packer.toBuffer(doc);
  const outDocxPath = path.join(__dirname, 'ShopVilla_System_Design_and_Theory_Guide.docx');
  fs.writeFileSync(outDocxPath, buffer);
  console.log(`Successfully generated DOCX at: ${outDocxPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

buildDocx().catch(err => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
