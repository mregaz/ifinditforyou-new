// app/en/about/page.tsx
import type { Metadata } from "next";
import Head from "next/head";
import { baseUrl, locales, localePathname } from "../../../lib/i18n-config";

export const metadata: Metadata = {
  title: "What is iFindItForYou",
  description:
    "Learn what iFindItForYou is: a human-powered AI search assistant that finds targeted information for you.",
};
export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About us – iFindItForYou</title>
        <meta
          name="description"
          content="Learn more about the team and story behind iFindItForYou."
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://www.ifinditforyou.com/en/about"
        />

        {/* hreflang */}
        <link
          rel="alternate"
          hrefLang="en"
          href="https://www.ifinditforyou.com/en/about"
        />
        <link
          rel="alternate"
          hrefLang="it"
          href="https://www.ifinditforyou.com/about"
        />
        <link
          rel="alternate"
          hrefLang="fr"
          href="https://www.ifinditforyou.com/fr/about"
        />
        <link
          rel="alternate"
          hrefLang="de"
          href="https://www.ifinditforyou.com/de/about"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.ifinditforyou.com/"
        />

        {/* Open Graph base */}
        <meta property="og:title" content="About us – iFindItForYou" />
        <meta
          property="og:description"
          content="Learn more about the team and story behind iFindItForYou."
        />
        <meta
          property="og:url"
          content="https://www.ifinditforyou.com/en/about"
        />
        <meta property="og:site_name" content="iFindItForYou" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About us – iFindItForYou" />
        <meta
          name="twitter:description"
          content="Learn more about the team and story behind iFindItForYou."
        />
      </Head>

      <main>
        <h1>About iFindItForYou</h1>
        {/* qui rimane tutto il contenuto che avevi già */}
      </main>
    </>
  );
}

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          What is iFindItForYou
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          iFindItForYou is an assistant that searches for information on your
          behalf.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          Instead of wasting time going through dozens of results, you simply
          describe what you need in natural language and the system does three
          things:
        </p>

        <ul style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li>analyses your request</li>
          <li>performs targeted searches</li>
          <li>returns a clear, concise answer</li>
        </ul>

        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          The interface is simple, the service is multilingual and you can start
          with a Free plan, without complications.
        </p>
      </div>
    </main>
  );
}

