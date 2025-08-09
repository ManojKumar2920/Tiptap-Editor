import type { Metadata } from "next";
import "./globals.css";
import localFont from 'next/font/local'
 
const Avenir = localFont({
  src: '../font/AvenirLTStd-Medium.otf',
  variable: '--font--avenir'
})

 

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
      <body
        className={`${Avenir.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
