import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'श्रीमती पूजा मनीष दाधीच | वार्ड नंबर 14',
  description:
    'श्रीमती पूजा मनीष दाधीच - वार्ड नंबर 14, भारतीय जनता पार्टी (भाजपा)। स्थानीय नागरिक समस्याओं के समाधान, वार्ड की प्राथमिकताओं और जनसंवाद हेतु आधिकारिक पोर्टल।',
  keywords: [
    'पूजा मनीष दाधीच',
    'वार्ड 14',
    'वार्ड नंबर 14',
    'भाजपा',
    'भारतीय जनता पार्टी',
    'स्थानीय चुनाव',
    'नागरिक सेवा',
    'समस्या निवारण',
    'Pooja Manish Dadhich',
    'Ward 14',
  ],
  authors: [{ name: 'वार्ड 14 नागरिक सेवा टीम' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ward14poojadadhich.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'श्रीमती पूजा मनीष दाधीच | वार्ड नंबर 14 | भारतीय जनता पार्टी',
    description:
      'वार्ड 14 के समग्र विकास, स्वच्छता, सुरक्षा एवं नागरिक सहायता हेतु समर्पित मंच। अपनी समस्या दर्ज करें एवं स्थिति ट्रैक करें।',
    url: 'https://ward14poojadadhich.vercel.app',
    siteName: 'वार्ड 14 - श्रीमती पूजा मनीष दाधीच',
    images: [
      {
        url: '/images/ward14-hero.png',
        width: 1200,
        height: 630,
        alt: 'श्रीमती पूजा मनीष दाधीच - वार्ड नंबर 14',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'श्रीमती पूजा मनीष दाधीच | वार्ड नंबर 14',
    description: 'सेवा | सुशासन | विकास — वार्ड नंबर 14 नागरिक सेवा मंच।',
    images: ['/images/ward14-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-charcoal-900 antialiased selection:bg-saffron-100 selection:text-saffron-900">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
