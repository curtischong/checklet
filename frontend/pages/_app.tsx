import React, { useEffect } from "react";
import { AppProps } from "next/app";
import mixpanel from "mixpanel-browser";
import { mixpanelTrack } from "src/utils";
import "antd/dist/antd.css";
import "@styles/global.css";

const mixPanelDevToken = "c0a764f0dc29ac3aced3d053e01ccf71";
const mixPanelProdToken = "a335d976f2073179ae53c046ccc380ae";
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
        return <Component {...pageProps} />;
    }
    return <></>;
}

export default MyApp;
