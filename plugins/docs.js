import {version} from '@mojojs/core';
import DOM from '@mojojs/dom';
import {Parser, HtmlRenderer} from 'commonmark';

export default function docsPlugin(app, config) {
  const dir = config.dir;
  app.log.debug(`Documentation directory: ${dir}`);
  app.static.publicPaths.push(dir.toString());

  const route = config.route;
  route.any('/', ctx => docsHandler(ctx, dir));
}

async function docsHandler(ctx, dir) {
  const file = ctx.stash.file ?? 'README.md';

  // Ensure "/docs/"
  if (ctx.stash.file === null && ctx.req.url.endsWith('/') === false) return ctx.redirectTo('/docs/');

  const path = dir.child(...file.split('/'));

  if (await path.exists()) {
    const reader = new Parser();
    const writer = new HtmlRenderer();
    const parsed = reader.parse(await path.readFile('utf-8'));
    const rendered = writer.render(parsed);
    const dom = new DOM(rendered);

    // Rewrite headers
    const parts = [];
    for (const el of dom.find('h1, h2, h3, h4')) {
      if (el.tag === 'h1' || parts.length === 0) parts.push([]);
      const text = el.text();
      const id = text.replaceAll(' ', '-');
      el.attr['id'] = id;
      const link = '#' + id;
      parts[parts.length - 1].push(text, link);
      const permaLink = `<a href="${link}" class="permalink">#</a>`;
      el.replaceContent(permaLink + `<a href="#toc">${text}</a>`);
    }

    // Try to find a title
    let title = 'Documentation';
    const docTitle = dom.at('h1');
    if (docTitle !== null) title = docTitle.text();

    const docs = dom.toString();
    await ctx.render({view: 'mojojs/docs'}, {docs, file, title, version});
  } else {
    await ctx.notFound();
  }
}
