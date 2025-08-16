"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scale3 = exports.add3 = exports.cross = exports.normalize = void 0;
function normalize(v) {
    var len = Math.hypot.apply(Math, v);
    return v.map(function (x) { return x / len; });
}
exports.normalize = normalize;
function cross(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}
exports.cross = cross;
function add3() {
    var vs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        vs[_i] = arguments[_i];
    }
    return vs.reduce(function (acc, v) { return [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]]; }, [0, 0, 0]);
}
exports.add3 = add3;
function scale3(v, s) {
    return [v[0] * s, v[1] * s, v[2] * s];
}
exports.scale3 = scale3;
