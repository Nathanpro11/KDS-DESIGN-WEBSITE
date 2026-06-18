/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ATTENTION !!
    // Cela permet de déployer même s'il y a des erreurs de type.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig