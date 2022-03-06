# Curvly

It allows you to draw curves between draggable elements (and to update the curves after dropping an element somewhere else on the screen). Read the documentation for React here.

This is designed to become an [npm package](https://www.npmjs.com/package/react-curvly). Origin: [GitHub](https://github.com/CodoPixel/Curvly/tree/main/src/react-curvly).

## How to use?

You can see an example in the GitHub repository in `src/react-curvly/src/App.js`, and the source code in `src/react-curvly/src/lib/`.

Basically, you need to create a zone in which the curves will be drawn by the algorithm:

```jsx
import "./App.css";
import { CurvlyZone, CurvlyElement } from "react-curvly";

export default function App() {
  return (
    <CurvlyZone connections={[{ boxA: "box1", boxB: "box2" }]}>
      <CurvlyElement className="box" id="box1">
        <h1>Box 1</h1>
      </CurvlyElement>
      <CurvlyElement className="box" id="box2">
        <h1>Box 2</h1>
      </CurvlyElement>
    </CurvlyZone>
  );
}
```

The `CurvlyZone` is an `<svg>` that will draw the curves. Your elements must be inside so that the curves can be drawn behind your elements. If an element extends beyond the area, the curve will suddenly be cut off.

Define the connections between the elements like this:

```javascript
// an array of connections,
// each connection is an object that represents a curve between A and B
[{boxA: "id of an element", boxB: "id of another element"}]
```

Each element must have specific CSS properties and an absolute position. That's why you must use `CurvlyElement`s as direct children.

Here the default CSS properties:

```css
/* <CurvlyElement> */
.curvlyElement {
  position: absolute;
  top: 0;
  left: 0;
}

/*
the default styles for a curve (<path> inside the <svg> displayed by <CurvlyZone>)
You can customize it via the prop `curveClassName`.
*/
.defaultCurve {
  fill: none;
  stroke: #444;
  stroke-width: 2;
}
```

Here the props for `CurvlyZone`:

|name|type|default value|description|
|----|----|-------------|-----------|
|`width`|`number`|750|The width of the canvas.|
|`height`|`number`|500|The height of the canvas.|
|`padding`|`number`|0|The positional offset between the curve and the centre of the element. |
|`bezierWeight`|`number`|0.675|The undulating nature of a curve between 0 and 1 (0 is a straight line).|
|`draggable`|`boolean`|true|The default value given to the elements. It defines whether the elements can be dragged or not. If a `CurvlyElement` already has a `draggable` prop, its value will not be overwritten.|
|`connections`|`{boxA:string, boxB:string}[]`|Empty array|The connections between the elements. Each object defines a new curve, from A to B. The string is the ID of the elements.|
|`curveClassName`|`string`|None|A custom className for the curves|
|`zoneClassName`|`string`|None|A custom className for the `<svg>`|

Here the props for `CurvlyElement`:
|name|type|default value|description|
|----|----|-------------|-----------|
|`id`|`string`|None|The ID an element must have in order to be recognized and linked to a curve.|
|`className`|`string`|Empty string|A class name to be added to the created element.|
|`draggable`|`boolean`|true|It defines whether the element can be dragged or not. If the `CurvlyZone` already has a `draggable` prop, its value will not be overwritten. It allows you to have both draggable elements and undraggable elements at the same time in the same zone.|
|`onDragStart`|`(e:DragEvent) => void`|None|A function to call everytime the element is starting to be dragged.|
|`onDragEnd`|`(e:DragEvent) => void`|None|A function to call everytime the element stopped being dragged.|
|`onDrag`|`(e:DragEvent) => void`|None|A function to call everytime the element is being dragged.|

No prop is necessary, but `connections` to `CurvlyZone` and `id` to `CurvlyElement` are the main props. All the others allow you to customize everything.

## A dynamic example

The recommended way to make Curvly dynamic is to use the hook `useCurvly`:

```jsx
const [
  curvlyConfig,
  { createNewBox, removeOneBox, linkBoxes, removeLinksFrom, removeLinkBetween },
  setCurvlyConfig,
] = useCurvly(/* [...initial connections] */, /* [...initial elements] */);
```

where `curvlyConfig` is defined like this:

```typescript
{connections: {boxA:string, boxB:string}[], boxes: CurvlyElement[]}
```

An example:

```jsx
// to customize the example
import "./App.css";

// For the example, I'll use:
import { useCallback, useState } from "react";

// both elements are necessary
import { CurvlyZone, CurvlyElement, useCurvly } from "react-curvly";

/**
 * An example for React Curvly.
 */
export default function App() {
  const [draggable, setDraggable] = useState(true);
  const [
    curvlyConfig,
    { createNewBox, removeOneBox, linkBoxes, removeLinksFrom, removeLinkBetween },
  ] = useCurvly(
    [{ boxA: "box1", boxB: "box2" }],
    [
      <CurvlyElement className="box" key="box1" id="box1">
        <h1>Box 1</h1>
      </CurvlyElement>,
      <CurvlyElement className="box" key="box2" id="box2">
        <h1>Box 2</h1>
      </CurvlyElement>,
    ]
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((c) => !c);
  }, []);

  return (
    <div>
      <CurvlyZone
        draggable={draggable}
        pathClassName="path"
        zoneClassName="zone"
        connections={curvlyConfig.connections}
      >
        {curvlyConfig.boxes}
      </CurvlyZone>
      <button
        type="button"
        onClick={() =>
          createNewBox(
            <CurvlyElement
              className="box"
              key={"box" + (curvlyConfig.boxes.length + 1)}
              id={"box" + (curvlyConfig.boxes.length + 1)}
            >
              <h1>{curvlyConfig.boxes.length + 1}</h1>
            </CurvlyElement>,
            "box2" // the new box is linked to box2
          )
        }
      >
        Add a box
      </button>
      <button type="button" onClick={toggleDraggable}>
        {draggable ? "lock boxes" : "unlock boxes"}
      </button>
    </div>
  );
}
```

## License

MIT
