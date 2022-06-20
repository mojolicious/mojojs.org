import {version} from '@mojojs/core';
import Path from '@mojojs/path';

export default class DocsController {
  async index(ctx) {
    const file = ctx.stash.file ?? 'README.md';

    // Ensure "/docs/"
    if (ctx.stash.file === null && ctx.req.url.endsWith('/') === false) return ctx.redirectTo('/docs/');

    const path = new Path(ctx.config.docDir).child(...file.split('/'));

    if (await path.exists()) {
      const {html, sections, title} = ctx.markdownToArticle(await path.readFile('utf-8'));
      await ctx.render({view: 'mojojs/docs'}, {docs: html, file, sections, title, version});
    } else {
      await ctx.notFound();
    }
  }
}
