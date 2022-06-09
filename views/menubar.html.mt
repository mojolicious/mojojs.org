<nav class="navbar navbar-expand-lg navbar-dark mojobar">
  <a href="https://mojojs.org" id="mojobar-brand" class="navbar-brand">
    <picture>
      <img src="<%= ctx.urlForFile('/mojo/logo-white.png') %>"
        srcset="<%= ctx.urlForFile('/mojo/logo-white-2x.png') %> 2x">
    </picture>
  </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav"
    aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div id="navbarNav" class="collapse navbar-collapse">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="communityDropdown" role="button" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
          Community
        </a>
        <div class="dropdown-menu" aria-labelledby="communityDropdown">
          <a class="dropdown-item" href="https://matrix.to/#/#mojo:matrix.org">Matrix</a>
          <a class="dropdown-item" href="https://web.libera.chat/#mojo">IRC</a>
          <a class="dropdown-item" href="https://github.com/mojolicious/mojo.js/discussions">Forum</a>
          <a class="dropdown-item" href="https://twitter.com/mojolicious_org">Twitter</a>
          <a class="dropdown-item" href="https://blogs.mojolicious.org">Blogs</a>
          <a class="dropdown-item" href="https://www.linkedin.com/groups/8963713/">LinkedIn</a>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="https://github.com/mojolicious/mojo.js/">Contribute on GitHub</a>
      </li>
    </ul>
    <a class="navbar-brand" href="https://mojolicious.org">
      <picture>
        <img src="<%= ctx.urlForFile('/mojo/mojolicious-white.png') %>"
          srcset="<%= ctx.urlForFile('/mojo/mojolicious-white-2x.png') %> 2x">
      </picture>
    </a>
    <form action="https://www.google.com/cse" target="_blank" class="form-inline my-2 my-lg-0">
      <input type="hidden" name="cx" value="014527573091551588235:pwfplkjpgbi">
      <input type="hidden" name="ie" value="URF-8">
      <input type="search" name="q" placeholder="Search...">
    </form>
  </div>
</nav>
