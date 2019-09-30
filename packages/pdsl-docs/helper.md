## Functions

<dl>
<dt><a href="#btw">btw(a, b)</a> ⇒ <code>function</code></dt>
<dd><h3>Between bounds</h3>
Return a function that checks to see if it's input is between two numbers not including the numbers.</dd>
<dt><a href="#btwe">btwe(a, b)</a> ⇒ <code>function</code></dt>
<dd><h3>Between bounds or equal to</h3>
Return a function that checks to see if it's input is between two numbers including the numbers.</dd>
<dt><a href="#lt">lt(a)</a> ⇒ <code>function</code></dt>
<dd><h3>Less than</h3>
Return a function that checks to see if it's input is less than the given number.</dd>
<dt><a href="#lte">lte(a)</a> ⇒ <code>function</code></dt>
<dd><h3>Less than or equal to</h3>
Return a function that checks to see if it's input is less than or equal to the given number.</dd>
<dt><a href="#gt">gt(a)</a> ⇒ <code>function</code></dt>
<dd><h3>Greater than</h3>
Return a function that checks to see if it's input is greater than the given number.</dd>
<dt><a href="#gte">gte(a)</a> ⇒ <code>function</code></dt>
<dd><h3>Greater than or equal to</h3>
Return a function that checks to see if it's input is greater than or equal to the given number.</dd>
<dt><a href="#holds">holds(...args)</a> ⇒ <code>function</code></dt>
<dd><h3>Array holds</h3>
Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
Eg,
<pre><code>
holds(a => a > 3, 2)([1,2,3]); // true
holds(1, 2)([1,3]); // false
</code></pre></dd>
<dt><a href="#or">or(left, right)</a> ⇒ <code>function</code></dt>
<dd><h3>Logical OR</h3>
Combine predicates to form a new predicate that ORs the result of the input predicates.</dd>
<dt><a href="#and">and(left, right)</a> ⇒ <code>function</code></dt>
<dd><h3>Logical AND</h3>
Combine predicates to form a new predicate that ANDs the result of the input predicates.</dd>
<dt><a href="#not">not(input)</a> ⇒ <code>function</code></dt>
<dd><h3>Logical NOT</h3>
Takes an input predicate to form a new predicate that NOTs the result of the input predicate.</dd>
<dt><a href="#val">val(value)</a> ⇒ <code>function</code></dt>
<dd><h3>Is strict equal to value</h3>
Takes an input value to form a predicate that checks if the input strictly equals by reference the value.</dd>
<dt><a href="#deep">deep(value)</a> ⇒ <code>function</code></dt>
<dd><h3>Is deep equal to value</h3>
Takes an input value to form a predicate that checks if the input deeply equals the value.</dd>
<dt><a href="#regx">regx(rx)</a> ⇒ <code>function</code></dt>
<dd><h3>Regular Expression predicate</h3>
Forms a predicate from a given regular expression</dd>
<dt><a href="#prim">prim(primative)</a> ⇒ <code>function</code></dt>
<dd><h3>Primative predicate</h3>
Forms a predicate from a given JavaSCript primative object to act as a typeof check for the input value.

<p>Eg. <pre><code>
prim(Function)(() => {}); // true
prim(Number)(6); // true
</code></pre></p>
</dd>
<dt><a href="#pred">pred(input)</a> ⇒ <code>function</code></dt>
<dd><h3>Predicate</h3>
Creates an appropriate predicate based on an input value. This will choose a predicate transformer dynamically based on the type of input.</dd>
</dl>

<a name="btw"></a>

## btw(a, b) ⇒ <code>function</code>
<h3>Between bounds</h3>
Return a function that checks to see if it's input is between two numbers not including the numbers.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form number => boolean  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The lower number |
| b | <code>number</code> | The higher number |

<a name="btwe"></a>

## btwe(a, b) ⇒ <code>function</code>
<h3>Between bounds or equal to</h3>
Return a function that checks to see if it's input is between two numbers including the numbers.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form number => boolean  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The lower number |
| b | <code>number</code> | The higher number |

<a name="lt"></a>

## lt(a) ⇒ <code>function</code>
<h3>Less than</h3>
Return a function that checks to see if it's input is less than the given number.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form number => boolean  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The number to check against. |

<a name="lte"></a>

## lte(a) ⇒ <code>function</code>
<h3>Less than or equal to</h3>
Return a function that checks to see if it's input is less than or equal to the given number.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form number => boolean  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The number to check against. |

<a name="gt"></a>

## gt(a) ⇒ <code>function</code>
<h3>Greater than</h3>
Return a function that checks to see if it's input is greater than the given number.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form number => boolean  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The number to check against. |

<a name="gte"></a>

## gte(a) ⇒ <code>function</code>
<h3>Greater than or equal to</h3>
Return a function that checks to see if it's input is greater than or equal to the given number.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form number => boolean  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>number</code> | The number to check against. |

<a name="holds"></a>

## holds(...args) ⇒ <code>function</code>
<h3>Array holds</h3>
Return a function that checks to see if an array contains either any of the values listed or if any of the predicate functions provided return true when run over all items in the array.
Eg,
<pre><code>
holds(a => a > 3, 2)([1,2,3]); // true
holds(1, 2)([1,3]); // false
</code></pre>

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{array => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| ...args | <code>function</code> \| <code>\*</code> | Either values or predicate functions used to test the contents of the array. |

<a name="or"></a>

## or(left, right) ⇒ <code>function</code>
<h3>Logical OR</h3>
Combine predicates to form a new predicate that ORs the result of the input predicates.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| left | <code>function</code> | The first predicate |
| right | <code>function</code> | The second predicate |

<a name="and"></a>

## and(left, right) ⇒ <code>function</code>
<h3>Logical AND</h3>
Combine predicates to form a new predicate that ANDs the result of the input predicates.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| left | <code>function</code> | The first predicate |
| right | <code>function</code> | The second predicate |

<a name="not"></a>

## not(input) ⇒ <code>function</code>
<h3>Logical NOT</h3>
Takes an input predicate to form a new predicate that NOTs the result of the input predicate.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>function</code> | The input predicate |

<a name="val"></a>

## val(value) ⇒ <code>function</code>
<h3>Is strict equal to value</h3>
Takes an input value to form a predicate that checks if the input strictly equals by reference the value.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>function</code> \| <code>\*</code> | The input value if already a fuction it will be returned |

<a name="deep"></a>

## deep(value) ⇒ <code>function</code>
<h3>Is deep equal to value</h3>
Takes an input value to form a predicate that checks if the input deeply equals the value.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>function</code> | The input value |

<a name="regx"></a>

## regx(rx) ⇒ <code>function</code>
<h3>Regular Expression predicate</h3>
Forms a predicate from a given regular expression

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| rx | <code>RegExp</code> | The input value |

<a name="prim"></a>

## prim(primative) ⇒ <code>function</code>
<h3>Primative predicate</h3>
Forms a predicate from a given JavaSCript primative object to act as a typeof check for the input value.

Eg. <pre><code>
prim(Function)(() => {}); // true
prim(Number)(6); // true
</code></pre>

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| primative | <code>object</code> | The input primative one of Array, Boolean, Number, Symbol, BigInt, String, Function, Object |

<a name="pred"></a>

## pred(input) ⇒ <code>function</code>
<h3>Predicate</h3>
Creates an appropriate predicate based on an input value. This will choose a predicate transformer dynamically based on the type of input.

**Kind**: global function  
**Returns**: <code>function</code> - A function of the form <code>{any => boolean}</code>  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>\*</code> | Anything parsable |

