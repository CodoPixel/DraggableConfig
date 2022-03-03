# CurvlyConfig

This code is inspired by [HTML5 Drag and Drop anywhere on the screen](https://stackoverflow.com/a/24497110/14522489) and [How to connect multiple divs from path?](https://stackoverflow.com/a/60187618/14522489) on Stackoverflow.

It allows you to draw curves between draggable elements (and to update the curves after dropping an element somewhere else on the screen).

## How to use?

See the source code available in both `TypeScript` (`src/script.ts`) and `JavaScript` (`src/script.js`), and an example in `src/example.html`.

```html
<!-- *.html -->
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* the draggable elements must have these properties */
      .box {
        position: absolute;
        left: 0;
        top: 0; /* set these so Chrome doesn't return 'auto' from getComputedStyle */
        /* ... */
      }

      /* a path between two draggable elements. */
      .path {
        fill: none;
        stroke: #444;
        stroke-width: 2;
      }
    </style>
  </head>
  <body>
    <!-- the draggable elements -->
    <div id="box1" class="box">1</div>
    <div id="box2" class="box">2</div>
    <div id="box3" class="box">3</div>
    <!--
      Add this SVG element and set your own height and width.
      This defines the zone of your screen where the paths will be drawn.
      This must follows your draggable elements.
    -->
    <svg height="1000" width="1000" id="paths"></svg>
  </body>
</html>
```

Now the best part:

```html
<script src="curvly.js"></script>
<script>
  // the zone of your screen in which the paths will be drawn.
  const paths = document.getElementById("paths");

  // the connections between the elements,
  // each connection is an object { boxA: "id of the element", boxB: "id of the linked element" }.
  // Define as many connections as you desire.
  const connections = [
    { boxA: "#box1", boxB: "#box2" },
    { boxA: "#box2", boxB: "#box3" },
  ];

  // Sets your configurations here.
  // Not that all the methods and properties of the `CurvlyConfig` object
  // are set as private and should not be used externally.
  new CurvlyConfig({
    // these two properties are necessary
    connections,
    paths,
    // onDragStart: (e) => console.log("starting to drag for element :", e.target),
    // onDragEnd: (e) => console.log("stopped dragging element :", e.target),
    // onDrag: (e) => console.log("dragging element :", e.target),
    // padding: 5, // default is 0
    // bezierWeight: 0.7, // default is 0.675
  });
</script>
```

## Technical details

The code uses the following types.

```typescript
// TypeScript

type CurvesConnections = { boxA: string; boxB: string }[];

// the paramater of CurvlyConfig's constructor
interface CurvlyOptions {
  // A function to call everytime the element is being dragged.
  onDrag?: (e: DragEvent) => void;
  // A function to call everytime the element is starting to be dragged.
  onDragStart?: (e: DragEvent) => void;
  // A function to call everytime the element has stopped being dragged.
  onDragEnd?: (e: DragEvent) => void;

  // If set to 0, the curve will be in the center of the element,
  // If set to a big number, it will come out of the box element.
  padding?: number;
  // the undulating nature of a curve between 0 and 1 (0 is a straight line).
  bezierWeight?: number;

  // the following properties are necessary.
  //
  // the connections between the draggable elements.
  connections: CurvesConnections;
  // the zone in the screen which will draw the paths.
  paths: SVGElement;
}
```
