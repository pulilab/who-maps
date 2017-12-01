// const context = require.context('./src', true, /-spec\.js$/);
// context.keys().forEach(context);
const tests = require.context('./unit-test/cms/', true, /\.js$/);
tests.keys().forEach(tests);

const sources = require.context('./src/', true, /\.js$/);
sources.keys().forEach(sources);
