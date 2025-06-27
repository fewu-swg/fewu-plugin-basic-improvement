import { Plugin, BasicContext } from "@fewu-swg/abstract-types";
import installExtraFiles from "./modules/extrafiles.mjs";
import installRSS from "./modules/rss.mjs";
import installSitemap from "./modules/sitemap.mjs";

export default class BasicImprovementPlugin implements Plugin {
    __fewu_plugin_id: string = `fewu.plugin.basic-improvement`;
    __fewu_is_plugin = true;
    __fewu_plugin_name = 'Plugin<Extend::Improvements>';

    exports = {
        renderers: [],
        parsers: [],
        deployers: []
    }

    constructor(_ctx: BasicContext) {
    }

    assigner(_ctx: BasicContext): void {
        installExtraFiles(_ctx);
        installRSS(_ctx);
        installSitemap(_ctx);
    };
}