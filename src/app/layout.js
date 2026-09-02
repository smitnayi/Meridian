import { Geist, Geist_Mono, Urbanist, Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { OrgProvider } from "@/context/OrgContext";
import CreateOrgModal from "@/components/CreateOrgModal";
import JoinOrgModal from "@/components/JoinOrgModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Meridian | Modern Project Management & Collaboration",
  description: "Enterprise project management platform with real-time kanban, smart calendar, and team communication.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${urbanist.variable} ${manrope.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <OrgProvider>
            {children}
            <CreateOrgModal />
            <JoinOrgModal />
          </OrgProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

