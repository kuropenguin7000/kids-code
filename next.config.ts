import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Hide the Next.js dev toolbar indicator (bottom-left icon)
  devIndicators: false,
  images: {
    remotePatterns: [
      // Google account avatars shown after sign-in
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
