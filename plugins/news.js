import DOM from '@mojojs/dom';
import Path from '@mojojs/path';
import {Parser, HtmlRenderer} from 'commonmark';

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
    const reader = new Parser();
    const writer = new HtmlRenderer();
    const parsed = reader.parse(await path.readFile('utf-8'));
    const rendered = writer.render(parsed);
    const dom = new DOM(rendered);

    // Try to find a title
    let title = 'Documentation';
    const docTitle = dom.at('h1');
    if (docTitle !== null) title = docTitle.text();

    // Rewrite headers
    const parts = [];
    for (const el of dom.find('h1, h2, h3, h4')) {
      if (el.tag === 'h1' || el.tag === 'h2' || parts.length === 0) parts.push([]);
      const text = el.text();
      const id = text.replaceAll(' ', '-').toLowerCase();
      el.attr['id'] = id;
      const link = '#' + id;
      parts[parts.length - 1].push(text, link);
      const permaLink = `<a href="${link}" class="permalink">#</a>`;
      el.replaceContent(permaLink + `<a href="#toc">${text}</a>`);
    }

    // Fix highlighting
    for (const el of dom.find('pre > code')) {
      const attr = el.attr['class'] ?? '';
      if (/langauge-.+/.test(attr) === true) continue;
      el.attr['class'] = attr === '' ? 'nohighlight' : `${attr} nohighlight`;
    }

    const news = dom.toString();
    await ctx.render({view: 'mojojs/news'}, {news, file, title});
  } else {
    await ctx.notFound();
  }
}
