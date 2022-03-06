// Type definitions for react-curvly 0.1.0
// Project: react-curvly
// Definitions by: CodoPixel <https://github.com/CodoPixel>

/**
 * A connection between two elements which will draw a curve.
 */
export declare type Connection = { boxA: string; boxB: string };

/**
 * Creates an element that can be draggable and attached to a curve.
 * @param className The custom class name to be applied to the newly created element.
 * @param draggable Whether the element can be draggable or not.
 * @param onDragStart A function called everytime the element started to be dragged.
 * @param onDragEnd A function called everytime the element stopped being dragged.
 * @param onDrag A function called everytime the element is being dragged.
 * @param id The ID given to the element in order to be recognized and attached with others.
 */
export declare function CurvlyElement(
  className?: string,
  draggable?: booleanstring,
  onDragStart?: (e: DragEvent) => void,
  onDragEnd?: (e: DragEvent) => void,
  onDrag?: (e: DragEvent) => void,
  id: string
): JSX.Element;

/**
 * Defines useful functions to make Curvly dynamic.
 * @param initialConnections The initial connections.
 * @param initialBoxes The initial boxes inside the zone.
 */
export declare function useCurvly(
  initialConnections: Connection[],
  initialBoxes: typeof CurvlyElement[]
): [
  { connections: Connection[]; boxes: typeof CurvlyElement[] },
  {
    createNewBox: (newBox: typeof CurvlyElement, newId: string, linkedWithId: string) => void;
    removeOneBox: (id: string) => void;
    linkBoxes: (boxA: string, boxB: string) => void;
    removeLinksFrom: (id: string) => void;
    removeLinkBetween: (boxA: string, boxB: string) => void;
  },
  React.Dispatch<
    React.SetStateAction<{
      connections: Connection[];
      boxes: typeof CurvlyElement[];
    }>
  >
];

/**
 * Defines the zone in which the curves will be drawn.
 * @param width The width of the zone
 * @param height The height of the zone.
 * @param padding The positional offset between the curve and the centre of the element.
 * @param bezierWeight The undulating nature of a curve between 0 and 1 (0 is a straight line).
 * @param draggable The default value given to the elements that defines whether they're draggable or not.
 * @param connections The connections between the elements (so the curves).
 * @param curveClassName A custom class name to be applied to the curves. There is a default style, see the documentation.
 * @param zoneClassName A custom class name to be applied to the zone.
 */
export declare function CurvlyZone(
  width?: number,
  height?: number,
  padding?: number,
  bezierWeight?: number,
  draggable?: boolean,
  connections?: Connection[],
  curveClassName?: string,
  zoneClassName?: string
): JSX.Element;
