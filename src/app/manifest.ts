import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpoFlow",
    short_name: "OpoFlow",
    description: "Planifica, sigue y analiza tu preparación de oposición.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4EE",
    theme_color: "#CAD7C5",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
