import Path from '@mojojs/path';
import yaml from 'js-yaml';

export default function plugin(app, {route, options}) {
  route.get('/').to({fn: ctx => blog.renderFeed(ctx)});
  options.fileRoute = route.get('/*file').to({fn: ctx => blog.renderPost(ctx, ctx.stash.file)});
  const blog = new Blog(options);
  return blog;
}

class Blog {
  constructor(options = {}) {
    this.rootPath = options.rootPath;
    this.postsPath = options.postsPath ?? this.rootPath.child('posts');
    this.authorsPath = options.authorsPath ?? this.rootPath.child('authors.yaml');
    this.feedPath = options.feedPath ?? this.rootPath.child('feed.yaml');
    this.fileRoute = options.fileRoute;
  }

  async getFeed() {
    if (!this.feedPath.exists()) return [];
    const contents = await this.feedPath.readFile('utf-8');
    return await Promise.all(yaml.load(contents).map(file => this.getPost(file)));
  }

  async renderFeed(ctx) {
    const feed = await this.getFeed();
    await ctx.render({json: feed.map(post => post.url())});
  }

  async getPost(file) {
    const path = this.postsPath.child(new Path(...file.split('/')).toString() + '.md');
    return await Post.get(path, file, this);
  }

  async renderPost(ctx, file) {
    const post = await this.getPost(file);

    if (post) {
      const {html, title} = post.render(ctx);
      await ctx.render({view: 'blog/post'}, {news: html, file, title, data: post.metadata});
    } else {
      await ctx.notFound();
    }
  }
}

class Post {
  static async get(...args) {
    const post = new Post(...args);
    if (!post.exists()) return null;
    await post.load();
    return post;
  }

  constructor(path, file, blog) {
    this.path = path;
    this.file = file;
    this.blog = blog;
    this.markdown = undefined;
    this.metadata = undefined;
  }

  exists() { return this.path.exists() }

  async load() {
    const contents = await this.path.readFile('utf-8');
    // collect the header
    let [header, body] = contents.split(/\r?\n---\r?\n/, 2);
    // body is assumed if only one section
    if (!body) {
      body = header;
      header = '{}';
    }
    this.markdown = body;
    this.metadata = yaml.load(header);
  }

  render(ctx) {
    return ctx.markdownToArticle(this.markdown);
  }

  url() {
    if (this.blog.fileRoute) {
      return this.blog.fileRoute.render({file: this.file})
    }
  }
}
