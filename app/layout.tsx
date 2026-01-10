import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { OrderTrackingProvider } from "@/contexts/order-tracking-context"
import { SupportChatProvider } from "@/contexts/support-chat-context"
import { CustomerChatWidget } from "@/components/support/customer-chat-widget"
import "./globals.css"

export const metadata: Metadata = {
  title: "FoodDelivery Platform",
  description: "Complete food delivery management platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <OrderTrackingProvider>
                <SupportChatProvider>
                  <Suspense fallback={null}>
                    {children}
                    <Toaster />
                    <CustomerChatWidget />
                  </Suspense>
                </SupportChatProvider>
              </OrderTrackingProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
