"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CurvlyElement;

var _CurvlyStylesModule = _interopRequireDefault(require("./styles/CurvlyStyles.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates an element that can be attached to a curve. The default value of `draggable` is brought via `CurvlyZone`.
 * @param {{className:string, draggable:boolean, onDragStart:(e:DragEvent) => void, onDrag:(e:DragEvent) => void, onDragEnd:(e:DragEvent) => void}} props
 */
function CurvlyElement(_ref) {
  let {
    className = "",
    draggable,
    onDragStart,
    onDragEnd,
    onDrag,
    children,
    id
  } = _ref;
  return /*#__PURE__*/React.createElement("div", {
    className: _CurvlyStylesModule.default.curvlyElement + " " + className,
    draggable: draggable,
    onDragStart: onDragStart,
    onDragEnd: onDragEnd,
    onDrag: onDrag,
    id: id
  }, children);
}