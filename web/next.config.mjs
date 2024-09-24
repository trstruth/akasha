/** @type {import('next').NextConfig} */
const nextConfig = {
    // ... other configurations ...
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.alias = {
                ...config.resolve.alias,
                'grpc': 'grpc-web',
                'fs': false,
                'net': false,
                'tls': false,
            };
        }
        return config;
    },
    output: "standalone"
};

export default nextConfig;
