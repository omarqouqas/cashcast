'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import posthog from 'posthog-js';
import { EmailSignatureForm } from './email-signature-form';
import { EmailSignaturePreview } from './email-signature-preview';
import type { SignatureData, SignatureTemplate } from '@/lib/tools/generate-signature-html';

const DEFAULT_DATA: SignatureData = {
  fullName: '',
  jobTitle: '',
  email: '',
  company: '',
  phone: '',
  website: '',
  linkedin: '',
  twitter: '',
  photoUrl: '',
  address: '',
};

export function EmailSignatureGenerator() {
  const [data, setData] = useState<SignatureData>(DEFAULT_DATA);
  const [template, setTemplate] = useState<SignatureTemplate>('professional');
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    try {
      posthog.capture('signature_generator_viewed');
    } catch {}
  }, []);

  const handleDataChange = (newData: SignatureData) => {
    setData(newData);
    // Track first interaction
    if (!data.fullName && newData.fullName) {
      try {
        posthog.capture('signature_generator_started');
      } catch {}
    }
  };

  const handleCopySuccess = () => {
    setShowCTA(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Your Details</h2>
        <EmailSignatureForm data={data} onChange={handleDataChange} />
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Preview</h2>
          <EmailSignaturePreview
            data={data}
            template={template}
            onTemplateChange={setTemplate}
            onCopySuccess={handleCopySuccess}
          />
        </div>

        {/* CTA after copy */}
        {showCTA && (
          <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-6 animate-fadeIn">
            <p className="text-white font-medium mb-2">
              Track your freelance income & never miss a payment deadline.
            </p>
            <p className="text-zinc-400 text-sm mb-4">
              Cashcast helps you forecast your cash flow up to 365 days ahead.
            </p>
            <Link
              href="/auth/signup"
              onClick={() => {
                try {
                  posthog.capture('signature_generator_cta_clicked');
                } catch {}
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 text-sm font-medium transition-colors"
            >
              Try Cashcast Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-xs text-zinc-500 mt-3">No credit card required.</p>
          </div>
        )}

        {/* Sidebar CTA (always visible on desktop) */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hidden lg:block">
          <p className="text-sm text-zinc-400 mb-3">Made for Freelancers</p>
          <p className="text-white text-sm mb-4">
            Cashcast helps you forecast your cash flow up to 365 days ahead. Know exactly when you
            can afford that next big purchase.
          </p>
          <Link
            href="/auth/signup"
            className="text-teal-400 hover:text-teal-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
          >
            Try Free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
