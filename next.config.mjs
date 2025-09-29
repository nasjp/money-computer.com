/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@duckdb/duckdb-wasm/dist/duckdb-node.cjs"] = false;
    config.externals = config.externals || [];
    config.externals.push({
      "@duckdb/duckdb-wasm/dist/duckdb-node.cjs":
        "commonjs @duckdb/duckdb-wasm/dist/duckdb-node.cjs",
    });
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      module: /@duckdb\/duckdb-wasm\/dist\/duckdb-node\.cjs/,
    });
    return config;
  },
};

export default nextConfig;
