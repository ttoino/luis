import { addWorkerExports } from "@oselvar/sveltekit-add-worker-exports";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        enhancedImages(),
        sveltekit(),
        tailwindcss(),
        addWorkerExports({ entryPoint: "src/lib/server/worker.ts" }),
    ],
});
