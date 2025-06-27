import { join, relative } from 'path';
import { writeFile } from 'fs/promises';
import { BasicContext, FileBinding } from '@fewu-swg/abstract-types';

let files: FileBinding[] = [];

function getAllPages(ctx: BasicContext) {
    let list: { url: string, time: Date }[] = [];
    files.forEach(v => {
        list.push({
            url: relative(ctx.PUBLIC_DIRECTORY, v.target.path!),
            time: v.source.stat!.ctime
        })
    });
    return list;
}

function txt(ctx: BasicContext) {
    let pages = getAllPages(ctx);
    let result = ctx.config.url + '\n';
    for (const v of pages) {
        let url = new URL(ctx.config.url);
        url.pathname = v.url;
        result += url.href + '\n';
    }
    return result;
}

function xml(ctx: BasicContext) {
    let pages = getAllPages(ctx);
    let result = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
    result += `\n<url><loc>${encodeURI(ctx.config.url)}</loc><priority>1.0</priority></url>\n`;
    for (const v of pages) {
        let url = new URL(ctx.config.url);
        url.pathname = v.url;
        result += `<url>\n\t<loc>${url.href}</loc>\n\t<lastmod>${v.time.toUTCString()}</lastmod>\n</url>\n`;
    }
    result += '</urlset>';
    return result;
}

export default function installSitemap(_ctx: BasicContext) {
    // @ts-ignore
    _ctx.on('load', (ctx: BasicContext) => {
        ctx.Deployer.on('afterDeploy', (ctx: BasicContext, file_binding: FileBinding) => {
            if (relative(ctx.SOURCE_DIRECTORY, file_binding.source.path!).startsWith('posts')) {
                files.push(file_binding);
            }
        });
    });
    _ctx.on('ready', async (ctx: BasicContext) => {
        // @ts-ignore
        let config = ctx.config?.plugin_configs?.['fewu-plugin-basic-improvement']?.['sitemap'];
        let enabled = config ? config.enabled ?? true : false;
        if (!enabled) console.log(`[INFO]  PLUGIN basic-improvement: sitemap is disabled.`);
        let sitemap_type = config.type ?? 'xml';
        let sitemap_path = join(ctx.PUBLIC_DIRECTORY, config.filename ?? 'sitemap.xml');
        if (sitemap_type === 'txt') {
            await writeFile(sitemap_path, txt(ctx));
        } else {
            let xmlContent = xml(ctx);
            await writeFile(sitemap_path, xmlContent);
        }
    });
}
