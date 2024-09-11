import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import BreadcrumbWrapper from "@/components/bcwrap";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Effinity CMS",
  description: "It's a secret",
  openGraph: {
    type: "website",
    url: "cms.mvp.effinity.ca",
    title: "Effinity",
    description: "It's a secret",
    siteName: "Effinity CMS",
    images: [
      {
        url: "/EffinityMetadataBanner.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`h-max min-h-screen bg-background text-text-primary ${poppins.className}`}
      >
        <BreadcrumbWrapper>{children}</BreadcrumbWrapper>
      </body>
    </html>
  );
}