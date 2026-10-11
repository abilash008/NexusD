import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { LayoutShell } from "@/components/layout/layout-shell";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusD — ServiceNow Career & Certification Platform",
  description:
    "Fast, affordable, and high-accuracy certification practice exams (CSA), exam blueprint study guides, and career acceleration exclusively for the ServiceNow ecosystem. Australia & Brazil Releases.",
  keywords: [
    "ServiceNow CSA practice exam",
    "ServiceNow certification",
    "Certified System Administrator practice test",
    "ServiceNow Australia Brazil release",
    "NexusD",
  ],
  metadataBase: new URL("https://nexusd.in"),
  icons: {
    icon: "/nd-logo.png",
    apple: "/nd-logo.png",
  },
  openGraph: {
    title: "NexusD — ServiceNow Career & Certification Platform",
    description:
      "Practice real exam questions with instant scoring and detailed explanations. Tailored for freshers, career switchers, and trainees.",
    url: "https://nexusd.in",
    siteName: "NexusD",
    locale: "en_IN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('nexusd_theme') || 'system';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors duration-200">
        <ThemeProvider>
          <SidebarProvider>
            <Sidebar user={session?.user} />
            <LayoutShell>
              <main className="flex-1">{children}</main>
              <Footer />
            </LayoutShell>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
