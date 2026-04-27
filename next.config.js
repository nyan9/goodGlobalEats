/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-auth v5 ships pure ESM; transpilePackages lets Next.js bundle it
  // correctly without Babel (SWC handles the ESM transform).
  transpilePackages: ["next-auth", "@auth/core"],
};

module.exports = nextConfig;
