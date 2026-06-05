//------------------------------------------------------------------------------
// nanashi v0.0.0
// This code is part of https://github.com/36095/nanashi#readme
//
// Author: Mario Plaza <mario@mplaza.cl>
// Contributors: none
// Date: June 04, 2026
// License: MIT
//------------------------------------------------------------------------------
Object.defineProperty(exports,Symbol.toStringTag,{value:`Module`});var e=class{static get date(){return new Date}static get hours(){return this.date.getHours().toString().padStart(2,`0`)}static get minutes(){return this.date.getMinutes().toString().padStart(2,`0`)}static get seconds(){return this.date.getSeconds().toString().padStart(2,`0`)}static get milliseconds(){return this.date.getMilliseconds().toString().padStart(3,`0`)}static get formatted(){return`${this.hours}:${this.minutes}:${this.seconds}`}static get formatted_with_milliseconds(){return`${this.hours}:${this.minutes}:${this.seconds}:${this.milliseconds}`}};let t=`info`;const n={silly:0,debug:1,success:1,info:2,warning:3,error:4},r={debug:`\x1B[1;36m`,info:`\x1B[1;37m`,silly:`\x1B[1;35m`,success:`\x1B[1;32m`,warning:`\x1B[1;33m`,error:`\x1B[1;31m`,reset:`\x1B[0;22;23;24;25;27;28;29m`,simple_reset:`\x1B[0;22m`,dim_white:`\x1B[2m`};function i(i=`silly`,a){if(process.env.NODE_ENV?.toLowerCase().startsWith(`dev`)||(t=`warning`),n[i]<n[t])return;let o=`${r[i]}[${i.toUpperCase()}]${r.simple_reset}`,s=`${r.dim_white}${n[t]<=1?e.formatted_with_milliseconds:e.formatted}`+r.reset;process.stdout.write(`${s} ${o.padEnd(23)} ${a}\n`)}function a(){process.stdout.write(`\x1B[H\x1B[2J\x1B[3J`)}exports.DateHandler=e,exports.clear=a,exports.colors=r,exports.levelPriority=n,Object.defineProperty(exports,"logLevel",{enumerable:!0,get:function(){return t}}),exports.logger=i;
// made with <3 in chile