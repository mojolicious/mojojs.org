import Path from '@mojojs/path';
import yaml from 'js-yaml';

export default async function plugin(app, {route, configPath}) {
  const blog = await Blog.fromFile(configPath);
  if (!blog) return null;
  route.get('/').to({fn: ctx => blog.renderFeed(ctx)});
  blog.fileRoute = route.get('/*file').to({fn: ctx => blog.renderPost(ctx, ctx.stash.file)});
  return blog;
}

class Blog {
  static async fromFile(path) {
    try {
      const spec = yaml.load(await path.readFile('utf-8'));
      const config = {};

      config.postsPath = new Path(spec.postsPath ?? 'posts');
      if (!config.postsPath.isAbsolute()) {
        config.postsPath = path.sibling(...config.postsPath.toArray());
      }

      const blog = new Blog(config);

      if (spec.feed) {
        await blog.loadFeedFiles(spec.feed);
      }

      return blog;
    } catch (e) {
      console.log(e);
      return null;
    }

  }

  constructor(options = {}) {
    this.postsPath = options.postsPath ?? new Path('posts');
    this.authorsPath = options.authorsPath ?? this.postsPath.sibling('authors.yaml'); // this will almost certainly change
    this.feed = options.feed ?? [];
    this.fileRoute = options.fileRoute;
  }

  async loadFeedFiles(files) {
    const posts = await Promise.all(files.map(file => this.getPost(file)));
    this.feed.push(...posts);
  }

  async renderFeed(ctx) {
    await ctx.render({json: this.feed.map(post => post.url())});
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
    } else {
      return this.file;
    }
  }
}
