import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import ChatWidget from '@/components/chat/ChatWidget';
import FirstVisitIntro from '@/components/effects/FirstVisitIntro';
import CustomLuxuryCursor from '@/components/effects/CustomLuxuryCursor';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Needle Fashion | Bespoke & Luxury Men\'s Ethnic Wear',
  description: 'Handcrafted imperial sherwanis, pure silk kurtas, and bespoke ethnic couture in cream, grey, white and antique gold.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground antialiased selection:bg-[#C5A059]/20 selection:text-[#18191C]`}>
        <ThemeProviderWrapper>
          <AuthProvider>
            <CartProvider>
              <CustomLuxuryCursor />
              <FirstVisitIntro />
              <Toaster position="top-center" />
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <ChatWidget />
            </CartProvider>
          </AuthProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
