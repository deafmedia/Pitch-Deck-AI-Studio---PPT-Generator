import pptxgen from 'pptxgenjs';
import { PitchDeck, SlideData } from '../types';
import { THEME_PRESETS } from '../data/templates';

// Helper to sanitize hex colors for pptxgenjs (needs 6 hex characters without '#')
function hexToPptxColor(hexColor: string, defaultColor: string = '0F172A'): string {
  if (!hexColor) return defaultColor;
  let clean = hexColor.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  return clean.length === 6 ? clean.toUpperCase() : defaultColor;
}

export function exportDeckToPptx(deck: PitchDeck): void {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = deck.title;
  pptx.subject = deck.subtitle;
  pptx.author = deck.author || 'Pitch Deck AI Studio';

  const theme = THEME_PRESETS[deck.theme] || THEME_PRESETS.corporate_blue;
  const bgHex = hexToPptxColor(theme.bgColor, 'FFFFFF');
  const textHex = hexToPptxColor(theme.textColor, '0F172A');
  const accentHex = hexToPptxColor(theme.accentColor, '2563EB');
  const secTextHex = hexToPptxColor(theme.secondaryColor, '64748B');
  const cardBgHex = hexToPptxColor(theme.cardBg, 'F8FAFC');
  const cardBorderHex = hexToPptxColor(theme.cardBorder, 'E2E8F0');

  deck.slides.forEach((slide: SlideData, index: number) => {
    const pptxSlide = pptx.addSlide();
    
    // Set background color for slide
    pptxSlide.background = { color: bgHex };

    // Footer with Deck Title & Slide Number
    pptxSlide.addText(`${deck.title} | Slide ${index + 1} of ${deck.slides.length}`, {
      x: 0.5,
      y: 7.0,
      w: 12.33,
      h: 0.3,
      fontSize: 9,
      color: secTextHex,
      align: 'left',
    });

    // Accent Badge at Top Right (if exists)
    if (slide.accentBadge || slide.eyebrow) {
      const topTag = (slide.accentBadge || slide.eyebrow || '').toUpperCase();
      pptxSlide.addText(topTag, {
        x: 0.6,
        y: 0.4,
        w: 12.13,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: accentHex,
      });
    }

    // Slide Layout rendering branch
    switch (slide.layout) {
      case 'title': {
        // Main Cover Title Slide Layout
        pptxSlide.addText(slide.title, {
          x: 0.8,
          y: 1.2,
          w: 11.7,
          h: 1.8,
          fontSize: 36,
          bold: true,
          color: textHex,
          wrap: true,
        });

        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.8,
            y: 3.1,
            w: 11.7,
            h: 1.0,
            fontSize: 18,
            color: secTextHex,
            wrap: true,
          });
        }

        if (slide.bullets && slide.bullets.length > 0) {
          const bulletText = slide.bullets.map(b => ({ text: b, options: { bullet: true, fontSize: 14, color: textHex, breakLine: true } }));
          pptxSlide.addText(bulletText, {
            x: 0.8,
            y: 4.2,
            w: 11.7,
            h: 2.4,
            fill: { color: cardBgHex },
            line: { color: cardBorderHex, width: 1 },
            rectRadius: 0.1,
            margin: 15,
          });
        }
        break;
      }

      case 'stats': {
        // Header
        pptxSlide.addText(slide.title, {
          x: 0.6,
          y: 0.8,
          w: 12.13,
          h: 0.8,
          fontSize: 26,
          bold: true,
          color: textHex,
        });

        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.6,
            y: 1.6,
            w: 12.13,
            h: 0.5,
            fontSize: 14,
            color: secTextHex,
          });
        }

        // Render 4 Stat Boxes in 1x4 horizontal row or 2x2 grid
        if (slide.stats && slide.stats.length > 0) {
          const count = Math.min(slide.stats.length, 4);
          const boxWidth = 2.8;
          const boxGap = 0.25;
          const startX = 0.6;
          const startY = 2.3;

          slide.stats.slice(0, 4).forEach((stat, i) => {
            const xPos = startX + i * (boxWidth + boxGap);
            
            // Card Shape background
            pptxSlide.addShape('rect' as any, {
              x: xPos,
              y: startY,
              w: boxWidth,
              h: 2.2,
              fill: { color: cardBgHex },
              line: { color: accentHex, width: 1.5 },
              rectRadius: 0.1,
            });

            // Stat Value
            pptxSlide.addText(stat.value, {
              x: xPos + 0.1,
              y: startY + 0.2,
              w: boxWidth - 0.2,
              h: 0.8,
              fontSize: 28,
              bold: true,
              color: accentHex,
              align: 'center',
            });

            // Stat Label
            pptxSlide.addText(stat.label, {
              x: xPos + 0.1,
              y: startY + 1.0,
              w: boxWidth - 0.2,
              h: 0.5,
              fontSize: 12,
              bold: true,
              color: textHex,
              align: 'center',
            });

            if (stat.sublabel) {
              pptxSlide.addText(stat.sublabel, {
                x: xPos + 0.1,
                y: startY + 1.5,
                w: boxWidth - 0.2,
                h: 0.5,
                fontSize: 10,
                color: secTextHex,
                align: 'center',
              });
            }
          });
        }

        // Additional Bullets below stats
        if (slide.bullets && slide.bullets.length > 0) {
          const bulletText = slide.bullets.map(b => ({ text: b, options: { bullet: true, fontSize: 13, color: textHex, breakLine: true } }));
          pptxSlide.addText(bulletText, {
            x: 0.6,
            y: 4.8,
            w: 12.13,
            h: 1.8,
            margin: 10,
          });
        }
        break;
      }

      case 'pillars':
      case 'cards': {
        // Slide Title
        pptxSlide.addText(slide.title, {
          x: 0.6,
          y: 0.8,
          w: 12.13,
          h: 0.8,
          fontSize: 26,
          bold: true,
          color: textHex,
        });

        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.6,
            y: 1.6,
            w: 12.13,
            h: 0.5,
            fontSize: 14,
            color: secTextHex,
          });
        }

        // Cards grid (2 rows x 3 cols or 2 rows x 2 cols)
        if (slide.cards && slide.cards.length > 0) {
          const cardCount = slide.cards.length;
          const cols = cardCount > 4 ? 3 : 2;
          const rows = Math.ceil(cardCount / cols);
          const colWidth = cols === 3 ? 3.8 : 5.8;
          const rowHeight = rows === 3 ? 1.4 : 2.0;
          const gapX = 0.3;
          const gapY = 0.25;
          const startX = 0.6;
          const startY = 2.3;

          slide.cards.forEach((card, i) => {
            const colIndex = i % cols;
            const rowIndex = Math.floor(i / cols);
            const xPos = startX + colIndex * (colWidth + gapX);
            const yPos = startY + rowIndex * (rowHeight + gapY);

            const isHighlighted = card.highlight;
            const cardLineColor = isHighlighted ? accentHex : cardBorderHex;

            // Card Shape
            pptxSlide.addShape('rect' as any, {
              x: xPos,
              y: yPos,
              w: colWidth,
              h: rowHeight,
              fill: { color: cardBgHex },
              line: { color: cardLineColor, width: isHighlighted ? 2 : 1 },
              rectRadius: 0.1,
            });

            let currentY = yPos + 0.15;
            if (card.tag) {
              pptxSlide.addText(card.tag.toUpperCase(), {
                x: xPos + 0.2,
                y: currentY,
                w: colWidth - 0.4,
                h: 0.25,
                fontSize: 9,
                bold: true,
                color: accentHex,
              });
              currentY += 0.3;
            }

            pptxSlide.addText(card.title, {
              x: xPos + 0.2,
              y: currentY,
              w: colWidth - 0.4,
              h: 0.4,
              fontSize: 13,
              bold: true,
              color: textHex,
            });

            currentY += 0.4;

            pptxSlide.addText(card.description, {
              x: xPos + 0.2,
              y: currentY,
              w: colWidth - 0.4,
              h: rowHeight - (currentY - yPos) - 0.1,
              fontSize: 10.5,
              color: secTextHex,
              wrap: true,
            });
          });
        }
        break;
      }

      case 'problem_solution': {
        pptxSlide.addText(slide.title, {
          x: 0.6,
          y: 0.8,
          w: 12.13,
          h: 0.8,
          fontSize: 26,
          bold: true,
          color: textHex,
        });

        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.6,
            y: 1.6,
            w: 12.13,
            h: 0.5,
            fontSize: 14,
            color: secTextHex,
          });
        }

        if (slide.bullets && slide.bullets.length > 0) {
          const half = Math.ceil(slide.bullets.length / 2);
          const leftBullets = slide.bullets.slice(0, half);
          const rightBullets = slide.bullets.slice(half);

          // Left Box
          const leftText = leftBullets.map(b => ({ text: b, options: { bullet: true, fontSize: 13, color: textHex, breakLine: true } }));
          pptxSlide.addText(leftText, {
            x: 0.6,
            y: 2.3,
            w: 5.8,
            h: 4.4,
            fill: { color: cardBgHex },
            line: { color: cardBorderHex, width: 1 },
            rectRadius: 0.1,
            margin: 15,
          });

          // Right Box
          const rightText = rightBullets.map(b => ({ text: b, options: { bullet: true, fontSize: 13, color: textHex, breakLine: true } }));
          pptxSlide.addText(rightText, {
            x: 6.8,
            y: 2.3,
            w: 5.8,
            h: 4.4,
            fill: { color: cardBgHex },
            line: { color: accentHex, width: 1.5 },
            rectRadius: 0.1,
            margin: 15,
          });
        }
        break;
      }

      case 'table': {
        pptxSlide.addText(slide.title, {
          x: 0.6,
          y: 0.8,
          w: 12.13,
          h: 0.8,
          fontSize: 26,
          bold: true,
          color: textHex,
        });

        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.6,
            y: 1.6,
            w: 12.13,
            h: 0.5,
            fontSize: 14,
            color: secTextHex,
          });
        }

        if (slide.tableColumns && slide.tableRows) {
          const tableHeaderRow = slide.tableColumns.map(col => ({
            text: col.label,
            options: { bold: true, color: 'FFFFFF', fill: { color: accentHex }, fontSize: 11, align: 'left' }
          }));

          const tableDataRows = slide.tableRows.map((row, rIndex) => {
            return slide.tableColumns!.map(col => ({
              text: row[col.key] || '',
              options: {
                color: textHex,
                fontSize: 10,
                fill: { color: rIndex % 2 === 0 ? cardBgHex : bgHex }
              }
            }));
          });

          const tableRowsData = [tableHeaderRow, ...tableDataRows];

          pptxSlide.addTable(tableRowsData as any, {
            x: 0.6,
            y: 2.3,
            w: 12.13,
            colW: slide.tableColumns.map(() => 12.13 / slide.tableColumns!.length),
            border: { pt: 1, color: cardBorderHex },
          });
        }
        break;
      }

      case 'timeline': {
        pptxSlide.addText(slide.title, {
          x: 0.6,
          y: 0.8,
          w: 12.13,
          h: 0.8,
          fontSize: 26,
          bold: true,
          color: textHex,
        });

        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.6,
            y: 1.6,
            w: 12.13,
            h: 0.5,
            fontSize: 14,
            color: secTextHex,
          });
        }

        if (slide.timelineSteps && slide.timelineSteps.length > 0) {
          const count = slide.timelineSteps.length;
          const stepWidth = 12.13 / count - 0.2;
          const startX = 0.6;
          const startY = 2.4;

          slide.timelineSteps.forEach((step, i) => {
            const xPos = startX + i * (stepWidth + 0.2);

            // Step Box
            pptxSlide.addShape('rect' as any, {
              x: xPos,
              y: startY,
              w: stepWidth,
              h: 4.2,
              fill: { color: cardBgHex },
              line: { color: accentHex, width: 1.5 },
              rectRadius: 0.1,
            });

            // Period badge
            pptxSlide.addText(step.period, {
              x: xPos + 0.15,
              y: startY + 0.2,
              w: stepWidth - 0.3,
              h: 0.4,
              fontSize: 12,
              bold: true,
              color: accentHex,
            });

            // Step Title
            pptxSlide.addText(step.title, {
              x: xPos + 0.15,
              y: startY + 0.7,
              w: stepWidth - 0.3,
              h: 0.6,
              fontSize: 13,
              bold: true,
              color: textHex,
              wrap: true,
            });

            // Description
            pptxSlide.addText(step.description, {
              x: xPos + 0.15,
              y: startY + 1.4,
              w: stepWidth - 0.3,
              h: 2.5,
              fontSize: 10.5,
              color: secTextHex,
              wrap: true,
            });
          });
        }
        break;
      }

      default: {
        // Fallback layout (CTA / General)
        pptxSlide.addText(slide.title, {
          x: 0.6,
          y: 0.8,
          w: 12.13,
          h: 0.8,
          fontSize: 28,
          bold: true,
          color: textHex,
        });

        if (slide.subtitle) {
          pptxSlide.addText(slide.subtitle, {
            x: 0.6,
            y: 1.6,
            w: 12.13,
            h: 0.6,
            fontSize: 16,
            color: secTextHex,
          });
        }

        if (slide.bullets && slide.bullets.length > 0) {
          const bulletText = slide.bullets.map(b => ({ text: b, options: { bullet: true, fontSize: 14, color: textHex, breakLine: true } }));
          pptxSlide.addText(bulletText, {
            x: 0.6,
            y: 2.5,
            w: 12.13,
            h: 4.2,
            fill: { color: cardBgHex },
            line: { color: cardBorderHex, width: 1 },
            rectRadius: 0.1,
            margin: 15,
          });
        }
        break;
      }
    }

    // Add Speaker Notes to PPTX Slide if present
    if (slide.speakerNotes) {
      pptxSlide.addNotes(slide.speakerNotes);
    }
  });

  // Trigger browser file download
  const cleanFilename = deck.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40) || 'pitch_deck';
  pptx.writeFile({ fileName: `${cleanFilename}.pptx` });
}
