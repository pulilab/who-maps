import collect from './extract-webpack-config';
import { writeFile } from 'fs';
// import { inspect } from 'util';
import rimraf from 'rimraf';

(async () => {
  const config = await collect();
  rimraf.sync('./config/*');
  writeFile('./config/webpack.config.client.json', JSON.stringify(config.client, null, 2), () => {});
  writeFile('./config/webpack.config.server.json', JSON.stringify(config.server, null, 2), () => {});
})().catch(e => {
  console.log(e);
});
