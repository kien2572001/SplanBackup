/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "res.cloudinary.com",
      "phunugioi.com",
      "via.placeholder.com",
      "i.pinimg.com",
      "akira.edu.vn",
      "muakey.vn",
      'project.localhost',
      'splan-stg.sun-asterisk.vn',
      'sportshub.cbsistatic.com',
      'avatars.githubusercontent.com',
    ],
  },
};

module.exports = nextConfig;
