"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalePoint = void 0;
function scalePoint(point, scale) {
    var x = point[0], y = point[1], z = point[2];
    return [x / scale, y / scale, z / scale];
}
exports.scalePoint = scalePoint;
