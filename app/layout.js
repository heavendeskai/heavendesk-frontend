// app/layout.js
import "./globals.css";

export const metadata = {
  title: "HeavenDesk.ai",
  description: "Meet your AI front desk for calls, questions, and nonstop scheduling.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
