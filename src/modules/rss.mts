import { join } from 'path';
import { writeFile } from 'fs/promises';
import { BasicContext, Page } from "@fewu-swg/abstract-types";

function getRSSFeedXml(ctx: BasicContext, articles: Page[]) {
    return `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>${ctx.config.title}</title>
<atom:link href="${ctx.config.url}" rel="self" type="application/rss+xml" />
<link>${ctx.config.url}</link>
<description>${ctx.config.description}</description>
${articles.map(v =>
`<item>
<title>${v.title}</title>
<link>${encodeURI(decodeURI(join(ctx.config.url, v.relative_path)))}</link>
<guid isPermaLink="false">ID${v.title}</guid>
<description>${v.raw_excerpt}</description>
<pubDate>${v.stat.ctime.toUTCString()}</pubDate>
</item>`
    ).join('')}
</channel>
</rss>`;
}

export default function installRSS(_ctx: BasicContext) {
    _ctx.on('afterDeploy', async (ctx: BasicContext) => {
        // @ts-ignore
        let config = ctx.config?.plugin_configs?.['fewu-plugin-basic-improvement']?.['rss'];
        let enabled = config ? config.enabled ?? true : false;
        if (!enabled) console.log(`[INFO]  PLUGIN basic-improvement: rss is disabled.`);
        let posts = ctx.data.posts;
        let text = getRSSFeedXml(ctx, posts);
        await writeFile(join(ctx.PUBLIC_DIRECTORY, 'feed.xml'), text);
    });
}
