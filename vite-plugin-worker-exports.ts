import type { Config } from "@sveltejs/kit";

import { loadSvelteConfig, svelte } from "@sveltejs/vite-plugin-svelte";
import { access, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { type Plugin, build as viteBuild } from "vite";

export const customWorkerExports = (options: {
    entryPoint: string;
    outputDir?: string;
}): Plugin => ({
    apply: "build",
    async closeBundle() {
        const outputDir = resolve(
            options.outputDir ?? ".svelte-kit/cloudflare",
        );
        const workerPath = resolve(outputDir, "_worker.js");
        const sveltekitPath = resolve(outputDir, "_sveltekit_worker.js");

        // Idempotent: skip if already patched
        if (await exists(sveltekitPath)) return;

        // Skip if the adapter hasn't run yet
        if (!(await exists(workerPath))) return;

        // Load the project's svelte.config.js to reuse its settings
        const svelteConfig: Config | undefined = await loadSvelteConfig();
        const libDir = svelteConfig?.kit?.files?.lib ?? "src/lib";

        // Bundle the named exports using Vite + Svelte SSR plugin.
        // This handles .svelte files that esbuild (used by addWorkerExports) cannot process.
        await viteBuild({
            build: {
                emptyOutDir: false,
                outDir: outputDir,
                rollupOptions: {
                    external: (id: string) => id.startsWith("cloudflare:"),
                    input: resolve(options.entryPoint),
                    output: {
                        entryFileNames: "_extra_exports.js",
                        format: "es",
                    },
                },
                sourcemap: true,
                ssr: true,
            },
            configFile: false,
            plugins: [svelte(svelteConfig?.vitePlugin)],
            resolve: {
                alias: {
                    $lib: resolve(libDir),
                },
            },
        });

        // Rename original worker and create merged entry point
        await rename(workerPath, sveltekitPath);
        await writeFile(
            workerPath,
            `export { default } from './_sveltekit_worker.js';\nexport * from './_extra_exports.js';\n`,
        );
    },
    enforce: "post",
    name: "custom-worker-exports",
});

const exists = async (path: string) => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
};
