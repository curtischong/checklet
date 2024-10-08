import { mackinac, nunito } from "@/app/fonts";
import "@/styles/globals.css";
import { type Metadata } from "next";

import { MenuHeader } from "@/app/_components/MenuHeader";
import { ClientCtxProvider } from "@/app/ClientCtx";
import { ScrollProvider } from "@/app/ScrollProvider";
import { TRPCReactProvider } from "@/trpc/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <html lang="en">
      <body
        className={`${mackinac.variable} ${nunito.variable} bg-background font-nunito tracking-[0.01em]`}
        style={{
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <TRPCReactProvider>
          <ClientCtxProvider>
            <ScrollProvider>
              <MenuHeader />
              {children}
            </ScrollProvider>
          </ClientCtxProvider>
        </TRPCReactProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
