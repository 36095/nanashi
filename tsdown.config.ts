import { defineConfig } from 'tsdown';
import nanashi from './package.json' with { type: 'json' };

export default defineConfig({
  dts: {
    tsgo: true,
  },
  exports: true,
  format: ['cjs', 'esm'],
  minify: true,
  footer: '// made with <3 in chile',
  name: nanashi.name,
  banner: `//------------------------------------------------------------------------------
// ${nanashi.name} v${nanashi.version}
// This code is part of ${nanashi.homepage}
//
// Author: Mario Plaza <mario@mplaza.cl>
// Contributors:${
    nanashi.contributors.length > 0 ?
      nanashi.contributors.map((cont) => ' ' + cont)
    : ' none'
  }
// Date: June 04, 2026
// License: MIT
//------------------------------------------------------------------------------`,
  hash: true,
  // ...config options
});
