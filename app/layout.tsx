import type { Metadata } from "next";
import { Inter, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const gothic = UnifrakturMaguntia({ weight: "400", subsets: ["latin"], variable: "--font-gothic" });

export const metadata: Metadata = {
  title: "Link in Bio",
  description: "My personal bio page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${gothic.variable}`}>{children}</body>
    </html>
  );
}
