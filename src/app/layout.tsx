import { bricolage, mackinac, nunito } from "@/app/fonts";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Checklet",
  description:
    "Polish Jokes, Edit Resumes, Revise Emails... and Check Anything!",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={`${mackinac.variable} ${bricolage.variable} ${nunito.variable} bg-[#fff0f1] font-nunito tracking-[0.01em]`}
        style={{
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
