"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CurvlyZone;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("core-js/modules/es.parse-int.js");

var _react = require("react");

var _CurvlyStylesModule = _interopRequireDefault(require("./styles/CurvlyStyles.module.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the zone in which the curves will be drawn.
 * @param {{draggable:boolean, width:number, connections: {boxA:string, boxB:string}[], padding number, bezierWeight:number, height:number, curveClassName:string}} props
 */
function CurvlyZone(_ref) {
  let {
    width = 750,
    height = 500,
    padding = 0,
    bezierWeight = 0.675,
    draggable = true,
    connections = [],
    curveClassName,
    zoneClassName,
    children
  } = _ref;
  const paths = (0, _react.useRef)(null);
  const drop = (0, _react.useCallback)(e => {
    const transferedData = e.dataTransfer;

    if (transferedData) {
      const offset = transferedData.getData("Text").split(",");
      const dm = document.getElementById(offset[2]);

      if (dm) {
        dm.style.left = e.clientX + parseInt(offset[0], 10) + "px";
        dm.style.top = e.clientY + parseInt(offset[1], 10) + "px";
        e.preventDefault();
      } else {
        throw new Error("Cannot drop the item because it does not have an ID.");
      }
    }
  }, []);
  const drag = (0, _react.useCallback)(e => {
    const target = e.target;

    if (target) {
      if (!target.hasAttribute("id")) {
        throw new Error("The dragged element does not have an ID.");
      }

      const dataTransferred = e.dataTransfer;

      if (dataTransferred) {
        var style = window.getComputedStyle(target, null);
        var str = parseInt(style.getPropertyValue("left")) - e.clientX + "," + (parseInt(style.getPropertyValue("top")) - e.clientY) + "," + target.getAttribute("id");
        e.dataTransfer.setData("Text", str);
      }
    } else {
      throw new Error("The dragged element does not exist.");
    }
  }, []);
  const offset = (0, _react.useCallback)(element => {
    var rect = element.getBoundingClientRect();
    var offset = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    };
    return offset;
  }, []);
  const coordinates = (0, _react.useCallback)(() => {
    let oldPaths = paths.current.children;

    for (let a = oldPaths.length - 1; a >= 0; a--) {
      paths.current.removeChild(oldPaths[a]);
    }

    let x2, x3;

    for (let a = 0; a < connections.length; a++) {
      const connection = connections[a];
      const boxA = document.getElementById(connection.boxA);
      const boxB = document.getElementById(connection.boxB);
      if (boxA == null || boxB == null) throw new Error("ID \"".concat(boxA == null ? connection.boxA : connection.boxB, "\" is not defined."));
      const boxAOffset = offset(boxA);
      const boxBOffset = offset(boxB);
      const x1 = boxAOffset.left + boxA.clientWidth / 2 - padding;
      const y1 = boxAOffset.top + boxA.clientHeight / 2 - padding;
      const x4 = boxBOffset.left + boxA.clientWidth / 2 - padding;
      const y4 = boxBOffset.top + boxA.clientHeight / 2 - padding;
      const dx = Math.abs(x4 - x1) * bezierWeight;

      if (x4 < x1) {
        x2 = x1 - dx;
        x3 = x4 + dx;
      } else {
        x2 = x1 + dx;
        x3 = x4 - dx;
      }

      const data = "M".concat(x1, " ").concat(y1, " C ").concat(x2, " ").concat(y1, " ").concat(x3, " ").concat(y4, " ").concat(x4, " ").concat(y4);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", data);
      path.setAttribute("class", curveClassName !== null && curveClassName !== void 0 ? curveClassName : _CurvlyStylesModule.default.defaultCurve);
      paths.current.appendChild(path);
    }
  }, [padding, bezierWeight, connections, offset, curveClassName]);
  const elements = (0, _react.useMemo)(() => {
    return _react.Children.map(children, child => {
      if ( /*#__PURE__*/(0, _react.isValidElement)(child) && draggable) {
        let newProps = {};
        if (child.props.draggable === undefined) newProps.draggable = draggable;

        if (child.props.onDragStart === undefined) {
          newProps.onDragStart = drag;
        } else {
          newProps.onDragStart = e => {
            drag(e);
            child.props.onDragStart(e);
          };
        }

        if (child.props.onDragEnd === undefined) {
          newProps.onDragEnd = coordinates;
        } else {
          newProps.onDragEnd = e => {
            coordinates();
            child.props.onDragEnd(e);
          };
        }

        if (Object.keys(newProps).length > 0) return /*#__PURE__*/(0, _react.cloneElement)(child, newProps);
      }

      return child;
    });
  }, [children, draggable, drag, coordinates]); // initialization

  (0, _react.useEffect)(() => {
    const body = document.querySelector("body");

    if (body) {
      body.addEventListener("dragover", e => e.preventDefault());
      body.addEventListener("drop", drop);
      coordinates();
    } else {
      throw new Error("The body is not defined.");
    }
  }, [coordinates, drop]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, elements, /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    ref: paths,
    className: zoneClassName
  }));
}