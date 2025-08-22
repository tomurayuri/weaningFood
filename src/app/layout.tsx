import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: '離乳食記録アプリ',
  description: '赤ちゃんの離乳食摂取記録と栄養分析アプリケーション',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '離乳食記録',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
      <body className={`${notoSansJP.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {/* ナビゲーション */}
          <Navigation />
          
          {/* メインコンテンツ */}
          <main className="flex-1 pb-16 md:pb-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}