(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{"8AQd":function(e,n,t){"use strict";t.r(n),t.d(n,"_frontmatter",(function(){return l})),t.d(n,"default",(function(){return s}));t("4cIV"),t("NZyX"),t("c0Gx"),t("QNbk"),t("+ytS"),t("WY76"),t("r0ML");var a=t("V0Ug"),r=t("sN0p");t("xH0s");function i(){return(i=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e}).apply(this,arguments)}var l={};void 0!==l&&l&&l===Object(l)&&Object.isExtensible(l)&&!l.hasOwnProperty("__filemeta")&&Object.defineProperty(l,"__filemeta",{configurable:!0,value:{name:"_frontmatter",filename:"src/welcome-to-pdsl.md"}});var c={_frontmatter:l},o=r.a;function s(e){var n=e.components,t=function(e,n){if(null==e)return{};var t,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)t=i[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,["components"]);return Object(a.b)(o,i({},c,t,{components:n,mdxType:"MDXLayout"}),Object(a.b)("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",height:"75vh"}},Object(a.b)("img",{alt:"Welcome to PDSL",src:"public/pdsl-logo.png",width:"200"}),Object(a.b)("h4",null,"The expressive declarative toolkit for composing predicates in TypeScript or JavaScript")),Object(a.b)("hr",null),Object(a.b)("br",null),Object(a.b)("br",null),Object(a.b)("h1",null,"Welcome to PDSL"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),'import p from "pdsl";\n\nconst isSoftwareCreator = p`{\n  name: string,\n  age: > 16,\n  occupation: "Engineer" | "Designer" | "Project Manager"\n}`;\n\nisSoftwareCreator(someone); // true | false\n')),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Predicate functions are just easier with PDSL")),Object(a.b)("p",null,"Creating predicate functions in JavaScript is often verbose, especially for checking the format of complex object types. We need predicate functions all the time when filtering an array, validating input, determining the type of an unknown object or creating guard conditions in TypeScript."),Object(a.b)("p",null,"PDSL provides the developer a simple but powerful shorthand based on a combination of template strings and helper functions for defining predicate functions that makes it easy to understand intent. With ",Object(a.b)("inlineCode",{parentName:"p"},"pdsl")," we can easily visualize the expected input's structure and intent using it's intuitive predicate composition language."),Object(a.b)("p",null,"PDSL is:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Intuitive"),Object(a.b)("li",{parentName:"ul"},"Expressive"),Object(a.b)("li",{parentName:"ul"},"Lightweight (under 6k)!"),Object(a.b)("li",{parentName:"ul"},"No dependencies"),Object(a.b)("li",{parentName:"ul"},"Small bundle size"),Object(a.b)("li",{parentName:"ul"},"Fast")),Object(a.b)("h2",{id:"installation"},"Installation"),Object(a.b)("p",null,"Install with npm or yarn"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-bash"}),"yarn add pdsl\n")),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-bash"}),"npm install pdsl\n")),Object(a.b)("h2",{id:"new-in-version-5"},"New in Version 5"),Object(a.b)("h3",{id:"exact-matching-on-objects-is-now-off-by-default"},"Exact matching on objects is now off by default"),Object(a.b)("p",null,"New in version 5.2+ objects no longer have exact matching turned on by default. If you wish to continue using exact matching you can use the ",Object(a.b)("a",i({parentName:"p"},{href:"#objects-with-exact-matching-syntax"}),"exact matching syntax"),":"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),'p`{ name: "foo" }`({ name: "foo", age: 20 }); // true\n')),Object(a.b)("p",null,"Exact object matching mode can be turned on by using objects with pipes ",Object(a.b)("inlineCode",{parentName:"p"},"|"),":"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),'p`{| name: "foo" |}`({ name: "foo", age: 20 }); // false\n')),Object(a.b)("p",null,"Once you turn exact matching on in an object tree you can only turn it off by using the rest operator:"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),'p`{| \n  name: "foo",\n  exact: {\n    hello:"hello"\n  }\n  loose: {\n    hello: "hello",\n    ...\n  },\n|}`;\n')),Object(a.b)("h3",{id:"new-validation-syntax"},"New validation syntax"),Object(a.b)("p",null,"We now have a new validation syntax!"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),'import { schema as p } from "pdsl";\n\nconst schema = p`{\n  name: \n    string       <- "Name must be a string" \n    & string[>7] <- "Name must be longer than 7 characters",\n  age: \n    (number & > 18) <- "Age must be numeric and over 18"\n}`;\n\nschema.validate({ name: "Rick" }).catch(err => {\n  console.log(err.message); // "Name must be longer than 7 characters"\n});\n')),Object(a.b)("h3",{id:"new-array-includes-syntax"},"New array includes syntax"),Object(a.b)("p",null,"Also new we have an ",Object(a.b)("a",i({parentName:"p"},{href:"#array-includes"}),"array includes")," function:"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{}),"[? <predicate> ]\n")),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-js"}),"p`[? >50 ]`([1, 2, 100, 12]); // true because 100 is greater than 50\n")),Object(a.b)("h3",{id:"formik-compatability"},"Formik compatability"),Object(a.b)("p",null,"We now have formik compatability!"),Object(a.b)("pre",null,Object(a.b)("code",i({parentName:"pre"},{className:"language-ts"}),'import {schema as p} from \'pdsl\';\n\nexport default () => (\n  <Formik\n    initialValues={{\n      email: "",\n      firstName: "",\n      lastName: ""\n    }}\n    validationSchema={p`{\n      email:\n        _         <- "Required"\n        & Email   <- "Invalid email address",\n      firstName:\n        _             <- "Required"\n        & string[>2]  <- "Must be longer than 2 characters"\n        & string[<20] <- "Nice try nobody has a first name that long",\n      lastName:\n        _             <- "Required"\n        & string[>2]  <- "Must be longer than 2 characters"\n        & string[<20] <- "Nice try nobody has a last name that long"\n    }`}\n    onSubmit={values => {\n      // submit values\n    }}\n    render={({ errors, touched }) => (\n      // render form\n    )}\n  />\n)\n')),Object(a.b)("h2",{id:"roadmap"},"Roadmap"),Object(a.b)("p",null,"Help organise our priorities by ",Object(a.b)("a",i({parentName:"p"},{href:"https://github.com/ryardley/pdsl/issues/new"}),"telling us what is the most important to you")),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Basic Language Design (✓)"),Object(a.b)("li",{parentName:"ul"},"PDSL Compiler (✓)"),Object(a.b)("li",{parentName:"ul"},"Comprehensive Test cases (✓)"),Object(a.b)("li",{parentName:"ul"},"Babel Plugin to remove compiler perf overhead (✓)"),Object(a.b)("li",{parentName:"ul"},"Validation errors (✓)"),Object(a.b)("li",{parentName:"ul"},"Exact matching syntax (✓)"),Object(a.b)("li",{parentName:"ul"},"Syntax Highlighting / VSCode Autocomplete / Prettier formatting")))}void 0!==s&&s&&s===Object(s)&&Object.isExtensible(s)&&!s.hasOwnProperty("__filemeta")&&Object.defineProperty(s,"__filemeta",{configurable:!0,value:{name:"MDXContent",filename:"src/welcome-to-pdsl.md"}}),s.isMDXComponent=!0}}]);
//# sourceMappingURL=component---src-welcome-to-pdsl-md-fbc064b02c98957f93da.js.map