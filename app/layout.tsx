import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDUS — College Portal",
  description: "Демо-портал управления колледжем",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
