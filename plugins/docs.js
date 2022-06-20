import {version} from '@mojojs/core';

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
    const {html, sections, title} = ctx.markdownToArticle(await path.readFile('utf-8'));
    await ctx.render({view: 'mojojs/docs'}, {docs: html, file, sections, title, version});
  } else {
    await ctx.notFound();
  }
}
