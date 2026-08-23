import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { themeInitScript } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "RentReceiptPro — Automated Digital Rent Receipts & Property Management Kenya" },
      {
        name: "description",
        content:
          "Kenya's leading digital rent receipt and property management software. Issue instant verified PDF rent receipts with QR codes, track M-Pesa payments, manage tenant leases, and monitor rental property portfolios in minutes.",
      },
      {
        name: "keywords",
        content:
          "rent receipt kenya, digital rent receipts, tenant receipt mpesa, landlord property management nairobi, online rent receipt generator, rent payment tracker kenya, rental invoicing software, verified rent receipt pdf",
      },
      { name: "author", content: "Codevanta Ventures" },
      { name: "theme-color", content: "#0B1220" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "geo.region", content: "KE" },
      { name: "geo.placename", content: "Nairobi, Kenya" },
      { name: "application-name", content: "RentReceiptPro" },
      { property: "og:site_name", content: "RentReceiptPro" },
      { property: "og:locale", content: "en_KE" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rentreceipt.co.ke/" },
      { property: "og:title", content: "RentReceiptPro — Automated Digital Rent Receipts & Property Management" },
      {
        property: "og:description",
        content:
          "Issue instant verified digital rent receipts with QR verification, track M-Pesa payments, manage leases, and streamline property operations in Kenya.",
      },
      { property: "og:image", content: "https://rentreceipt.co.ke/favicon.png" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { property: "og:image:alt", content: "RentReceiptPro Logo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@RentReceiptPro" },
      { name: "twitter:title", content: "RentReceiptPro — Digital Rent Receipts Kenya" },
      {
        name: "twitter:description",
        content:
          "Generate official QR-verifiable rent receipts, track tenant payments, and manage properties online.",
      },
      { name: "twitter:image", content: "https://rentreceipt.co.ke/favicon.png" },
    ],
    links: [
      { rel: "canonical", href: "https://rentreceipt.co.ke/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "512x512" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "512x512" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://rentreceipt.co.ke/#website",
        "url": "https://rentreceipt.co.ke/",
        "name": "RentReceiptPro",
        "alternateName": "Rent Receipt Pro Kenya",
        "description": "Digital rent receipts and rental property management software for landlords and tenants in Kenya.",
        "inLanguage": "en-KE",
      },
      {
        "@type": "Organization",
        "@id": "https://rentreceipt.co.ke/#organization",
        "name": "RentReceiptPro",
        "url": "https://rentreceipt.co.ke/",
        "logo": "https://rentreceipt.co.ke/favicon.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "email": "info@rentreceipt.co.ke",
          "areaServed": "KE",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://rentreceipt.co.ke/#software",
        "name": "RentReceiptPro",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All (Web, Android, iOS)",
        "offers": {
          "@type": "Offer",
          "price": "400.00",
          "priceCurrency": "KES",
        },
        "description": "Digital rent receipt generation with QR code verification, M-Pesa tracking, and tenant maintenance portal.",
      },
      {
        "@type": "FAQPage",
        "@id": "https://rentreceipt.co.ke/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do digital rent receipts work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Landlords record rent payments and RentReceiptPro automatically generates a cryptographically stamped PDF receipt with a QR code that tenants can verify or download anytime.",
            },
          },
          {
            "@type": "Question",
            "name": "Can tenants verify their rent receipts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, every receipt comes with a public verification link and QR code stored on the RentReceiptPro registry.",
            },
          },
          {
            "@type": "Question",
            "name": "How much does RentReceiptPro cost in Kenya?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Plans start with a 14-day free trial, followed by KSh 400 monthly, KSh 1,100 quarterly, KSh 2,100 semi-annually, or KSh 4,000 yearly.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (ref && ref.trim()) {
        localStorage.setItem("rrp_referral_code", ref.trim().toUpperCase());
      }
    }
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
