import { useCallback, useState } from "react";

/**
 * Creates basic functions to use with Curvly.
 * @param {{boxA:string, boxB:string}[]} initialConnections
 * @param {CurvlyElement[]} initialBoxes
 * @returns {[{connections:{boxA:string, boxB:string}[], boxes:CurvlyElement[]}, {createNewBox:(newBox: CurvlyElement, newId:string, linkedWithId:string) => void, removeOneBox:(id:string) => void, linkBoxes:(boxA:string, boxB:string) => void, removeLinksFrom:(id:string) => void, removeLinkBetween:(boxA:string, boxB:string) => void}, setCurvlyConfig:React.Dispatch]}
 */
export default function useCurvly(initialConnections, initialBoxes) {
  const [curvlyConfig, setCurvlyConfig] = useState({
    connections: initialConnections ?? [],
    boxes: initialBoxes ?? [],
  });

  // Creates a new box and links it with another one if needed.
  const createNewBox = useCallback((newBox, linkedWithId) => {
    setCurvlyConfig((current) => {
      if (linkedWithId) {
        if (current.boxes.findIndex((value) => value.props.id === linkedWithId) === -1) {
          throw new Error(
            `You're trying to link a box with one that doesn't exist ("${linkedWithId}")`
          );
        }
      }
      if (newBox.props.id == null && linkedWithId) {
        throw new Error(
          `Cannot link a box ("${linkedWithId}") with one that does not have and ID (your new box does not have one)`
        );
      }
      return {
        connections: linkedWithId
          ? [...current.connections, { boxA: newBox.props.id, boxB: linkedWithId }]
          : current.connections,
        boxes: [...current.boxes, newBox],
      };
    });
  }, []);

  const removeOneBox = useCallback((id) => {
    setCurvlyConfig((current) => {
      const newConfig = {};
      newConfig.connections = current.connections.filter(
        (value) => value.boxA !== id && value.boxB !== id
      );
      newConfig.boxes = current.boxes.filter((value) => value.props.id !== id);
      return newConfig;
    });
  }, []);

  const linkBoxes = useCallback((boxA, boxB) => {
    setCurvlyConfig((current) => {
      // to avoid overlapping curves
      // we check if such a connection already exists.
      const existingLinkIndex = current.connections.findIndex(
        (value) =>
          (value.boxA === boxA && value.boxB === boxB) ||
          (value.boxA === boxB && value.boxB === boxA)
      );
      // if it does already exist, we ignore that.
      return existingLinkIndex >= 0
        ? current
        : {
            ...current,
            connections: [...current.connections, { boxA, boxB }],
          };
    });
  }, []);

  const removeLinksFrom = useCallback((id) => {
    setCurvlyConfig((current) => {
      const newConnections = current.connections.filter(
        (value) => value.boxA !== id && value.boxB !== id
      );
      return {
        ...current,
        connections: newConnections,
      };
    });
  }, []);

  const removeLinkBetween = useCallback((boxA, boxB) => {
    setCurvlyConfig((current) => ({
      ...current,
      connections: current.connections.filter(
        (value) =>
          // [{"box1", "box2"}, {"box2", "box3"}, {"box1", "box3"}]
          !(
            (value.boxA === boxA && value.boxB === boxB) ||
            (value.boxA === boxB && value.boxB === boxA)
          )
      ),
    }));
  }, []);

  return [
    curvlyConfig,
    { createNewBox, removeOneBox, linkBoxes, removeLinksFrom, removeLinkBetween },
    setCurvlyConfig,
  ];
}
