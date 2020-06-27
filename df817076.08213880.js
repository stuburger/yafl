(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{169:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return i})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return s}));var o=n(2),r=(n(0),n(178));const a={id:"yaflProvider",title:"<YaflProvider />",sidebar_label:"<YaflProvider />"},i={id:"yaflProvider",title:"<YaflProvider />",description:"The ` component is always used together with the useForm() hook (although the useForm() hook can still be used on its own if you don't want to use React context). You only need this if you want to use Yafl consumers. There is nothing crazy going on in here.  is just a React context Provider that has been wrapped to accept some extra props in addition to the usual value prop. It is acts as the communication channel for the state and behavior contained in the useForm()` hook and Yafl context consumers. Again, if you don't want or need these consumer components then you wont need to make use of this component.",source:"@site/docs/yaflProvider.md",permalink:"/yafl/docs/yaflProvider",sidebar_label:"<YaflProvider />",sidebar:"main",previous:{title:"<FormError />",permalink:"/yafl/docs/form-error"},next:{title:"useForm()",permalink:"/yafl/docs/use-form"}},c=[{value:"Props",id:"props",children:[{value:"<code>value</code>",id:"value",children:[]},{value:"<code>commonValues</code>",id:"commonvalues",children:[]},{value:"<code>branchValues</code>",id:"branchvalues",children:[]}]}],l={rightToc:c};function s({components:e,...t}){return Object(r.b)("wrapper",Object(o.a)({},l,t,{components:e,mdxType:"MDXLayout"}),Object(r.b)("p",null,"The ",Object(r.b)("inlineCode",{parentName:"p"},"<YalfProvider>")," component is always used together with the ",Object(r.b)("inlineCode",{parentName:"p"},"useForm()")," hook (although the ",Object(r.b)("inlineCode",{parentName:"p"},"useForm()")," hook can still be used on its own if you don't want to use React context). You only need this if you want to use Yafl consumers. There is nothing crazy going on in here. ",Object(r.b)("inlineCode",{parentName:"p"},"<YalfProvider>")," is just a React context ",Object(r.b)("inlineCode",{parentName:"p"},"Provider")," that has been wrapped to accept some extra props in addition to the usual ",Object(r.b)("inlineCode",{parentName:"p"},"value")," prop. It is acts as the communication channel for the state and behavior contained in the ",Object(r.b)("inlineCode",{parentName:"p"},"useForm()")," hook and Yafl context consumers. Again, if you don't want or need these consumer components then you wont need to make use of this component."),Object(r.b)("h2",{id:"props"},"Props"),Object(r.b)("h3",{id:"value"},Object(r.b)("inlineCode",{parentName:"h3"},"value")),Object(r.b)("p",null,Object(r.b)("a",Object(o.a)({parentName:"p"},{href:"./use-form#result"}),Object(r.b)("strong",{parentName:"a"},Object(r.b)("inlineCode",{parentName:"strong"},"value: YaflBaseContext<F>")))),Object(r.b)("p",null,"Similar to any React context ",Object(r.b)("inlineCode",{parentName:"p"},"<Provider>"),". Should only ever accept the result of a call to ",Object(r.b)("inlineCode",{parentName:"p"},"useForm()"),". "),Object(r.b)("pre",null,Object(r.b)("code",Object(o.a)({parentName:"pre"},{className:"language-js",metastring:'title="YaflProviderExample.js',title:'"YaflProviderExample.js'}),"import React from 'react'\nimport { useForm, YaflProvider } from 'yafl'\n\nfunction YaflProviderExample () {\n  const yafl = useForm({ /* config */ })\n\n  /**\n   * use Yafl functions as you like, but remember to always hand over this value to the\n   * value prop of `<YaflProvider>, otherwise other Yafl components may not work as expected\n   */\n\n  return (\n    <YaflProvider value={yafl}>\n      <Field name=\"fullName\" />\n    </YaflProvider>\n  )\n}\n")),Object(r.b)("blockquote",null,Object(r.b)("p",{parentName:"blockquote"},Object(r.b)("strong",{parentName:"p"},"Note:")),Object(r.b)("p",{parentName:"blockquote"},"If you forget to use a ",Object(r.b)("inlineCode",{parentName:"p"},"<YaflProvider>")," while using Yafl's consumer components you will get an error stating that a Consumer component can only appear inside a Yafl Provider.")),Object(r.b)("h3",{id:"commonvalues"},Object(r.b)("inlineCode",{parentName:"h3"},"commonValues")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"commonValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>"))),Object(r.b)("p",null,"Identical to ",Object(r.b)("inlineCode",{parentName:"p"},"commonValues")," supplied to the ",Object(r.b)("inlineCode",{parentName:"p"},"<Form>")," component. See ",Object(r.b)("a",Object(o.a)({parentName:"p"},{href:"./form#commonvalues"}),Object(r.b)("inlineCode",{parentName:"a"},"here"))," for a full explanation."),Object(r.b)("h3",{id:"branchvalues"},Object(r.b)("inlineCode",{parentName:"h3"},"branchValues")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"branchValues?: ((state: { formValue: T }) => Record<string, any>) | Record<string, any>"))),Object(r.b)("p",null,"Identical to ",Object(r.b)("inlineCode",{parentName:"p"},"branchValues")," supplied to the ",Object(r.b)("inlineCode",{parentName:"p"},"<Form>")," component. See ",Object(r.b)("a",Object(o.a)({parentName:"p"},{href:"./form#branchvalues"}),Object(r.b)("inlineCode",{parentName:"a"},"here"))," for a full explanation."))}s.isMDXComponent=!0},178:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var o=n(0),r=n.n(o);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=r.a.createContext({}),u=function(e){var t=r.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},p=function(e){var t=u(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),p=u(n),m=o,d=p["".concat(i,".").concat(m)]||p[m]||b[m]||a;return n?r.a.createElement(d,c(c({ref:t},s),{},{components:n})):r.a.createElement(d,c({ref:t},s))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var s=2;s<a;s++)i[s]=n[s];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);