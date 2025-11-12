// next.config.ts
const nextConfig = {
  async redirects() {
    // in sviluppo NON fare redirect
    if (process.env.NODE_ENV === "development") {
      return [];
    }

    // in produzione puoi forzare il dominio
    return [
      {
        source: "/:path*",
        destination: "https://ifinditforyou.com/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;


