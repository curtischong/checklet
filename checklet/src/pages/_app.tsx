import { basier, bricolage, mackinac } from "@/app/fonts";
import { MenuHeader } from "@/components/MenuHeader";
import { mixpanelTrack } from "@/utils";
import { ClientContextProvider } from "@utils/ClientContext";
import mixpanel from "mixpanel-browser";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
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

        if (
            window.innerWidth < 768 &&
            !["/", "/privacy-policy", "/terms-of-service"].includes(
                router.pathname,
            )
        ) {
            router.push("/mobile");
        }
    }, []);

    const router = useRouter();

    if (typeof window !== "undefined" && Component) {
        return (
            <>
                <Head>
                    <title>Checklet.page</title>
                    <link rel="icon" href="/favicon.svg" />
                </Head>
                <ClientContextProvider>
                    <div
                        className={`${mackinac.variable} ${basier.variable} ${bricolage.variable} font-basier`}
                        style={{
                            WebkitFontSmoothing: "antialiased",
                        }}
                    >
                        <MenuHeader />
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
