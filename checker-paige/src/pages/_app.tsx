import { lora, mackinac } from "@/app/fonts";
import { MenuHeader } from "@/pages/MenuHeader";
import { mixpanelTrack } from "@/utils";
import { ClientContextProvider } from "@utils/ClientContext";
import mixpanel from "mixpanel-browser";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import "./globals.css";

const mixPanelDevToken = "94ac9cfab8d2280edba19b31b2937926";
const mixPanelProdToken = "dc8c89187149505f2392759f15e0fd4d";
function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    useEffect(() => {
        if (window.location.hostname === "localhost") {
            mixpanel.init(mixPanelDevToken);
        } else {
            mixpanel.init(mixPanelProdToken);
        }
        mixpanelTrack("Opened app");
    }, []);

    if (typeof window !== "undefined" && Component) {
        if (window.innerWidth < 768) {
            return (
                <>
                    <Head>
                        <title>Checklet.page</title>
                        <link
                            rel="shortcut icon"
                            href="/nautilus-favicon.jpeg"
                        />
                    </Head>
                    <div>Sorry! Checklet isn&lsquo;t available on mobile</div>
                </>
            );
        }

        return (
            <>
                <Head>
                    <title>Checklet.page</title>
                    <link rel="shortcut icon" href="/nautilus-favicon.jpeg" />
                </Head>
                <ClientContextProvider>
                    <MenuHeader />
                    <div className={`${lora.variable} ${mackinac.variable}`}>
                        <Component {...pageProps} />
                    </div>
                    <ToastContainer />
                </ClientContextProvider>
            </>
        );
    }
    return <></>;
}

export default MyApp;
