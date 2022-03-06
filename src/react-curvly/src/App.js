// to customize the example
import "./App.css";

// For the example, I'll use:
import { useCallback, useState } from "react";

// both elements are necessary
import { CurvlyZone, CurvlyElement, useCurvly } from "./lib/index";

/**
 * Creates an example for React Curvly.
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

  // note that the code will throw an error
  // if you delete the box number 2
  // and if you tried to add new boxes afterwards
  // because all the new boxes are meant to be linked with the box number 2,
  // in my example

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
            "box2"
          )
        }
      >
        Add a box
      </button>
      <button type="button" onClick={() => removeOneBox("box" + curvlyConfig.boxes.length)}>
        Remove last box
      </button>
      <button type="button" onClick={() => linkBoxes("box" + curvlyConfig.boxes.length, "box1")}>
        Link last box with box 1
      </button>
      <button type="button" onClick={() => removeLinksFrom("box1")}>
        Remove all links from box 1
      </button>
      <button type="button" onClick={() => removeLinkBetween("box2", "box3")}>
        Remove link between box2 and box3
      </button>
      <button type="button" onClick={toggleDraggable}>
        {draggable ? "lock boxes" : "unlock boxes"}
      </button>
    </div>
  );
}
