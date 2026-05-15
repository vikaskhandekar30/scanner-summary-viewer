import './globals.css';

export const metadata = {
  title: 'Scanner Summary Viewer',
  description: 'View scanner summaries from Yahoo Finance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
