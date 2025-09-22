import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Vettam AI - Editor",
  description: "Editor configured by Tiptap.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
