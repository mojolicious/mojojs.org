import mojo from '@mojojs/core';
import DOM from '@mojojs/dom';
import Path from '@mojojs/path';
import * as commonmark from 'commonmark';

const app = mojo();

const docPaths = {};
const docs = Path.currentFile().sibling('docs');

app.static.publicPaths.push(docs.toString());

for await (const file of docs.list({recursive: true})) {
  const f = file.toObject();
  if (f.ext !== '.md') continue;
  docPaths[f.name.toLowerCase()] = file;
}

{
  const reader = new commonmark.Parser(); //({smart: true});
  const writer = new commonmark.HtmlRenderer();
  app.addHelper('commonmarkToHTML', (ctx, md) => {
    const parsed = reader.parse(md);
    return writer.render(parsed);
  });
}

app.get('/:page', async ctx => {
  const page = ctx.stash.page;
  const path = docPaths[page];
  if (!path || !(await path.isReadable())) {
    return ctx.notFound();
  }
  const md = await path.readFile('utf8');
  const dom = new DOM(ctx.commonmarkToHTML(md));
  dom.at('head').remove();
  dom.at('html').strip();
  dom.at('body').strip();
  dom.find('img').forEach(el => {
    const src = el.attr.src;
    if (!(src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/'))) {
      el.attr.src = ctx.urlForFile(src);
    }
  });
  return ctx.render('mojodocs', {doc: dom.toString(), title: page});
});

//app.get('/', ctx => ctx.redirectTo('https://github.com/mojolicious/mojo.js'));

app.start();
