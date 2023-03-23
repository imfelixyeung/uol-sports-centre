/* eslint-disable node/no-unpublished-import */
import * as esbuild from 'esbuild';
import tsPaths from 'esbuild-ts-paths';

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/index.js',
  packages: 'external',
  plugins: [tsPaths()],
});
