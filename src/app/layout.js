import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MyNavBar from "@/components/MyNavBar";
import { Toaster } from "sonner";

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
    <html lang="en">
                 <head>
                <script
                    type="module"
                    defer
                    src="https://cdn.jsdelivr.net/gh/imananoosheh/github-contributions-fetch@latest/github_calendar_widget.js"
                ></script>
            </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MyNavBar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
