import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chatbot - Intelligent Conversations | Smart Chat Assistant",
  description: "Experience intelligent conversations with our AI-powered chatbot. Get instant answers, assistance, and engage in meaningful discussions across all devices. Responsive design with real-time streaming responses.",
  keywords: [
    "AI chatbot", 
    "artificial intelligence", 
    "conversational AI", 
    "chat assistance", 
    "smart conversations",
    "real-time chat",
    "responsive chatbot",
    "AI assistant",
    "intelligent chat",
    "web chatbot"
  ],
  authors: [{ name: "AI Chatbot Team" }],
  creator: "AI Chatbot Team",
  publisher: "AI Chatbot Team",
  robots: "index, follow",
  openGraph: {
    title: "AI Chatbot - Intelligent Conversations",
    description: "Experience intelligent conversations with our AI-powered chatbot. Get instant answers, assistance, and engage in meaningful discussions across all devices.",
    type: "website",
    locale: "en_US",
    siteName: "AI Chatbot",
    url: "https://your-domain.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chatbot - Intelligent Conversations",
    description: "Experience intelligent conversations with our AI-powered chatbot. Responsive design with real-time streaming responses.",
    creator: "@aichatbot",
  },

  category: "technology",
  alternates: {
    canonical: "https://your-domain.com",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "AI Chatbot",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "AI Chatbot",
              "description": "An intelligent AI-powered chatbot for meaningful conversations and assistance",
              "url": "https://your-domain.com",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "AI Chatbot Team"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
