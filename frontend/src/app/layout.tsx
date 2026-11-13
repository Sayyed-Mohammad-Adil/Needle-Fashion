import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { SiteConfigProvider } from '@/contexts/SiteConfigContext';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import ChatWidget from '@/components/chat/ChatWidget';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-primary',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Needle Fashion | Indian Craft & Modern Tailoring',
  description:
    'Understated luxury menswear uniting handloom Indian textiles and karigar embroidery with bespoke suits, shirts, trousers, and ceremonial Indian wear.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <body className="font-sans bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary/15 selection:text-foreground">
        <ThemeProviderWrapper>
          <SiteConfigProvider>
            <AuthProvider>
              <CartProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    borderRadius: '0px',
                    background: '#141414',
                    color: '#FAF9F6',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                  },
                }}
              />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <ChatWidget />
              </CartProvider>
            </AuthProvider>
          </SiteConfigProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
