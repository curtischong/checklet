import "@styles/global.css";
import { ClientContextProvider } from "@utils/ClientContext";
import "antd/dist/antd.css";
import mixpanel from "mixpanel-browser";
import { AppProps } from "next/app";
import Head from "next/head";
import { lora, mackinac } from "pages/fonts";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mixpanelTrack } from "src/utils";

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
        return (
            <>
                <Head>
                    <title>Nautilus | Resume Feedback</title>
                    <link rel="shortcut icon" href="/nautilus-favicon.jpeg" />
                </Head>
                <ClientContextProvider>
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
