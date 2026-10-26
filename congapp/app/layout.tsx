import type { Metadata, Viewport } from "next";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { SkipLink } from "@/components/SkipLink";
import "./globals.css";

const boot = `(function(){try{var t=localStorage.getItem("accesssj-text");var c=localStorage.getItem("accesssj-contrast");if(t==="large"||t==="largest")document.documentElement.setAttribute("data-text",t);if(c==="high")document.documentElement.setAttribute("data-contrast","high");}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "AccessSJ",
    template: "%s · AccessSJ",
  },
  description:
    "Find accessible parks and inclusive playdates in San Joaquin County for families, disabled people, and seniors.",
};

export const viewport: Viewport = {
  themeColor: "#1E4D3A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="min-h-screen bg-cream font-sans text-ink antialiased">
        <Providers>
          <SkipLink />
          <Navbar />
          <main id="main" className="min-h-[70vh]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
