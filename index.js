import fortunePlugin from './plugins/fortune.js';
import sharedHelpersPlugin from './plugins/shared-helpers.js';
import mojo from '@mojojs/core';

export const app = mojo();

function detectDocsDirecotry() {
  const docDirs = ['../mojo.js/docs', 'docs'];
  for (const docDir of docDirs) {
    const dir = app.home.child(...docDir.split('/'));
    if (dir.existsSync() === false) continue;
    return dir;
  }
  throw new Error('Documentation directory not found');
}

const dir = detectDocsDirecotry().toString();
app.static.publicPaths.push(dir);

app.config.docDir = dir;
app.config.newsDir = app.home.child('news').toString();

app.plugin(sharedHelpersPlugin);
app.plugin(fortunePlugin, {path: app.home.child('fortune.txt').toString()});

app.any('/docs/*file').to('docs#index', {file: null});

app.any('/news/*file').to('news#index');

app.get('/', async ctx => {
  await ctx.render({view: 'index'});
});

app.start();
