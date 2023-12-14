import { lora, mackinac } from "@/app/fonts";
import { Footer } from "@/components/Footer";
import { MenuHeader } from "@/pages/MenuHeader";
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
    }, []);

    const router = useRouter();

    if (typeof window !== "undefined" && Component) {
        if (
            window.innerWidth < 768 &&
            !["/", "privacy-policy", "terms-of-service"].includes(
                router.pathname,
            )
        ) {
            return (
                <>
                    <Head>
                        <title>Checklet.page</title>
                        <link rel="icon" href="/favicon.svg" />
                    </Head>
                    {/* <MenuHeader /> */}
                    <div className="fixed top-0 left-0 w-full">
                        <a
                            className="absolute left-4 mt-4 font-mackinac"
                            href="/"
                        >
                            Checklet.page
                        </a>
                    </div>
                    <div className="font-3xl font-mackinac font-bold mx-auto text-center mt-[40%]">
                        Sorry! Checklet isn&lsquo;t available on mobile
                    </div>
                    <Footer isAbsolute={true} />
                </>
            );
        }

        return (
            <>
                <Head>
                    <title>Checklet.page</title>
                    <link rel="icon" href="/favicon.svg" />
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
