/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "production" ? "build" : ".next",
};

export default nextConfig;
