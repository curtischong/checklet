import React from "react";
import { AppProps } from "next/app";
import "antd/dist/antd.css";
import "@styles/global.css";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    if (typeof window !== "undefined" && Component) {
        return <Component {...pageProps} />;
    }
    return <></>;
}

export default MyApp;
