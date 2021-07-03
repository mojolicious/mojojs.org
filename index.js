import mojo from '@mojojs/core';

const app = mojo();

app.get('/', ctx => ctx.redirectTo('https://mojolicious.org'));

app.start();
