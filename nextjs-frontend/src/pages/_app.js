import "../styles.css";
import Head from "next/head";
// src/pages/_app.js
import '../lib/Internationalization';
import Layout from "@/components/layout/default";

import { useEffect, useState } from "react";
function App({ Component, pageProps }) {


  const [initialRenderComplete, setInitialRenderComplete] = useState(false);

  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  if (!initialRenderComplete) return <></>;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="./manifest.webmanifest" />
        <title>digitale klasse</title>
      </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </>
  );
}

export default App;