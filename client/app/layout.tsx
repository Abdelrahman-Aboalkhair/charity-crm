import { Cairo } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Donor management system",
  description: "A specialized system for managing donors.",
  icons: {
    icon: "/kgKraftLogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${cairo.variable} antialiased`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
