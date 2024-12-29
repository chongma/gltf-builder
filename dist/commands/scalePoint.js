"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scalePoint = void 0;
function scalePoint(point, scale) {
    return [point[0] / scale, point[1] / scale, point[2] / scale];
}
exports.scalePoint = scalePoint;
