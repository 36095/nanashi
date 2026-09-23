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
var e=class{static get date(){return new Date}static get hours(){return this.date.getHours().toString().padStart(2,`0`)}static get minutes(){return this.date.getMinutes().toString().padStart(2,`0`)}static get seconds(){return this.date.getSeconds().toString().padStart(2,`0`)}static get milliseconds(){return this.date.getMilliseconds().toString().padStart(3,`0`)}static get formatted(){return`${this.hours}:${this.minutes}:${this.seconds}`}static get formatted_with_milliseconds(){return`${this.hours}:${this.minutes}:${this.seconds}:${this.milliseconds}`}static docs_date(e,t,n,r,i,a,o){let s;return s=e===void 0?this.date:t===void 0?new Date(e):new Date(e,t,n,r,i,a,o),s.toLocaleDateString(`en-US`,{year:`numeric`,month:`long`,day:`numeric`})}};export{e as DateHandler,e as default};
// made with ❤️ in chile