import { mackinac, nunito } from "@/app/fonts";
import "@/styles/globals.css";
import { type Metadata } from "next";

import { Footer } from "@/app/_components/Footer";
import { MenuHeader } from "@/app/_components/MenuHeader";
import { ClientCtxProvider } from "@/app/ClientCtx";
import { ScrollProvider } from "@/app/ScrollProvider";
import { TrpcCtxProvider } from "@/app/TrpcCtx";
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
        <TrpcCtxProvider>
          <ClientCtxProvider>
            <ScrollProvider>
              <MenuHeader />
              <>
                <div
                  style={{
                    minHeight: "calc(100vh - 30px - 55px)",
                  }}
                >
                  {children}
                </div>
                <Footer />
              </>
            </ScrollProvider>
          </ClientCtxProvider>
        </TrpcCtxProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
