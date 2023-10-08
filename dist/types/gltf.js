"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferViewTarget = exports.TriangleType = exports.LineType = exports.scale = void 0;
exports.scale = 10000;
var LineType;
(function (LineType) {
    LineType[LineType["LINES"] = 1] = "LINES";
    LineType[LineType["LINE_LOOP"] = 2] = "LINE_LOOP";
    LineType[LineType["LINE_STRIP"] = 3] = "LINE_STRIP";
})(LineType || (exports.LineType = LineType = {}));
var TriangleType;
(function (TriangleType) {
    TriangleType[TriangleType["TRIANGLES"] = 4] = "TRIANGLES";
    TriangleType[TriangleType["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
    TriangleType[TriangleType["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(TriangleType || (exports.TriangleType = TriangleType = {}));
var BufferViewTarget;
(function (BufferViewTarget) {
    BufferViewTarget[BufferViewTarget["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
    BufferViewTarget[BufferViewTarget["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
})(BufferViewTarget || (exports.BufferViewTarget = BufferViewTarget = {}));
