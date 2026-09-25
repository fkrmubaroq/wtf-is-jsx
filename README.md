# WTF is JSX? 🤔

A minimal, zero-dependency educational project to demystify how **JSX** works under the hood by building a custom JSX factory function (`h`) and a lightweight Virtual DOM renderer from scratch.

---

## What We Learn Here

1. **JSX is NOT HTML**: It is purely syntactic sugar for JavaScript function calls.
2. **The Role of the Transpiler (Babel)**: How Babel turns `<div id="foo">Hello!</div>` into a function invocation like `h('div', { id: 'foo' }, 'Hello!')`.
3. **JSX Pragmas**: How comments like `/** @jsx h */` tell compilers which function to use instead of the default `React.createElement`.
4. **The Virtual Node (VNode)**: How a simple function `h()` constructs lightweight JavaScript objects representing DOM nodes.
5. **Real DOM Rendering**: How to recursively convert a Virtual DOM tree into real HTML elements in the browser.
6. **Props & Style Handling**: Why `style={{ color: 'red' }}` is an object expression and how it gets applied to real DOM properties.

---

## 🔍 Step-by-Step Breakdown

### 1. Babel Pragmas
Browsers do not natively understand JSX. We use Babel with `@babel/plugin-transform-react-jsx` to transpile JSX into standard JavaScript.

At the top of the file:
```javascript
/** @jsxRuntime classic */
/** @jsx h */
```
* **`@jsxRuntime classic`**: Tells Babel to transpile JSX into direct function calls rather than using the automatic runtime (`_jsx` imports).
* **`@jsx h`**: Tells Babel: *"Whenever you encounter a JSX tag, transform it into a call to `h()` instead of `React.createElement()`"*.

---

### 2. The JSX Factory Function (`h`)
Often called `h` (short for *HyperScript*), this function receives the tag name, attributes, and children, and returns a plain Virtual Node (`vnode`) object:

```javascript
function h(nodeName, attributes, ...args) {
  let children = args.length ? [].concat(...args) : null;

  return {
    nodeName,
    attributes,
    children,
  };
}
```

When Babel compiles this JSX:
```jsx
let vdom = <div id="foo">Hello!</div>;
```
It becomes:
```javascript
let vdom = h("div", { id: "foo" }, "Hello!");
```
And evaluating `h(...)` produces this plain JavaScript object:
```json
{
  "nodeName": "div",
  "attributes": { "id": "foo" },
  "children": ["Hello!"]
}
```

---

### 3. Rendering VNodes to Real DOM (`render`)
The `render()` function recursively transforms our Virtual DOM objects into actual browser DOM nodes:

```javascript
function render(vnode) {
  // 1. Text node handling
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  // 2. Element creation
  let n = document.createElement(vnode.nodeName);

  // 3. Attributes & Style handling
  let a = vnode.attributes || {};
  Object.keys(a).forEach((attribute) => {
    if (attribute === "style" && typeof a[attribute] === "object") {
      Object.keys(a[attribute]).forEach((key) => {
        n.style[key] = a[attribute][key];
      });
      return;
    }
    n.setAttribute(attribute, a[attribute]);
  });

  // 4. Recursive children rendering
  (vnode.children || []).forEach((c) => {
    n.appendChild(render(c));
  });

  return n;
}
```

---

### 4. Dynamic Elements & Lists
Because JSX compiles to pure JavaScript expressions, we can compose components and lists seamlessly using native JavaScript methods like `.map()`:

```jsx
const data = [
  { label: "Tomato", color: "red" },
  { label: "Grape", color: "purple" },
  { label: "Mango", color: "yellow" },
];

const getListData = (data) => {
  return data.map((item) => (
    <li style={{ color: item.color }}>{item.label}</li>
  ));
};

let vdom = (
  <div id="foo">
    Hello!
    <ol>{getListData(data)}</ol>
  </div>
);

let dom = render(vdom);
document.body.appendChild(dom);
```
