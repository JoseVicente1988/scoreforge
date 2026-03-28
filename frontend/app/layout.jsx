import "./globals.css";

export const metadata = {
  title: "Scoreforge",
  description: "Multi-tenant leaderboard SaaS for games",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <a href="/" className="brand">
                <div className="brand-mark">S</div>
                <div className="brand-copy">
                  <strong>Scoreforge</strong>
                  <span>Leaderboard SaaS for games</span>
                </div>
              </a>

              <nav className="topbar-nav">
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
              </nav>
            </div>
          </header>

          <main className="page-container">{children}</main>
        </div>
      </body>
    </html>
  );
}