// build.js
import { build } from 'esbuild';

build({
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  format: 'cjs',
  outfile: 'dist/bundle.cjs',  
  banner: {
    js: '#!/usr/bin/env node'
  }
}).then(() => {
  console.log('✅ esbuild bundling complete!');
}).catch((e) => {
  console.error('❌ esbuild error:', e);
  process.exit(1);
});