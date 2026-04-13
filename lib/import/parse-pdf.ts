export type PdfParseResult = {
  text: string;
  pages: string[];
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    creationDate?: Date;
  };
};

export type PdfTextItem = {
  str: string;
  hasEOL?: boolean;
  transform?: number[];
};

// Store the pdfjsLib reference after initialization
let pdfjsLibInstance: typeof import('pdfjs-dist') | null = null;

/**
 * Dynamically load pdfjs-dist to avoid Next.js bundling issues.
 */
async function getPdfJs() {
  if (pdfjsLibInstance) {
    return pdfjsLibInstance;
  }

  const pdfjsLib = await import('pdfjs-dist');

  // Configure worker from CDN for v3.x
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

  pdfjsLibInstance = pdfjsLib;
  return pdfjsLib;
}

/**
 * Extract text content from a PDF file.
 * Processes each page and reconstructs text with proper spacing.
 */
export async function parsePdfToText(file: File): Promise<PdfParseResult> {
  const pdfjsLib = await getPdfJs();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Reconstruct text with proper line breaks
    // Bank statements often have tabular data, so we need to handle positioning
    const items = textContent.items as PdfTextItem[];
    let pageText = '';
    let lastY: number | null = null;

    for (const item of items) {
      if (!item.str) continue;

      // Check if we've moved to a new line (Y position changed significantly)
      const currentY = item.transform?.[5] ?? null;
      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
        pageText += '\n';
      }

      pageText += item.str;

      // Add space after items unless they end the line
      if (!item.hasEOL) {
        pageText += ' ';
      } else {
        pageText += '\n';
      }

      if (currentY !== null) {
        lastY = currentY;
      }
    }

    pages.push(pageText.trim());
  }

  // Try to extract metadata
  let metadata: PdfParseResult['metadata'];
  try {
    const pdfMetadata = await pdf.getMetadata();
    if (pdfMetadata?.info) {
      const info = pdfMetadata.info as Record<string, unknown>;
      metadata = {
        title: typeof info.Title === 'string' ? info.Title : undefined,
        author: typeof info.Author === 'string' ? info.Author : undefined,
        creationDate: typeof info.CreationDate === 'string'
          ? new Date(info.CreationDate)
          : undefined,
      };
    }
  } catch {
    // Metadata extraction failed, continue without it
  }

  return {
    text: pages.join('\n\n--- PAGE BREAK ---\n\n'),
    pages,
    pageCount: pdf.numPages,
    metadata,
  };
}

/**
 * Check if a file is a valid PDF based on its name.
 */
export function isPdfFile(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.pdf');
}
