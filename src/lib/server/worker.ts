export { DataPipeline } from "./data-pipeline";

export const scheduled: ExportedHandlerScheduledHandler<Env> = async (_, env) =>
    void (await env.PIPELINE.create());
