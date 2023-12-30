const withTM = require('next-transpile-modules')(['@mui/material', '@mui/system']); // pass the modules you would like to see transpiled

module.exports = withTM({
  // Your existing module.exports
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/styled-engine': '@mui/styled-engine-sc',
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    domains: [
      'newstart.cdn.prismic.io',
      'nsassets110340-dev.s3.ap-south-1.amazonaws.com',
      'images.prismic.io',
      'ns-assets165829-admin.s3.ap-south-1.amazonaws.com',
      'joeschmoe.io',
      'picsum.photos',
      'newstart-staging.s3.ap-south-1.amazonaws.com',
      'newstart-dev-bucket.s3.us-east-2.amazonaws.com',
      'i.vimeocdn.com',
    ],
  },
  swcMinify: false,
  trailingSlash: true,
  experimental: {
    styledComponents: true,
  },
});
