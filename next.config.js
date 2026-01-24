/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    swcPlugins: [],
    optimizePackageImports: [
      "lucide-react",
      "@headlessui/react",
      "@radix-ui/react-icons",
      "flowbite-react",
      "lodash",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "latas3.s3.eu-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/random/**",
      },
      {
        protocol: "https",
        hostname: "latastoragedbs3.blob.core.windows.net",
        port: "",
        pathname: "/lata/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "7648b936cbece3a85f612bf7cb1c566d.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-513ca056412e4bb4b42050402b394c63.r2.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
