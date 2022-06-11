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
  const path = dir.child(...file.split('/'));

  if (await path.exists()) {
    const reader = new Parser();
    const writer = new HtmlRenderer();
    const parsed = reader.parse(await path.readFile('utf-8'));
    const rendered = writer.render(parsed);
    const dom = new DOM(rendered);
    const docs = dom.toString();

    await ctx.render({view: 'mojojs/docs'}, {docs});
  } else {
    await ctx.notFound();
  }
}
