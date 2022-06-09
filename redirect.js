import mojo from '@mojojs/core';

const app = mojo();

app.get('/', ctx => ctx.redirectTo('https://github.com/mojolicious/mojo.js'));

app.start();
