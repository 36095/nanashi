import { defineConfig } from 'tsdown';
import nanashi from './package.json' with { type: 'json' };
import { DateHandler } from './src/classes/DateHandler.ts';
const nanashi_name = nanashi.name.split('/').at(-1) as string;
export default defineConfig({
  unbundle: true,
  outputOptions: {
    name: nanashi_name[0].toUpperCase() + nanashi_name.substring(1),
    exports: 'named',
  },
  exports: true,
  format: ['cjs', 'esm'],
  minify: true,
  footer: '// made with ❤️ in chile',
  name: nanashi.name,
  banner: `//------------------------------------------------------------------------------
// ${nanashi.name} v${nanashi.version}
// This code is part of ${nanashi.homepage}
//
// Author: ${nanashi.author.name} <${nanashi.author.email}>
// Contributors: ${
    nanashi.contributors.length > 0 ?
      nanashi.contributors.map(({ name, email, url }) => {
        email = email != '' ? ` <${email}>` : '';
        url = url != '' ? ` (${url})` : '';
        return `\n//   - ${name}${email}${url}`;
      })
    : 'none'
  }
// Build Date: ${DateHandler.docs_date()}
// License: MIT
//------------------------------------------------------------------------------`,
  hash: true,
  // ...config options
});
