import "./globals.css";

export const metadata = {
  title: "21 Questions — Friends Edition",
  description: "Real friends. Real memories."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
