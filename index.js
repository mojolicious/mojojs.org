import fortunePlugin from './plugins/fortune.js';
import sharedHelpersPlugin from './plugins/shared-helpers.js';
import blogPlugin from './plugins/blog.js';
import mojo from '@mojojs/core';

export const app = mojo();

function detectDocsDirecotry() {
  const docDirs = ['../mojo.js/docs', 'docs'];
  for (const docDir of docDirs) {
    const dir = app.home.child(...docDir.split('/'));
    if (dir.existsSync() === false) continue;
    return dir.toString();
  }
  return app.home.child('public').toString();
}

const docDir = detectDocsDirecotry();
app.static.publicPaths.push(docDir);

app.config.docDir = docDir;
app.config.newsDir = app.home.child('news');

app.plugin(sharedHelpersPlugin);
app.plugin(blogPlugin, {route: app.get('/news'), options: {rootPath: app.config.newsDir}});
app.plugin(fortunePlugin, {path: app.home.child('fortune.txt').toString()});

app.any('/docs/*file').to('docs#index', {file: null});

//app.any('/news/*file').to('news#post');

app.get('/', async ctx => {
  await ctx.render({view: 'index'});
});

app.start();
