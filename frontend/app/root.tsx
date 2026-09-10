import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/reality-theme.css";
import { useEffect } from "react";
import { useAuthStore } from "../lib/authStore";
import Footer from "./components/Footer";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "canonical", href: "https://resumind.realitycodes.dev/" },
];

export function meta() {
  const title = "Resumind — Free AI Resume & ATS Score Checker";
  const description =
    "Upload your resume and get an instant, AI-powered ATS score with actionable feedback on tone, content, structure and skills. Free version of Resumind v2.0 by Reality Codes.";
  return [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: "#606beb" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/images/resume_01.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="application/ld+json"
          // Structured data so search engines understand what this tool does.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Resumind",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Any",
              description:
                "Free AI-powered resume and ATS score checker with tone, content, structure and skills feedback.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              creator: {
                "@type": "Person",
                name: "Muhammad Ammar",
                url: "https://reality-codes.netlify.app/",
              },
            }),
          }}
        />
      </head>
      <body>
        <div className="reality-app-shell">
          {children}
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="reality-container" style={{ paddingTop: 64 }}>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre style={{ width: "100%", padding: 16, overflowX: "auto" }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
