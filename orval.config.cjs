module.exports = {
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
    legacyClient: {
        input: "https://dcs-mod-manager-registry.pages.dev/schema.json",
        output: {
            target: "scripts/migrate/legacy-client.ts",
            baseUrl: "https://dcs-mod-manager-registry.pages.dev",
        },
    }
};
