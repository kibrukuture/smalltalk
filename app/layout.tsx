import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'tolbel Inc.',
  description: `tolbel Inc. is a software development company based in Ethiopia.
We build web and mobile applications for businesses and individuals.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
