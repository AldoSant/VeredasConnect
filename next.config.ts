import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	basePath: "/connect",
	outputFileTracingRoot: ".", // Added to address workspace root warning
};

export default nextConfig;