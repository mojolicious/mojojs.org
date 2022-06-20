import Path from '@mojojs/path';

export default class DocsController {
  async index(ctx) {
    const file = ctx.stash.file;

    const path = new Path(ctx.config.newsDir).child(new Path(...file.split('/')).toString() + '.md');

    if (await path.exists()) {
      const {html, title} = ctx.markdownToArticle(await path.readFile('utf-8'));
      await ctx.render({view: 'mojojs/news'}, {news: html, file, title});
    } else {
      await ctx.notFound();
    }
  }
}
