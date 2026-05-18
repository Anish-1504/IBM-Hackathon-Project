/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/IBM-Hackathon-Project' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/IBM-Hackathon-Project/' : '',
}

module.exports = nextConfig

// Made with Bob
