/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/IBM-Hackathon-Project' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/IBM-Hackathon-Project/' : '',
}

module.exports = nextConfig

// Made with Bob
