import { Inter } from "next/font/google";
import { Metadata, Viewport } from "next";
import "../../styles/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub Contribution Graph Video",
  description: "Generate an animated video of your GitHub contribution graph",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-background ${inter.className}`}>{children}</body>
    </html>
  );
}
