import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MyNavBar from "@/components/MyNavBar";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Stefan Dorosh Portfolio",
  description: "Full Stack Web Developer Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <MyNavBar />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
