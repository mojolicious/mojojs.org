/**
 * @typedef { import("@mojojs/core").MojoApp } MojoApp
 * @typedef { import("@mojojs/core").MojoContext } MojoContext
 */
import DOM from '@mojojs/dom';
import {Parser, HtmlRenderer} from 'commonmark';

/**
 * @param {MojoApp} app
 */
export default function sharedHelpersPlugin(app) {
  app.addHelper('markdownToArticle', markdownToArticle);
}

/**
 * @param {MojoContext} ctx
 */
function markdownToArticle(ctx, markdown) {
  const reader = new Parser();
  const writer = new HtmlRenderer();
  const parsed = reader.parse(markdown);
  const rendered = writer.render(parsed);
  const dom = new DOM(rendered);

  // Try to find a title
  let title = 'Documentation';
  const docTitle = dom.at('h1');
  if (docTitle !== null) title = docTitle.text();

  // Rewrite images
  for (const img of dom.find('img')) {
    img.attr['style'] = 'max-width: 100%;';
    const src = img.attr['src'];
    if (src === undefined || src.startsWith('images') !== true) continue;
    img.attr['src'] = ctx.urlForFile(`/${src}`);
  }

  // Rewrite headers
  const sections = [];
  for (const el of dom.find('h1, h2, h3, h4')) {
    if (el.tag === 'h1' || el.tag === 'h2' || sections.length === 0) sections.push([]);
    const text = el.text();
    const id = text.replaceAll(' ', '-').toLowerCase();
    el.attr['id'] = id;
    const link = '#' + id;
    sections[sections.length - 1].push(text, link);
    const permaLink = `<a href="${link}" class="permalink">#</a>`;
    el.replaceContent(permaLink + `<a href="#toc">${text}</a>`);
  }

  // Fix highlighting
  for (const el of dom.find('pre > code')) {
    const attr = el.attr['class'] ?? '';
    if (/langauge-.+/.test(attr) === true) continue;
    el.attr['class'] = attr === '' ? 'nohighlight' : `${attr} nohighlight`;
  }

  const html = dom.toString();

  return {html, sections, title};
}
