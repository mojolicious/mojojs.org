import {Parser, HtmlRenderer} from 'commonmark';

export default function docsPlugin(app, config) {
  const dir = config.dir;
  app.log.debug(`Documentation directory: ${dir}`);
  app.static.publicPaths.push(dir.toString());

  const route = config.route;
  route.any('/', ctx => docsHandler(ctx, dir));
}

async function docsHandler(ctx, dir) {
  const file = ctx.stash.file ?? 'Introduction.md';
  const path = dir.child(...file.split('/'));

  if (await path.exists()) {
    const reader = new Parser();
    const writer = new HtmlRenderer();
    const parsed = reader.parse(await path.readFile('utf-8'));
    const result = writer.render(parsed);

    await ctx.render({text: result});
  } else {
    await ctx.notFound();
  }
}