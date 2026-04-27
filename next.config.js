/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile next-auth v5 (ESM) through Next.js bundler so it works
  // alongside the Babel-based decorator pipeline required by type-graphql.
  transpilePackages: ["next-auth", "@auth/core"],
};

module.exports = nextConfig;
