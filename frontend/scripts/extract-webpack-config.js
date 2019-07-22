import { Nuxt, Builder } from 'nuxt';
import { BundleBuilder } from '@nuxt/webpack/dist/webpack';
import path from 'path';
const config = require('../nuxt.config.js');

class CustomBundleBuilder extends BundleBuilder {
  constructor (context) {
    super(context);
    this.compilerMap = {};
  }

  /**
   * Skip running compiler and store compiler into compilerMap
   * @override
   */
  async webpackCompile (compiler) {
    this.compilerMap[compiler.name] = compiler;
  }
}

export default async () => {
  const nuxt = new Nuxt({
    ...config,
    buildDir: path.resolve(process.cwd(), 'config/')
  });
  const customBuilder = new Builder(nuxt, CustomBundleBuilder);
  await customBuilder.build();
  customBuilder.close(); // EDIT: By default nuxt.options is set for development, need to close builder to stop nuxt from watching for fileChange

  return customBuilder.bundleBuilder.compilerMap;
};
