import { Metadata } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import ProviderWrapper from "./store/providerWrapper";

import { siteConfig } from "@/config/site";
import { prompt } from "@/config/fonts";

import "./index.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className={prompt.variable}>
      <body
        className={clsx("min-h-screen bg-background font-sans antialiased")}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        <ProviderWrapper>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <main>{children}</main>
          </Providers>
        </ProviderWrapper>
      </body>
    </html>
  );
}
