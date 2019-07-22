import collect from './extract-webpack-config';
import { writeFile } from 'fs';
import { inspect } from 'util';
import rimraf from 'rimraf';

(async () => {
  const config = await collect();
  rimraf.sync('./config/*');
  writeFile('./config/webpack.config.client.js', inspect(config.client, { depth: null, maxArrayLength: null }), () => {});
  writeFile('./config/webpack.config.server.js', inspect(config.server, { depth: null, maxArrayLength: null }), () => {});
})().catch(e => {
  console.log(e);
});
