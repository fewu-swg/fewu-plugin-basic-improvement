import { cp } from "fs/promises";
import { join } from "path";
import { BasicContext } from "@fewu-swg/abstract-types";

export default function installExtraFiles(_ctx: BasicContext) {
    _ctx.on('afterDeploy', async (ctx: BasicContext) => {
        // @ts-ignore
        let config = ctx.config?.plugin_configs?.['fewu-plugin-basic-improvement']?.['extra-files'];
        let enabled = config ? config.enabled ?? true : false;
        if(!enabled) console.log(`[INFO]  PLUGIN basic-improvement: extra-files is disabled.`);
        let source_path = config?.from ?? 'extra';
        let extra_file = config?.files;
        if (!Array.isArray(extra_file)) return;
        for await (let k of extra_file) {
            await cp(join(source_path, k), join(ctx.PUBLIC_DIRECTORY, k), { recursive: true });
        }
    });
}
