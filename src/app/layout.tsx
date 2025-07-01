import type { Metadata } from "next";
import "./globals.css";
import '@mantine/core/styles.css';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

export const metadata: Metadata = {
  title: "BlockNote Duplicate ID on Copy Minimal Repro",
  description: "A minimal reproduction of the issue with BlockNote where IDs are duplicated on copy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <body>
        <ColorSchemeScript defaultColorScheme="dark" />
        <MantineProvider defaultColorScheme="dark">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
