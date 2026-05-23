import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import MobileNav from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "VedaAI – AI Assessment Creator",
  description: "Create professional AI-generated assessments and question papers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background min-h-screen text-primary">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-[300px] min-h-screen">
            <TopBar />
            <div className="p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
