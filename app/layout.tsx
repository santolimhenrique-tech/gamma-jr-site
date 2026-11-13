import type { Metadata, Viewport } from "next";
import { Montserrat, Oswald } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Empresa Júnior da EEL-USP`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Gamma Jr",
    "empresa júnior",
    "EEL-USP",
    "sites institucionais",
    "Power BI",
    "identidade visual",
    "capacitações",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: `${site.name} | Empresa Júnior da EEL-USP`,
    description: site.description,
    // [PREENCHER] substituir por uma imagem 1200x630 dedicada.
    images: [
      {
        url: "/brand/gamma-logo-completo-turquesa.png",
        width: 882,
        height: 886,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: site.description,
    images: ["/brand/gamma-logo-completo-turquesa.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#212121",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${oswald.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marca o documento como "com JS" antes da pintura, para esconder
            os elementos que entram animados (ver .js [data-reveal]). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-turquesa focus:px-4 focus:py-2 focus:text-grafite"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
