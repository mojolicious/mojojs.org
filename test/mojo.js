import {app} from '../index.js';
import t from 'tap';

t.test('mojojs.org', async t => {
  app.log.level = 'debug';
  const ua = await app.newTestUserAgent({tap: t});

  await t.test('Welcome', async () => {
    (await ua.getOk('/')).statusIs(200).textLike('title', /mojo.js - JavaScript real-time web framework/);
  });

  await ua.stop();
});
