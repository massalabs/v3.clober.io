const BUILD =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF !== 'main' ? 'dev' : 'prod'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  env: {
    BUILD,
  },
  images: {
    domains: [
      'assets.odos.xyz',
      'img.cryptorank.io',
      'dd.dexscreener.com',
      'avatars.githubusercontent.com',
      'cryptologos.cc',
      'pyth.network',
      'imagedelivery.net',
      'pbs.twimg.com',
      'www.magmastaking.xyz',
      'kintsu-logos.s3.us-east-1.amazonaws.com',
      'i.imghippo.com',
      'assets.coingecko.com',
      'storage.nadapp.net',
      'cdn.countryflags.com',
    ],
  },
}

module.exports = nextConfig
