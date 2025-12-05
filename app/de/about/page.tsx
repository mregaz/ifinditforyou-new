// app/de/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Was ist iFindItForYou",
  description:
    "Erfahre, was iFindItForYou ist: ein KI-gestützter Suchassistent, der gezielte Informationen für dich findet.",
};

export default function AboutPageDe() {
  return (
    <main
    style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
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
          Was ist iFindItForYou?
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          iFindItForYou ist ein Assistent, der Informationen für dich sucht.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          Statt selbst unzählige Tabs zu öffnen, beschreibst du einfach in
          natürlicher Sprache, was du brauchst, und das System macht drei
          Dinge:
        </p>

        <ul style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li>es analysiert deine Anfrage,</li>
          <li>führt gezielte Recherchen durch,</li>
          <li>liefert dir eine klare, komprimierte Antwort.</li>
        </ul>

        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          Die Oberfläche ist schlicht, der Dienst ist mehrsprachig, und du
          kannst mit einem kostenlosen Plan ohne Verpflichtungen starten.
        </p>
      </div>
    </main>
  );
}
