import classes from "./styles/CurvlyStyles.module.css";

/**
 * Creates an element that can be attached to a curve. The default value of `draggable` is brought via `CurvlyZone`.
 * @param {{className:string, draggable:boolean, onDragStart:(e:DragEvent) => void, onDrag:(e:DragEvent) => void, onDragEnd:(e:DragEvent) => void}} props
 */
export default function CurvlyElement({
  className = "",
  draggable,
  onDragStart,
  onDragEnd,
  onDrag,
  children,
  id,
}) {
  return (
    <div
      className={classes.curvlyElement + " " + className}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrag={onDrag}
      id={id}
    >
      {children}
    </div>
  );
}
