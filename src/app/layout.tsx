/* src/app/layout.tsx */
import '../styles/globals.css';
import NavbarWrapper from '../components/NavbarWrapper';


export const metadata = {
  title: 'Jan Sladký – Tvorba webů na míru, SEO optimalizace a moderní design',
  description: 'Jsem webový vývojář specializující se na tvorbu rychlých, moderních a responzivních webových stránek. Nabízím SEO optimalizaci, přístupný design a individuální přístup pro živnostníky, firmy i neziskové projekty.',
  keywords: [
    'tvorba webových stránek',
    'weby na míru',
    'SEO optimalizace',
    'frontend vývojář',
    'Next.js developer',
    'responzivní webdesign',
    'Jan Sladký weby',
    'rychlý web',
    'moderní web',
    'přístupný web',
    'web pro firmy',
    'web pro živnostníky',
  ],
  authors: [{ name: 'Jan Sladký', url: 'https://www.jansladky.eu' }],
  creator: 'Jan Sladký',
  publisher: 'Jan Sladký',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://www.jansladky.eu'), 
  openGraph: {
    title: 'Jan Sladký – Vývoj moderních webových stránek',
    description: 'Moderní, rychlé a optimalizované weby – od designu po nasazení. Přehledná řešení pro malé podnikatele i firmy.',
    url: 'https://www.jansladky.eu',
    siteName: 'Jan Sladký Weby',
    locale: 'cs_CZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jan Sladký – Tvorba webů na míru',
    description: 'Profesionální vývoj moderních webových stránek s důrazem na SEO, rychlost a přístupnost.',
    creator: '@tvujTwitterHandle', // pokud máš Twitter
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="bg-[#0a192f] text-gray-300 min-h-screen">
        <NavbarWrapper />
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
