(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{"7mS5":function(e,n,t){"use strict";t.r(n),t.d(n,"_frontmatter",(function(){return p})),t.d(n,"default",(function(){return i}));t("4cIV"),t("NZyX"),t("c0Gx"),t("QNbk"),t("+ytS"),t("WY76"),t("r0ML");var a=t("V0Ug"),l=t("sN0p");t("xH0s");function r(){return(r=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e}).apply(this,arguments)}var p={};void 0!==p&&p&&p===Object(p)&&Object.isExtensible(p)&&!p.hasOwnProperty("__filemeta")&&Object.defineProperty(p,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/usage-with-babel.md"}});var o={_frontmatter:p},s=l.a;function i(e){var n=e.components,t=function(e,n){if(null==e)return{};var t,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)t=r[a],n.indexOf(t)>=0||(l[t]=e[t]);return l}(e,["components"]);return Object(a.b)(s,r({},o,t,{components:n,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"precompiling-with-babel"},"Precompiling with Babel"),Object(a.b)("p",null,"PDSL comes with a ",Object(a.b)("a",r({parentName:"p"},{href:"https://github.com/ryardley/pdsl/tree/monorepo/packages/babel-plugin-pdsl"}),"babel plugin"),"."),Object(a.b)("p",null,"This plugin speeds up ",Object(a.b)("a",r({parentName:"p"},{href:"https://github.com/ryardley/pdsl"}),Object(a.b)("inlineCode",{parentName:"a"},"pdsl"))," in babelified codebases by pre-compiling p-expressions to predicate function definitions."),Object(a.b)("pre",null,Object(a.b)("code",r({parentName:"pre"},{className:"language-bash"}),"yarn add --dev @pdsl/babel-plugin-pdsl\n")),Object(a.b)("p",null,"You should ensure it is placed before any plugins that affect module import syntax."),Object(a.b)("pre",null,Object(a.b)("code",r({parentName:"pre"},{className:"language-js"}),'{\n  plugins: ["@pdsl/babel-plugin-pdsl"];\n}\n')),Object(a.b)("h2",{id:"how-precompiling-works"},"How precompiling works"),Object(a.b)("p",null,"Conceptually this plugin parses p-expressions and replaces them with function chains:"),Object(a.b)("p",null,"Example Input:"),Object(a.b)("pre",null,Object(a.b)("code",r({parentName:"pre"},{className:"language-js"}),'import p from "pdsl";\n\nconst notNil = p`!(null|undefined)`;\nconst hasName = p`{name}`;\nconst isTrue = p`true`;\nconst hasNameWithFn = p`{name:${a => a.length > 10}}`;\n')),Object(a.b)("p",null,"Example Output"),Object(a.b)("pre",null,Object(a.b)("code",r({parentName:"pre"},{className:"language-js"}),'import { val, not, or, obj, entry, pred } from "pdsl/helpers";\n\nconst notNil = val(not(or(val(null), val(undefined))));\nconst hasName = val(obj("name"));\nconst isTrue = val(true);\nconst hasNameWithFn = val(\n  obj(\n    entry(\n      "name",\n      pred(a => a.length > 10)\n    )\n  )\n);\n')))}void 0!==i&&i&&i===Object(i)&&Object.isExtensible(i)&&!i.hasOwnProperty("__filemeta")&&Object.defineProperty(i,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/usage-with-babel.md"}}),i.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-usage-with-babel-md-5579be9c7145baac18e2.js.map