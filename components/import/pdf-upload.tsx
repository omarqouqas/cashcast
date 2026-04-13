'use client';

import { useState } from 'react';
import { FileText, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { parsePdfToText, isPdfFile } from '@/lib/import/parse-pdf';
import { extractTransactions, type PdfExtractionResult } from '@/lib/import/pdf-transaction-extractor';

type Props = {
  onLoaded: (_payload: { fileName: string; result: PdfExtractionResult }) => void;
  onError: (_message: string) => void;
};

export function PdfUpload({ onLoaded, onError }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [debugText, setDebugText] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const handleFile = async (file: File | null) => {
    setLocalError(null);
    if (!file) return;

    // Validate file type
    if (!isPdfFile(file.name)) {
      const error = 'Please upload a PDF file (.pdf).';
      setLocalError(error);
      onError(error);
      return;
    }

    // Check file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      const error = `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.`;
      setLocalError(error);
      onError(error);
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Extract text from PDF
      const pdfResult = await parsePdfToText(file);

      if (!pdfResult.text.trim()) {
        const error =
          'This PDF appears to be empty or contains only images. ' +
          'Try downloading a text-based PDF from your bank, or use CSV export instead.';
        setLocalError(error);
        onError(error);
        return;
      }

      // Step 2: Extract transactions from text
      const extractionResult = extractTransactions(pdfResult.text);

      if (extractionResult.transactions.length === 0) {
        const error =
          'Could not find any transactions in this PDF. ' +
          'Make sure this is a bank statement with transaction history.';
        setLocalError(error);
        // Store debug text (first 3000 chars) to help diagnose the issue
        setDebugText(pdfResult.text.slice(0, 3000));
        onError(error);
        return;
      }

      setDebugText(null);

      onLoaded({ fileName: file.name, result: extractionResult });
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Failed to read PDF file.';
      setLocalError(error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="border border-zinc-800 bg-zinc-900 rounded-lg p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? 'border-teal-500 bg-teal-500/10'
            : 'border-zinc-700 hover:border-zinc-600'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-teal-400" />
          </div>
          <p className="text-base font-semibold text-zinc-100 mb-2">Upload your bank statement PDF</p>
          <p className="text-sm text-zinc-300 mb-4 max-w-md">
            {isLoading
              ? 'Reading your statement...'
              : 'Drag and drop your PDF file here, or click the button below to browse'}
          </p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById('pdf-file-input')?.click()}
            loading={isLoading}
          >
            {isLoading ? 'Processing...' : 'Choose PDF'}
          </Button>
          <p className="text-xs text-zinc-400 mt-3">Accepts .pdf files (max 5MB)</p>
        </div>
      </div>

      <input
        id="pdf-file-input"
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0] ?? null);
          e.target.value = ''; // Reset so same file can be re-uploaded
        }}
      />

      {localError && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg">
          <p className="text-sm text-rose-400">{localError}</p>
          <Link
            href="/dashboard/import"
            className="mt-2 inline-flex items-center text-sm text-teal-400 hover:text-teal-300"
          >
            Try CSV/Excel import instead
          </Link>
          {debugText && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-zinc-500 hover:text-zinc-400"
              >
                {showDebug ? 'Hide' : 'Show'} extracted text (for debugging)
              </button>
              {showDebug && (
                <pre className="mt-2 p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400 overflow-auto max-h-64 whitespace-pre-wrap">
                  {debugText}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>What banks are supported?</span>
          {showHelp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showHelp && (
          <div className="mt-3 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm">
            <p className="text-zinc-200 mb-3">
              We can read PDF bank statements from most major US and Canadian banks. Download your statement as a PDF from your bank&apos;s website.
            </p>

            <p className="text-zinc-300 font-medium mb-2">Supported banks include:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1 mb-3">
              <li><span className="text-zinc-300">Canada:</span> RBC, TD Canada Trust, Scotiabank, BMO, CIBC, Tangerine</li>
              <li><span className="text-zinc-300">US:</span> Chase, Bank of America, Wells Fargo</li>
              <li>Capital One, Citibank, US Bank</li>
              <li>TD Bank, PNC, Truist</li>
              <li>American Express, Discover</li>
              <li>Navy Federal, USAA, Ally</li>
              <li>And many more...</li>
            </ul>

            <p className="text-zinc-300 font-medium mb-2">For best results:</p>
            <ul className="list-disc list-inside text-zinc-400 space-y-1 mb-3">
              <li>Download the official PDF statement from your bank</li>
              <li>Make sure it&apos;s not password-protected</li>
              <li>Avoid scanned/image-only PDFs</li>
            </ul>

            <p className="text-zinc-400 text-xs">
              If PDF import doesn&apos;t work well with your bank, try{' '}
              <Link href="/dashboard/import" className="text-teal-400 hover:text-teal-300">
                CSV/Excel import
              </Link>{' '}
              instead.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
