const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/propuesta',
        destination: '/#planes',
        permanent: false,
      },
      {
        source: '/propuesta-servicios',
        destination: '/#planes',
        permanent: false,
      },
      {
        source: '/propuesta-internacional',
        destination: '/#planes',
        permanent: false,
      },
      {
        source: '/proposal-en',
        destination: '/#planes',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/prestigia-hq-core-2026',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
