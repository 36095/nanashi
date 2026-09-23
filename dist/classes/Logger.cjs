//------------------------------------------------------------------------------
// @36095/nanashi v0.0.2
// This code is part of https://github.com/36095/nanashi
//
// Author: Mario Plaza <me@mplaza.cl>
// Contributors: 
//   - Mario Plaza <me@mplaza.cl> (https://mplaza.cl),
//   - 36095 <36095@mplaza.cl> (https://mplaza.cl/github)
// Build Date: September 23, 2026
// License: MIT
//------------------------------------------------------------------------------
const e=require("./DateHandler.cjs");let t=process.env.LOG_LEVEL||`info`;const n={silly:0,debug:1,success:1,info:2,warning:3,error:4},r={debug:`\x1B[1;36m`,info:`\x1B[1;37m`,silly:`\x1B[1;35m`,success:`\x1B[1;32m`,warning:`\x1B[1;33m`,error:`\x1B[1;31m`,reset:`\x1B[0;22;23;24;25;27;28;29m`,simple_reset:`\x1B[0;22m`,dim_white:`\x1B[2m`},i=new Set;function a(e,t){i.has(e)||(process.stdout.write(`${r.warning}Deprecation Warning:${r.reset} ${r.dim_white}The ${e}() function is deprecated and will be removed in a future version, please use ${t}() instead.${r.reset}\n`),i.add(e))}var o=class i{static defineConfig(e){e.level!==void 0&&(t=e.level)}static setLogLevel(e){i.defineConfig({level:e})}static log(i=`silly`,a){if(n[i]<n[t])return;let o=`${r[i]}[${i.toUpperCase()}]${r.simple_reset}`,s=`${r.dim_white}${n[t]<=1?e.DateHandler.formatted_with_milliseconds:e.DateHandler.formatted}`+r.reset;process.stdout.write(`${s} ${o.padEnd(23)} ${a}\n`)}static clear(){process.stdout.write(`\x1B[H\x1B[2J\x1B[3J`),process.stdout.write(`${r.dim_white}Console cleared${r.reset}\n`)}static fatal(e,t){let n=t?`[Fatal]: ${e} \n ${t}\n`:`[Fatal]: ${e}\n`;i.log(`error`,n),process.stderr.write(n),process.exit(1)}};function s(e=`silly`,t){a(`log`,`Logger.log()`),o.log(e,t)}function c(){o.clear(),a(`clear`,`Logger.clear`)}function l(e,t){a(`fatal`,`Logger.fatal`),o.fatal(e,t)}exports.clear=c,exports.colors=r,exports.default=o,exports.fatal=l,exports.levelPriority=n,exports.log=s,exports.logger=s,Object.defineProperty(exports,"logLevel",{enumerable:!0,get:function(){return t}});
// made with ❤️ in chile