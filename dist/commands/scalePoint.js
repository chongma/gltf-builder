"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalePoint = void 0;
function scalePoint(point, scale) {
    return { x: point.x / scale, y: point.y / scale, z: point.z / scale };
}
exports.scalePoint = scalePoint;
