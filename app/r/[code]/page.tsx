import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { validateReferralCode } from '@/lib/actions/referrals';

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const result = await validateReferralCode(code);

  const referrerName = result.success && result.data.valid && result.data.referrerName
    ? result.data.referrerName
    : 'a friend';

  return {
    title: 'Get 30 Days of Pro Free | Cashcast',
    description: `${referrerName} invited you to try Cashcast! Sign up now and get 30 days of Pro features free.`,
    openGraph: {
      title: 'Get 30 Days of Pro Free | Cashcast',
      description: `${referrerName} invited you to try Cashcast! Sign up now and get 30 days of Pro features free.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Get 30 Days of Pro Free | Cashcast',
      description: `${referrerName} invited you to try Cashcast! Sign up now and get 30 days of Pro features free.`,
    },
  };
}

export default async function ReferralPage({ params }: Props) {
  const { code } = await params;
  const sanitizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Validate code exists
  const result = await validateReferralCode(sanitizedCode);

  if (!result.success || !result.data.valid) {
    // Invalid code - redirect to signup without referral
    redirect('/auth/signup');
  }

  // Valid code - redirect to signup with referral
  redirect(`/auth/signup?ref=${sanitizedCode}`);
}
