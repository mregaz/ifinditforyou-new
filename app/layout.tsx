export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <header>
          <nav>
            <a href="/">Home</a> | <a href="/privacy">Privacy</a> | <a href="/terms">Termini</a>
          </nav>
        </header>
        {children}
        <footer>
          <p>© 2025 iFindItForYou</p>
        </footer>
      </body>
    </html>
  );
}

