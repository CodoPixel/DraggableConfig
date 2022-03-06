"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useCurvly;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = require("react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Creates basic functions to use with Curvly.
 * @param {{boxA:string, boxB:string}[]} initialConnections
 * @param {CurvlyElement[]} initialBoxes
 * @returns {[{connections:{boxA:string, boxB:string}[], boxes:CurvlyElement[]}, {createNewBox:(newBox: CurvlyElement, newId:string, linkedWithId:string) => void, removeOneBox:(id:string) => void, linkBoxes:(boxA:string, boxB:string) => void, removeLinksFrom:(id:string) => void, removeLinkBetween:(boxA:string, boxB:string) => void}, setCurvlyConfig:React.Dispatch]}
 */
function useCurvly(initialConnections, initialBoxes) {
  const [curvlyConfig, setCurvlyConfig] = (0, _react.useState)({
    connections: initialConnections !== null && initialConnections !== void 0 ? initialConnections : [],
    boxes: initialBoxes !== null && initialBoxes !== void 0 ? initialBoxes : []
  }); // Creates a new box and links it with another one if needed.

  const createNewBox = (0, _react.useCallback)((newBox, linkedWithId) => {
    setCurvlyConfig(current => {
      if (linkedWithId) {
        if (current.boxes.findIndex(value => value.props.id === linkedWithId) === -1) {
          throw new Error("You're trying to link a box with one that doesn't exist (\"".concat(linkedWithId, "\")"));
        }
      }

      if (newBox.props.id == null && linkedWithId) {
        throw new Error("Cannot link a box (\"".concat(linkedWithId, "\") with one that does not have and ID (your new box does not have one)"));
      }

      return {
        connections: linkedWithId ? [...current.connections, {
          boxA: newBox.props.id,
          boxB: linkedWithId
        }] : current.connections,
        boxes: [...current.boxes, newBox]
      };
    });
  }, []);
  const removeOneBox = (0, _react.useCallback)(id => {
    setCurvlyConfig(current => {
      const newConfig = {};
      newConfig.connections = current.connections.filter(value => value.boxA !== id && value.boxB !== id);
      newConfig.boxes = current.boxes.filter(value => value.props.id !== id);
      return newConfig;
    });
  }, []);
  const linkBoxes = (0, _react.useCallback)((boxA, boxB) => {
    setCurvlyConfig(current => {
      // to avoid overlapping curves
      // we check if such a connection already exists.
      const existingLinkIndex = current.connections.findIndex(value => value.boxA === boxA && value.boxB === boxB || value.boxA === boxB && value.boxB === boxA); // if it does already exist, we ignore that.

      return existingLinkIndex >= 0 ? current : _objectSpread(_objectSpread({}, current), {}, {
        connections: [...current.connections, {
          boxA,
          boxB
        }]
      });
    });
  }, []);
  const removeLinksFrom = (0, _react.useCallback)(id => {
    setCurvlyConfig(current => {
      const newConnections = current.connections.filter(value => value.boxA !== id && value.boxB !== id);
      return _objectSpread(_objectSpread({}, current), {}, {
        connections: newConnections
      });
    });
  }, []);
  const removeLinkBetween = (0, _react.useCallback)((boxA, boxB) => {
    setCurvlyConfig(current => _objectSpread(_objectSpread({}, current), {}, {
      connections: current.connections.filter(value => // [{"box1", "box2"}, {"box2", "box3"}, {"box1", "box3"}]
      !(value.boxA === boxA && value.boxB === boxB || value.boxA === boxB && value.boxB === boxA))
    }));
  }, []);
  return [curvlyConfig, {
    createNewBox,
    removeOneBox,
    linkBoxes,
    removeLinksFrom,
    removeLinkBetween
  }, setCurvlyConfig];
}