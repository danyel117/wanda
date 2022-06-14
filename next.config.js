/** @type {import('next').NextConfig} */
const { withSuperjson } = require('next-superjson');

module.exports = withSuperjson()({
  images: {
    domains: ['s3.amazonaws.com'],
  },
  reactStrictMode: true,
});
