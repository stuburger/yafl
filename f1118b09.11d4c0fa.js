(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{172:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return b})),a.d(t,"rightToc",(function(){return l})),a.d(t,"default",(function(){return o}));var n=a(2),r=(a(0),a(178));const i={id:"use-field",title:"useField()",sidebar_label:"useField()"},b={id:"use-field",title:"useField()",description:"The useField is the preferred way to get access to the values and metadata of a specific field. Yafl uses a field's location in the Form's component hierarchy to determine the shape of the resulting form value!",source:"@site/docs/use-field.md",permalink:"/yafl/docs/use-field",sidebar_label:"useField()",sidebar:"main",previous:{title:"useForm()",permalink:"/yafl/docs/use-form"},next:{title:"useCommonValues()",permalink:"/yafl/docs/use-common-values"}},l=[{value:"useField API",id:"usefield-api",children:[]},{value:"TypeScript",id:"typescript",children:[]},{value:"Options",id:"options",children:[{value:"<code>name</code>",id:"name",children:[]},{value:"<code>validate</code>",id:"validate",children:[]}]},{value:"Result",id:"result",children:[{value:"<code>InputProps</code>",id:"inputprops",children:[]},{value:"<code>FieldMeta</code>",id:"fieldmeta",children:[]}]}],c={rightToc:l};function o({components:e,...t}){return Object(r.b)("wrapper",Object(n.a)({},c,t,{components:e,mdxType:"MDXLayout"}),Object(r.b)("p",null," The ",Object(r.b)("inlineCode",{parentName:"p"},"useField")," is the preferred way to get access to the values and metadata of a specific field. Yafl uses a field's location in the Form's component hierarchy to determine the shape of the resulting form value!"),Object(r.b)("h2",{id:"usefield-api"},"useField API"),Object(r.b)("h2",{id:"typescript"},"TypeScript"),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"type UseField = <T, F>(name: string | number, config: UseFieldConfig<F, T>) => [InputProps<T>, FieldMeta<F, T>]")),Object(r.b)("h2",{id:"options"},"Options"),Object(r.b)("h3",{id:"name"},Object(r.b)("inlineCode",{parentName:"h3"},"name")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"name: string | number"))),Object(r.b)("p",null,"Name your field! Providing a number usually indicates that this Field appears in an array."),Object(r.b)("h3",{id:"validate"},Object(r.b)("inlineCode",{parentName:"h3"},"validate")),Object(r.b)("p",null,Object(r.b)("strong",{parentName:"p"},Object(r.b)("inlineCode",{parentName:"strong"},"validate?: ((value: T, formValue: F) => string | void) | (Array<(value: T, formValue: F) => string | void)>"))),Object(r.b)("p",null,"A validation function or array of validation functions used to validate a field. Should return a ",Object(r.b)("inlineCode",{parentName:"p"},"string")," as an error message if validation fails and ",Object(r.b)("inlineCode",{parentName:"p"},"undefined")," if validation passes."),Object(r.b)("h2",{id:"result"},"Result"),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"useField<T, F>()")," returns a tuple that contains ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"#field-inputprops"}),Object(r.b)("inlineCode",{parentName:"a"},"InputProps"))," and ",Object(r.b)("a",Object(n.a)({parentName:"p"},{href:"#fieldmeta"}),Object(r.b)("inlineCode",{parentName:"a"},"FieldMeta"))," where ",Object(r.b)("inlineCode",{parentName:"p"},"T")," and ",Object(r.b)("inlineCode",{parentName:"p"},"F")," correspond to the generic types for the Field and Form respectively."),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Prop"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"input: ")," ",Object(r.b)("a",Object(n.a)({parentName:"td"},{href:"#field-inputprops"}),Object(r.b)("inlineCode",{parentName:"a"},"InputProps<T>"))),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"An object containing the core handlers and props for an input.",Object(r.b)("br",null),Object(r.b)("em",{parentName:"td"},"Allows for easy use of the spread operator onto an ",Object(r.b)("inlineCode",{parentName:"em"},"<input />"),"."))),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"meta: ")," ",Object(r.b)("a",Object(n.a)({parentName:"td"},{href:"#fieldmeta"}),Object(r.b)("inlineCode",{parentName:"a"},"FieldMeta<F, T>"))),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"An object containing any meta state related to the current field as well as some handy helper functions.")))),Object(r.b)("h3",{id:"inputprops"},Object(r.b)("inlineCode",{parentName:"h3"},"InputProps")),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Prop"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"name: string")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Forwarded from the ",Object(r.b)("inlineCode",{parentName:"td"},"name")," prop of this Field.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"value: T")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The current value of this Field.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"onBlur: (e: React.FocusEvent<any>) => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The onBlur handler for your input (DOM only).",Object(r.b)("br",null),Object(r.b)("em",{parentName:"td"},"Useful if you need to keep track of which Fields have been visited."))),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"onFocus: (e: React.FocusEvent<any>) => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The onFocus handler for your input (DOM only).",Object(r.b)("br",null),Object(r.b)("em",{parentName:"td"},"Useful if you need to keep track of which field is currently active."))),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"onChange: (e: React.ChangeEvent<any>) => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The onChange handler for your input (DOM only).",Object(r.b)("br",null),"Sets the value of this Field.")))),Object(r.b)("h3",{id:"fieldmeta"},Object(r.b)("inlineCode",{parentName:"h3"},"FieldMeta")),Object(r.b)("p",null,"TypeScript: ",Object(r.b)("inlineCode",{parentName:"p"},"FieldMeta<F, T>")," where ",Object(r.b)("inlineCode",{parentName:"p"},"F")," and ",Object(r.b)("inlineCode",{parentName:"p"},"T")," correspond to the generic types for the current Field and Form respectively."),Object(r.b)("table",null,Object(r.b)("thead",{parentName:"table"},Object(r.b)("tr",{parentName:"thead"},Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Prop"),Object(r.b)("th",Object(n.a)({parentName:"tr"},{align:null}),"Description"))),Object(r.b)("tbody",{parentName:"table"},Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"path: string")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The path for this field.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"visited: boolean")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Indicates whether this Field has been visited.",Object(r.b)("br",null),Object(r.b)("em",{parentName:"td"},"Automatically set to true on when input.onBlur() is called."))),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"touched: boolean")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Indicates whether this Field has been touched.",Object(r.b)("br",null),Object(r.b)("em",{parentName:"td"},"Automatically set to true the first time a Field's value is changed."))),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"isDirty: boolean")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Indicates whether the ",Object(r.b)("inlineCode",{parentName:"td"},"initialValue")," for this Field is different from the current ",Object(r.b)("inlineCode",{parentName:"td"},"formValue"),".")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"isActive: boolean")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Indicates whether this Field is currently in focus.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"isValid: boolean")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Indicates whether this Field is valid based on whether any errors have been returned from this fields ",Object(r.b)("inlineCode",{parentName:"td"},"validate")," prop.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"errors: string[]")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"An array containing any errors for this Field returned from the ",Object(r.b)("inlineCode",{parentName:"td"},"validate")," prop")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"initialValue: T")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The value this Field was initialized with.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"setValue: (value: T, touch?: boolean) => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Sets the value for this Field.",Object(r.b)("br",null),"Optionally specify if this Field should be touched when this function is called.",Object(r.b)("br",null),Object(r.b)("em",{parentName:"td"},"If the ",Object(r.b)("inlineCode",{parentName:"em"},"touch")," parameter is not provided it defaults to ",Object(r.b)("inlineCode",{parentName:"em"},"true"),"."))),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"formValue: F")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The current value of the Form")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"submitCount: number")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"The number of times the Form has been submitted.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"resetForm: () => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Clears all Form state. ",Object(r.b)("inlineCode",{parentName:"td"},"formValue")," is reset to its initialValue.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"submit: () => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Calls the onSubmit function supplied to the Form component")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"forgetState: () => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Resets ",Object(r.b)("inlineCode",{parentName:"td"},"submitCount"),", ",Object(r.b)("inlineCode",{parentName:"td"},"touched")," and ",Object(r.b)("inlineCode",{parentName:"td"},"visited")," to their initial values. The ",Object(r.b)("inlineCode",{parentName:"td"},"formValue")," is not reset.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"setFormValue: (set: SetFormValueFunc<F>) => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Sets the ",Object(r.b)("inlineCode",{parentName:"td"},"formValue")," imperatively.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"setFormVisited: (set: SetFormVisitedFunc<F>) => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Sets the Form's ",Object(r.b)("inlineCode",{parentName:"td"},"visited")," state imperatively.",Object(r.b)("br",null),"Accepts a callback with the Form's previous value.")),Object(r.b)("tr",{parentName:"tbody"},Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),Object(r.b)("inlineCode",{parentName:"td"},"setFormTouched: (set: SetFormTouchedFunc<F>) => void")),Object(r.b)("td",Object(n.a)({parentName:"tr"},{align:null}),"Sets the Form's ",Object(r.b)("inlineCode",{parentName:"td"},"touched")," state imperatively.",Object(r.b)("br",null),"Accepts a callback with the Form's previous visited state.")))))}o.isMDXComponent=!0},178:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return O}));var n=a(0),r=a.n(n);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function b(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?b(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):b(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=r.a.createContext({}),d=function(e){var t=r.a.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=d(e.components);return r.a.createElement(o.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,b=e.parentName,o=c(e,["components","mdxType","originalType","parentName"]),p=d(a),m=n,O=p["".concat(b,".").concat(m)]||p[m]||u[m]||i;return a?r.a.createElement(O,l(l({ref:t},o),{},{components:a})):r.a.createElement(O,l({ref:t},o))}));function O(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,b=new Array(i);b[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:n,b[1]=l;for(var o=2;o<i;o++)b[o]=a[o];return r.a.createElement.apply(null,b)}return r.a.createElement.apply(null,a)}m.displayName="MDXCreateElement"}}]);