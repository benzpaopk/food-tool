import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

const prompt = Prompt({ 
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "Food Cost Calculator",
  description: "Calculate food costs for recipes and ingredients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={prompt.className}>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto md:ml-72">
            <div className="container mx-auto p-6 md:p-10">{children}</div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}

