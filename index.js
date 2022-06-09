import fortunePlugin from './plugins/fortune.js';
import mojo from '@mojojs/core';
import Path from '@mojojs/path';

export const app = mojo();
app.plugin(fortunePlugin, {path: Path.currentFile().sibling('fortune.txt').toString()});

app.get('/', async ctx => {
  await ctx.render({view: 'mojojs/index'});
});

app.start();
