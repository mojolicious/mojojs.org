
# mojo.js 1.0 - from Perl to Node.js

After one year of development work we are happy to finally announce the very first major release of the
[mojo.js](https://mojojs.org) web framework for **Node.js**. Now available on
[GitHub](https://github.com/mojolicious/mojo.js) and [NPM](https://www.npmjs.com/package/@mojojs/core).

Here's the obligatory "hello world" single file app, with WebSockets:

```js
import mojo from '@mojojs/core';

const app = mojo();

app.get('/', async ctx => {
  await ctx.render({inline: inlineTemplate});
});

app.websocket('/echo', ctx => {
  ctx.plain(async ws => {
    for await (const message of ws) {
      ws.send(message);
    }
  });
});

app.start();

const inlineTemplate = `
<script>
  const ws = new WebSocket('<%= ctx.urlFor('echo') %>');
  ws.onmessage = event => { document.body.innerHTML += event.data };
  ws.onopen    = event => { ws.send('Hello World!') };
</script>
`;
```

But mojo.js is not really about single file apps. As a very traditional hypermedia framework and spiritual successor to
[Mojolicious](https://mojolicious.org), it strongly encourages a Model-View-Controller (MVC) layout, while also
supporting these single file apps for prototyping.

## But, Why?

Right now almost all JavaScript web frameworks are split into two categories. On one side you have middleware
frameworks, that do pretty much nothing else than routing on their own, so with every new project you have to build
your own framework from scratch with dozens of middleware layers. And on the other side you have the kitchen-sink,
where the framework makes every decision for you, forcing you to use React on the frontend, or MongoDB as the database,
often even limiting your hosting options to a few large cloud providers. Especially the latter kind of web framework
tends not to age very well.

We believe that there is still ample room in the middle for mojo.js. A framework that provides just the essential
building blocks for backend web services. The things that rarely change from project to project. Like routing, serving
static files, server-side rendering, logging, config files, form validation... you get the idea. In ten years from now
you should still feel confident relying on them.

Aside from reliability, having components specifically designed to be used together allows for significant performance
optimisations. That's why mojo.js is a lot faster than Express and Koa for example, despite having many more features.

## From Perl to Node.js

The Mojolicious project is a group of polyglot programmers who started out with Perl back in the hay days of CGI
scripting. Some of us have been making mainstream web frameworks for two decades now. From
[Catalyst](http://catalyst.perl.org) in 2004 to [Mojolicious](https://mojolicious.org) in 2010. Powering some of the
largest sites on the web along the way.

Ever since Perl6 (now [Raku](https://en.wikipedia.org/wiki/Raku_(programming_language))) started to become a thing
we've had plans to port Mojolicious to more languages than just Perl5. But Perl6 drifted into a different direction
than what we were hoping for and so those plans never truly materialised.

However, at the same time JavaScript kept evolving. The language gained features like ES6 classes, `async`/`await`, ES
modules, arrow functions, `const`/`let` keywords and much more. Node.js finally brought JavaScript to the server-side.
On the language level, there's a pretty close relationship between Perl and JavaScript (and it's not just sharing
`use strict` or having native Regex data types). So it was inevitable that some of us would grow to like JavaScript
quite a bit.

## Not quite full-stack web framework

I still remember when full-stack meant that the framework contained a router, template engine, and an ORM with support
for a bunch of SQL databases. These days they include things like a custom React distribution and a subscription for a
serverless hosting service. It's hard to escape these ecosystems again without changing your whole tech stack.

With mojo.js we don't do most of those things. While it ships with a router and server-side renderer with support for
multiple template engines, there is no default database. Just a [workflow](https://mojojs.org/docs/Growing.md#model)
for adding your own model layer. Similarly choosing a frontend framework is entirely up to you. The static file server
will deliver whatever assets you need.

What's most important for us, is to provide you with a rock solid foundation. RESTful routing, WebSockets, static file
server, cli, logging, config files, session management, form and JSON validation, content negotiation, TypeScript types
and a testing framework. Components you can rely on for decades if necessary.

Software supply chain attacks around NPM are a hot topic right now. And it can be quite problematic to audit your whole
dependency tree. Thankfully, while the Perl version has no dependencies at all, in JavaScript we only have 23 trusted
third party dependencies. And we are prepared to replace every single one of them if necessary, with a port of the
battle-tested Perl implementation.

We've also started releasing spin-off projects for standalone use outside of mojo.js, based on some of our other
popular Perl projects. [@mojojs/dom](https://www.npmjs.com/package/@mojojs/dom),
[@mojojs/template](https://www.npmjs.com/package/@mojojs/template) and
[@mojojs/path](https://www.npmjs.com/package/@mojojs/path) follow the same strict rules as mojo.js itself.

## What about Mojolicious?

Now you might be wondering if we are going to abandon Mojolicious. And the answer is a resounding no. All of us still
enjoy Perl very much, and look forward to keeping it alive for at least a few more decades. 😉

**Have fun!**
