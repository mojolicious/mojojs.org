/**
 * @typedef { import("@mojojs/core").MojoApp } MojoApp
 */
import Path from '@mojojs/path';

/**
 * @param {MojoApp} app
 */
export default function fortunePlugin(app, config) {
  const file = new Path(config.path);

  let lines = ['Missing fortunes. Reward: $1,000!'];
  if (file.existsSync() === true) lines = file.readFileSync('utf-8').split('\n');

  app.addHelper('fortune', () => {
    return lines[Math.floor(Math.random() * lines.length)];
  });
}
