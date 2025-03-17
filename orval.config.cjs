module.exports = {
  registry: {
    input: "https://dcs-mod-manager-registry.pages.dev/schema.json", // Get this locally by running dev in the https://github.com/flying-dice/dcs-dropzone-registry repo
    output: {
      target: "src/client/_autogen/client.ts",
      client: "react-query",
      baseUrl: "https://dcs-mod-manager-registry.pages.dev",
    },
    hooks: {
      afterAllFilesWrite: "deno fmt",
    },
  },
  api: {
    input: "http://localhost:8000/v3/api-docs",
    output: {
      target: "src/client/_autogen/api.ts",
      client: "react-query",
    },
    hooks: {
      afterAllFilesWrite: "deno fmt",
    },
  },
};
