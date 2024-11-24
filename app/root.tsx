import {
    data,
    isRouteErrorResponse,
    Links,
    LoaderFunctionArgs,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from "react-router";

import styles from "~/app.css?url";
import type { Route } from "./+types/root";
import { Toaster } from "./components/ui/toaster";
import { getSession } from "./routes/_auth+/session.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: styles },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("cookie"));
  return data({
    flush: {
      success: session.get("success"),
      error: session.get("error"),
    },
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const {flush} = useLoaderData<typeof loader>()

  console.log(flush)


  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-96 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 right-60 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Original SVG with reduced opacity */}
        <svg
          className="opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 1422 800"
          id="qqquad"
        >
          <g
            shapeRendering="crispEdges"
            strokeLinejoin="round"
            fill="none"
            strokeWidth="1"
            stroke="hsl(220, 0%, 91%)"
          >
            <polygon points="1422,200 1066.5,200 1066.5,0"></polygon>
            <polygon points="1066.5,0 1066.5,200 711,0"></polygon>
            <polygon points="888.75,300 1066.5,300 888.75,200"></polygon>
            <polygon points="888.75,200 888.75,300 711,200"></polygon>
            <polygon points="711,300 711,400 888.75,300"></polygon>
            <polygon points="888.75,400 1066.5,400 888.75,300"></polygon>
            <polygon points="1422,200 1422,400 1066.5,200"></polygon>
            <polygon points="711,200 711,0 355.5,0"></polygon>
            <polygon points="355.5,200 355.5,0 0,0"></polygon>
            <polygon points="355.5,200 355.5,400 0,200"></polygon>
            <polygon points="711,400 711,200 355.5,200"></polygon>
            <polygon points="711,400 711,500 533.25,400"></polygon>
            <polygon points="355.5,500 533.25,500 355.5,400"></polygon>
            <polygon points="355.5,500 355.5,600 533.25,500"></polygon>
            <polygon points="711,500 533.25,600 711,600"></polygon>
            <polygon points="0,400 0,600 355.5,400"></polygon>
            <polygon points="355.5,800 0,800 355.5,600"></polygon>
            <polygon points="711,600 711,800 355.5,800"></polygon>
            <polygon points="1066.5,600 1422,600 1422,400"></polygon>
            <polygon points="1066.5,600 711,400 711,600"></polygon>
            <polygon points="1066.5,600 711,600 1066.5,800"></polygon>
            <polygon points="1422,600 1422,800 1066.5,800"></polygon>
          </g>
          <g
            fill="hsl(220, 62%, 45%)"
            strokeWidth="3"
            stroke="hsl(220, 43%, 13%)"
          ></g>
        </svg>
      </div>

      <Outlet />
      <Toaster />
    </main>
  );
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
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
