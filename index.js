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

app.plugin(sharedHelpersPlugin);
const blog = await app.plugin(blogPlugin, {
  route: app.get('/news'),
  configPath: app.home.child('news/feed.yaml'),
});
app.plugin(fortunePlugin, {path: app.home.child('fortune.txt').toString()});

app.any('/docs/*file').to('docs#index', {file: null});

app.get('/', async ctx => {
  await ctx.render({view: 'index'});
});

app.start();
