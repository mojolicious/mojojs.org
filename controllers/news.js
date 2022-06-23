import Path from '@mojojs/path';
import yaml from 'js-yaml';

export default class Controller {
  async post(ctx) {
    const file = ctx.stash.file;

    const postsDir = ctx.config.newsDir.child('posts');
    const path = postsDir.child(new Path(...file.split('/')).toString() + '.md');

    if (await path.exists()) {
      const contents = await path.readFile('utf-8');
      // collect the header
      let [header, body] = contents.split(/\r?\n---\r?\n/, 2);
      // body is assumed if only one section
      if (!body) {
        body = header;
        header = '{}';
      }
      const data = yaml.load(header);
      const {html, title} = ctx.markdownToArticle(body);
      await ctx.render({}, {news: html, file, title, data});
    } else {
      await ctx.notFound();
    }
  }
}
