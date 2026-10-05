/** @jsxRuntime classic */
/** @jsx Didact.createElement */
const Didact = {
    createElement,
    render
}

function createDom(fiber) {
    const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);
    Object.keys(element.props)
        .forEach(key => {
            if (key === "children") return;
            dom[key] = element.props[key]
        })
    return dom;
}

function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}


function workLoop(deadline) {
    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

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
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }

    if (fiber.child) {
        return fiber.child
    }
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}


function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === "object" ? child : createTextElement(child))
        }
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}

const element = <div style="background: salmon">
    <h1>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
    <ul>
        <li>item 1</li>
        <li>item 2</li>
        <ul>
            <li>item 2a</li>
            <li>item 2b</li>
            <ul>
                <li>item 2b i</li>
                <li>item 2b ii</li>
                <ul>
                    <li>item 2b iii</li>
                    <li>item 2b iv</li>
                </ul>
                <li><input type="text" name="username" /></li>
                <li><input type="password" name="password" /></li>
                <li><input type="submit" name="submit" /></li>

            </ul>
        </ul>
    </ul>
</div>

const container = document.getElementById("root");
Didact.render(element, container);