import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Firebase Hosting (free/Spark plan serves static assets
  // only — no SSR, no middleware, no API routes). `next build` emits `out/`.
  output: "export",
  // Hide the Next.js dev toolbar indicator (bottom-left icon)
  devIndicators: false,
  images: {
    // The default image optimizer needs a server; a static export can't use it.
    // Avatars come straight from Google (`photoURL`), served as-is.
    unoptimized: true,
  },
};

export default nextConfig;
