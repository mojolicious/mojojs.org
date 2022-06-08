<!doctype html><html>
  <head>
    <link rel="apple-touch-icon" href="/mojo/touch-icon.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/mojo/touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="167x167" href="/mojo/touch-icon-167x167.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/mojo/touch-icon-180x180.png">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><%= ctx.stash.title ?? 'mojo.js - JavaScript real-time web framework' %></title>
    %= ctx.scriptTag('/mojo/jquery/jquery.js')
    %= ctx.scriptTag('/mojo/highlight.js/highlight.min.js')
    %= ctx.styleTag('/mojo/highlight.js/highlight-mojo-light.css')
    <script>hljs.initHighlightingOnLoad();</script>
    %= ctx.scriptTag('/mojo/bootstrap/bootstrap.js')
    %= ctx.styleTag('/mojo/bootstrap/bootstrap.css')
    %= ctx.styleTag('/mojo/fontawesome/fontawesome.css')
    %= ctx.styleTag('/app.css?v=1')
    %= ctx.content.header
  </head>
  <body><%= ctx.content.main %></body>
</html>
