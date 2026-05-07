import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Cashcast',
  description: 'Sign in to your Cashcast account to manage your cash flow.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
