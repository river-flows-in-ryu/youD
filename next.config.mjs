/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-designer.s3.amazonaws.com",
        port: "",
      },
    ],
  },
};

// const withBundleAnalyzer = require("@next/bundle-analyzer")();

// module.exports =
//   process.env.ANALYZE === "true" ? withBundleAnalyzer(nextConfig) : nextConfig;
export default nextConfig;
