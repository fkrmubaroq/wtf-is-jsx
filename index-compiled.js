/** @jsxRuntime classic */
/** @jsx Didact.createElement */
const Didact = {
  createElement,
  render
};
function createDom(fiber) {
  const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);
  Object.keys(element.props).forEach(key => {
    if (key === "children") return;
    dom[key] = element.props[key];
  });
  return dom;
}
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  };
}
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);
function performUnitOfWork(fiber) {
  // TODO
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = element[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === "object" ? child : createTextElement(child))
    }
  };
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}
const element = Didact.createElement("div", {
  style: "background: salmon"
}, Didact.createElement("h1", null, "Hello World"), Didact.createElement("h2", {
  style: "text-align:right"
}, "from Didact"), Didact.createElement("ul", null, Didact.createElement("li", null, "item 1"), Didact.createElement("li", null, "item 2"), Didact.createElement("ul", null, Didact.createElement("li", null, "item 2a"), Didact.createElement("li", null, "item 2b"), Didact.createElement("ul", null, Didact.createElement("li", null, "item 2b i"), Didact.createElement("li", null, "item 2b ii"), Didact.createElement("ul", null, Didact.createElement("li", null, "item 2b iii"), Didact.createElement("li", null, "item 2b iv")), Didact.createElement("li", null, Didact.createElement("input", {
  type: "text",
  name: "username"
})), Didact.createElement("li", null, Didact.createElement("input", {
  type: "password",
  name: "password"
})), Didact.createElement("li", null, Didact.createElement("input", {
  type: "submit",
  name: "submit"
}))))));
const container = document.getElementById("root");
Didact.render(element, container);
