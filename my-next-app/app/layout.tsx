import { Montserrat, Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

// Load Google Fonts
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.className} bg-gray-50`}>
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto p-4 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
