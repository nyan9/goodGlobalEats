/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-auth v5 ships pure ESM; transpilePackages lets Next.js bundle it
  // correctly without Babel (SWC handles the ESM transform).
  transpilePackages: ["next-auth", "@auth/core"],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
