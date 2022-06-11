export default function docsPlugin(app, config) {
  const dir = config.dir;
  app.log.debug(`Documentation directory: ${dir}`);
  app.static.publicPaths.push(dir.toString());

  const route = config.route;
  route.any('/', ctx => docsHandler(ctx));
}

async function docsHandler(ctx) {
  const file = ctx.stash.file;
  await ctx.render({text: `Future docs for ${file}`});
}
