import "./globals.css";

export const metadata = {
  title: "21 Questions | Friends Edition",
  description: "How well do your friends really know you?"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
