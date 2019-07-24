import collect from './extract-webpack-config';
import { writeFile } from 'fs';
import rimraf from 'rimraf';

(async () => {
  const config = await collect();
  rimraf.sync('./config/*');
  writeFile('./config/webpack.config.client.js', `module.exports = ${JSON.stringify(config.client.options, null, 2)}`, () => {});
  writeFile('./config/webpack.config.server.js', `module.exports = ${JSON.stringify(config.server.options, null, 2)}`, () => {});
})().catch(e => {
  console.log(e);
});
