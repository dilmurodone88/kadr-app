/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Nginx orqasida ishlaydi; standart port 3000
  output: undefined,
  // mammoth (docx→html) bundle qilinmasin — Node moduli sifatida yuklansin
  serverExternalPackages: ["mammoth"],
};

export default nextConfig;
