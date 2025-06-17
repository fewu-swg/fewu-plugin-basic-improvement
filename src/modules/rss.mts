import { join } from 'path';
import { writeFile } from 'fs/promises';
import { BasicContext, Page } from "@fewu-swg/abstract-types";

function getRSSFeedXml(blog_title: string, blog_link: string, description: string, articles: Page[]) {
    return `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>${blog_title}</title>
<atom:link href="${blog_link}" rel="self" type="application/rss+xml" />
<link>${blog_link}</link>
<description>${description}</description>
${articles.map(v =>
        `<item>
<title>${v.title}</title>
<link>${blog_link + v.relative_path}</link>
<guid isPermaLink="false">ID${v.title}</guid>
<description>${v.excerpt}</description>
<pubDate>${v.stat.ctime}</pubDate>
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
        let blog_title = ctx.config.title;
        let blog_link = ctx.config.url;
        let blog_desc = ctx.config.description;
        let posts = ctx.data.posts;
        let text = getRSSFeedXml(blog_title, blog_link, blog_desc, posts);
        await writeFile(join(ctx.PUBLIC_DIRECTORY, 'feed.xml'), text);
    });
}
