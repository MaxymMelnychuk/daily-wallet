import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "./StoreProvider";

/** Sans for UI copy — CSS variables let any component use `var(--font-geist-sans)`. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Monospace for numeric / code-adjacent UI if you extend the design later. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Browser tab + SEO defaults for the whole app. */
export const metadata: Metadata = {
  title: "DailyWallet – Virtual Wallet Dashboard",
  description:
    "Track your virtual balance, deposit and spend virtual money.",
};

/** Mobile browser chrome color when users install or pin the PWA-style tab. */
export const viewport: Viewport = {
  themeColor: "#000000",
};

/**
 * Root shell: fonts on `<body>`, Redux `<Provider>` wraps every route so client
 * components can read the wallet slice without prop drilling.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
