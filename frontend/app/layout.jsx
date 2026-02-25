export const metadata = { title: "Scoreforge" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0 }}>
        <div style={{ padding: 16, borderBottom: "1px solid #e5e5e5" }}>
          <strong>Scoreforge</strong>
          <span style={{ marginLeft: 12, color: "#666" }}>Scoreboard SaaS</span>
        </div>
        <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>{children}</div>
      </body>
    </html>
  );
}
