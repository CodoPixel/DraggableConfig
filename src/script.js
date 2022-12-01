"use strict";
/**
 * @classdesc See the document for more info on [GitHub]({@link https://github.com/CodoPixel/Curvly})
 */
class CurvlyConfig {
    _options;
    // stores the IDs of the elements we set as draggable already
    // in order to avoid duplications of events in `setDraggable` method.
    _elements = [];
    constructor(options) {
        const body = document.querySelector("body");
        if (body) {
            body.addEventListener("dragover", this._dragOver.bind(this));
            body.addEventListener("drop", this._drop.bind(this));
            this._options = options;
            // may be undefined so we set the default values
            this._options.padding ??= 0;
            this._options.bezierWeight ??= 0.675;
            this._options.draggable ??= true;
            if (this._options.draggable) {
                for (let connection of options.connections) {
                    const boxA = document.querySelector(connection.boxA);
                    const boxB = document.querySelector(connection.boxB);
                    if (boxA && boxB) {
                        if (!this._elements.includes(connection.boxA)) {
                            this._setDraggable(document.querySelector(connection.boxA));
                            this._elements.push(connection.boxA);
                        }
                        if (!this._elements.includes(connection.boxB)) {
                            this._setDraggable(document.querySelector(connection.boxB));
                            this._elements.push(connection.boxB);
                        }
                    }
                    else {
                        throw new Error(`ID "${boxA == null ? connection.boxA : connection.boxB}" is not defined.`);
                    }
                }
            }
            // initialization
            this.coordinates();
        }
        else {
            throw new Error("The body is not defined.");
        }
    }
    _offset(element) {
        const rect = element.getBoundingClientRect();
        const offset = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
        };
        return offset;
    }
    /**
     * Defines new connections to be applied on all the elements once `coordinates()` will be called,
     * or when the user will drag the elements again.
     * @param newConnections The new connections.
     */
    defineNewConnections(newConnections) {
        this._options.connections = newConnections;
    }
    /**
     * Creates the curves between the established connections.
     */
    coordinates() {
        let oldPaths = this._options.paths.children;
        for (let a = oldPaths.length - 1; a >= 0; a--) {
            this._options.paths.removeChild(oldPaths[a]);
        }
        let x2, x3;
        for (let a = 0; a < this._options.connections.length; a++) {
            const connection = this._options.connections[a];
            const boxA = document.querySelector(connection.boxA);
            const boxB = document.querySelector(connection.boxB);
            if (boxA == null || boxB == null)
                throw new Error(`ID "${boxA == null ? connection.boxA : connection.boxB}" is not defined.`);
            const boxAOffset = this._offset(boxA);
            const boxBOffset = this._offset(boxB);
            const x1 = boxAOffset.left + boxA.clientWidth / 2 - this._options.padding;
            const y1 = boxAOffset.top + boxA.clientHeight / 2 - this._options.padding;
            const x4 = boxBOffset.left + boxA.clientWidth / 2 - this._options.padding;
            const y4 = boxBOffset.top + boxA.clientHeight / 2 - this._options.padding;
            const dx = Math.abs(x4 - x1) * this._options.bezierWeight;
            if (x4 < x1) {
                x2 = x1 - dx;
                x3 = x4 + dx;
            }
            else {
                x2 = x1 + dx;
                x3 = x4 - dx;
            }
            const data = `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", data);
            path.setAttribute("class", "path");
            path.setAttribute("data-coming-from", connection.boxA);
            path.setAttribute("data-going-to", connection.boxB);
            this._options.paths.appendChild(path);
        }
    }
    _setDraggable(element) {
        element.setAttribute("draggable", "true");
        element.addEventListener("dragstart", (e) => {
            this._drag(e);
            this._options.onDragStart?.(e);
        });
        element.addEventListener("dragend", (e) => {
            this.coordinates();
            this._options.onDragEnd?.(e);
        });
        if (this._options.onDrag)
            element.addEventListener("drag", this._options.onDrag);
    }
    _drag(e) {
        const target = e.target;
        if (target) {
            if (!target.hasAttribute("id")) {
                throw new Error("The dragged element does not have an ID.");
            }
            const dataTransferred = e.dataTransfer;
            if (dataTransferred) {
                const style = window.getComputedStyle(target, null);
                const str = parseInt(style.getPropertyValue("left")) -
                    e.clientX +
                    "," +
                    (parseInt(style.getPropertyValue("top")) - e.clientY) +
                    "," +
                    target.getAttribute("id");
                e.dataTransfer.setData("Text", str);
            }
        }
        else {
            throw new Error("The dragged element does not exist.");
        }
    }
    _drop(e) {
        const transferedData = e.dataTransfer;
        if (transferedData) {
            const offset = transferedData.getData("Text").split(",");
            const dm = document.getElementById(offset[2]);
            if (dm) {
                dm.style.left = e.clientX + parseInt(offset[0], 10) + "px";
                dm.style.top = e.clientY + parseInt(offset[1], 10) + "px";
                e.preventDefault();
            }
            else {
                throw new Error("Cannot drop the item because it does not have an ID.");
            }
        }
    }
    _dragOver(e) {
        e.preventDefault();
    }
}
