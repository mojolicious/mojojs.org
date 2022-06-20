import docsPlugin from './plugins/docs.js';
import fortunePlugin from './plugins/fortune.js';
import newsPlugin from './plugins/news.js';
import sharedHelpersPlugin from './plugins/shared-helpers.js';
import mojo from '@mojojs/core';

export const app = mojo();

app.plugin(sharedHelpersPlugin);
app.plugin(fortunePlugin, {path: app.home.child('fortune.txt').toString()});

// Docs
const docDirs = ['../mojo.js/docs', 'docs'];
for (const docDir of docDirs) {
  const dir = app.home.child(...docDir.split('/'));
  if (dir.existsSync() === false) continue;
  const route = app.any('/docs/*file').to({file: null});
  app.plugin(docsPlugin, {dir, route});
  break;
}

// News
app.plugin(newsPlugin, {dir: app.home.child('news'), route: app.any('/news/*file')});

app.get('/', async ctx => {
  await ctx.render({view: 'mojojs/index'});
});

app.start();
