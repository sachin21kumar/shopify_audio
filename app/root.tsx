import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { useEffect } from "react";

export default function App() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔑 Ensure `host` param is preserved in production
  useEffect(() => {
    const host = searchParams.get("host");
    if (!host) return;

    if (!location.search.includes("host=")) {
      navigate(`${location.pathname}?host=${host}`, { replace: true });
    }
  }, [searchParams, location, navigate]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
