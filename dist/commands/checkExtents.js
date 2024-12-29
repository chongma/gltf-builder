"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExtents = void 0;
function checkExtents(point, extent) {
    if (point[0] < extent.min[0]) {
        extent.min[0] = point[0];
    }
    if (point[1] < extent.min[1]) {
        extent.min[1] = point[1];
    }
    if (point[2] < extent.min[2]) {
        extent.min[2] = point[2];
    }
    if (point[0] > extent.max[0]) {
        extent.max[0] = point[0];
    }
    if (point[1] > extent.max[1]) {
        extent.max[1] = point[1];
    }
    if (point[2] > extent.max[2]) {
        extent.max[2] = point[2];
    }
}
exports.checkExtents = checkExtents;
