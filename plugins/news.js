import Path from '@mojojs/path';

export default function docsPlugin(app, config) {
  const dir = config.dir;
  app.log.debug(`News directory: ${dir}`);
  const route = config.route;
  route.any('/', ctx => newsHandler(ctx, dir));
}

async function newsHandler(ctx, dir) {
  const file = ctx.stash.file;

  const path = dir.child(new Path(...file.split('/')).toString() + '.md');

  if (await path.exists()) {
    const {html, title} = ctx.markdownToArticle(await path.readFile('utf-8'));
    await ctx.render({view: 'mojojs/news'}, {news: html, file, title});
  } else {
    await ctx.notFound();
  }
}
