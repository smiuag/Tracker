import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // El indicador flotante de Next dev se solapa visualmente con la barra
  // de navegación inferior en viewports estrechos; no aporta nada en un
  // proyecto sin rutas de servidor dinámicas.
  devIndicators: false,
  // Serwist injects a webpack() config even when disabled; Turbopack (the
  // `next dev` default) refuses to start unless we explicitly acknowledge
  // that. Production builds still run with --webpack (see package.json)
  // so Serwist can generate the real service worker.
  turbopack: {},
};

export default withSerwist(nextConfig);
