// `jsxRuntime classic` means we use the classic JSX transform, transpiling JSX into function calls like React.createElement.
// See other runtime modes: https://babeljs.io/docs/babel-plugin-transform-react-jsx
/** @jsxRuntime classic */

// Instructs the compiler to transform JSX elements into our custom `h()` function instead of React.createElement (React's default).
// This allows us to define our own JSX factory function.
/** @jsx h */

function h(nodeName, attributes, ...args) {
  let children = args.length
    ? [].concat(...args)
    : null;

  return {
    nodeName,
    attributes,
    children,
  };
}

function render(vnode) {
  if (typeof vnode === "string") {
    return document.createTextNode(vnode);
  }

  let n = document.createElement(vnode.nodeName);

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

  (vnode.children || []).forEach((c) => {
    n.appendChild(render(c));
  });

  return n;
}
const data = [
  { label: "Tomato", color: "red" },
  { label: "Grape", color: "purple" },
  { label: "Manggo", color: "yellow" },
  { label: "Banana", color: "yellow" },
  { label: "Pineaple", color: "yellow" },
];

const getListData = (data) => {
  return data.map(item => {
    return <li style={{ color: item.color }}>{item.label}</li>
  })
}

let vdom = <div id="foo">Hello!
  <ol>
    {getListData(data)}
  </ol>
</div>;

let dom = render(vdom);

document.body.appendChild(dom);