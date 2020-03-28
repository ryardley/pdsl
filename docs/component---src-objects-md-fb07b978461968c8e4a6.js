(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{c7ZC:function(e,n,a){"use strict";a.r(n),a.d(n,"_frontmatter",(function(){return c})),a.d(n,"default",(function(){return b}));a("4cIV"),a("NZyX"),a("c0Gx"),a("QNbk"),a("+ytS"),a("WY76"),a("r0ML");var t=a("V0Ug"),l=a("sN0p");a("xH0s");function r(){return(r=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e}).apply(this,arguments)}var c={};void 0!==c&&c&&c===Object(c)&&Object.isExtensible(c)&&!c.hasOwnProperty("__filemeta")&&Object.defineProperty(c,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/objects.md"}});var o={_frontmatter:c},s=l.a;function b(e){var n=e.components,a=function(e,n){if(null==e)return{};var a,t,l={},r=Object.keys(e);for(t=0;t<r.length;t++)a=r[t],n.indexOf(a)>=0||(l[a]=e[a]);return l}(e,["components"]);return Object(t.b)(s,r({},o,a,{components:n,mdxType:"MDXLayout"}),Object(t.b)("h1",{id:"objects"},"Objects"),Object(t.b)("h2",{id:"object-properties"},"Object properties"),Object(t.b)("p",null,"You can test for an object's properties using the object syntax:"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),"const validate = p`{ name: string }`; // value && typeof value.name === 'string';\n\nvalidate({ name: \"Hello\" }); // true\nvalidate({ name: 20 }); // false\n")),Object(t.b)("p",null,"As a shorthand you can test for an object property's existence by simply providing an object with a name property."),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'const validate = p`{ name }`;\nvalidate({ name: "Rudi" }); // true\nvalidate({}); // false\n')),Object(t.b)("p",null,"This is the same as using ",Object(t.b)("inlineCode",{parentName:"p"},"!(null | undefined)")," which is also the same as using the shorthand: ",Object(t.b)("inlineCode",{parentName:"p"},"_"),"."),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),"// These are all equivalent\np`{ name }`;\np`{ name: _ }`;\np`{ name: !(null|undefined) }`;\n")),Object(t.b)("p",null,"You can use literal strings as property checks."),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'const validate = p`{ name: "Rudi" }`;\nvalidate({ name: "Rudi" }); // true\nvalidate({ name: "Fred" }); // false\n')),Object(t.b)("p",null,"Or even provide a list of possible strings using the ",Object(t.b)("inlineCode",{parentName:"p"},"|")," operator"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'const validate = p`{ name: "Rudi" | "Fred" }`;\nvalidate({ name: "Rudi" }); // true\nvalidate({ name: "Fred" }); // true\nvalidate({ name: "Mary" }); // true\n')),Object(t.b)("p",null,"The property can also contain nested objects."),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'const validate = p`{ \n  name, \n  payload: {\n    listening: true,\n    num: > 4\n  } \n}`;\n\nvalidate({\n  name: "Hello",\n  payload: {\n    listening: true,\n    num: 5\n  }\n}); // true\n')),Object(t.b)("h2",{id:"exact-matching-syntax"},"Exact matching syntax"),Object(t.b)("p",null,"PDSL is loose matches objects by default which means the following:"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'p`{ name }`({ name: "A name", age: 234 }); // true\n')),Object(t.b)("p",null,"Exact object matching mode can be turned on by using objects with pipes ",Object(t.b)("inlineCode",{parentName:"p"},"|"),":"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'p`{| name |}`({ name: "A name", age: 234 }); // false\np`{| name |}`({ name: "A name" }); // true\n')),Object(t.b)("p",null,"All nested normal objects will become exact matching too within the exact matching tokens:"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'p`{|\n    name,\n    age,\n    sub: {\n      num: 100\n    }\n  |}`({\n  name: "Fred",\n  age: 12,\n  sub: {\n    num: 100,\n    foo: "foo"\n  }\n}); // false\n')),Object(t.b)("h2",{id:"rest-operator"},"Rest operator"),Object(t.b)("p",null,"Once you turn exact matching on in an object tree you can only turn it off by using the rest operator:"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'p`{| \n  name: "foo",\n  exact: {\n    hello:"hello"\n  }\n  loose: {\n    hello: "hello",\n    ...\n  },\n|}`;\n')))}void 0!==b&&b&&b===Object(b)&&Object.isExtensible(b)&&!b.hasOwnProperty("__filemeta")&&Object.defineProperty(b,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/objects.md"}}),b.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-objects-md-fb07b978461968c8e4a6.js.map