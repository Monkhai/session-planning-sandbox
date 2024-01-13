import ReactQueryProvider from "Providers/ReactQueryProvider";
import { Inter } from "next/font/google";
import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Session Sandbox",
  description: "Made By Someone",
  icons: [{ rel: "icon", url: "../../public/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
