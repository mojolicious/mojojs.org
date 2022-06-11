import docsPlugin from './plugins/docs.js';
import fortunePlugin from './plugins/fortune.js';
import mojo from '@mojojs/core';

export const app = mojo();

app.plugin(fortunePlugin, {path: app.home.child('fortune.txt').toString()});

const docDirs = ['../mojo.js/docs', 'docs'];
for (const docDir of docDirs) {
  const dir = app.home.child(...docDir.split('/'));
  if (dir.existsSync() === false) continue;
  const route = app.any('/docs/*file').to({file: null});
  app.plugin(docsPlugin, {dir, route});
  break;
}

app.get('/', async ctx => {
  await ctx.render({view: 'mojojs/index'});
});

app.start();
