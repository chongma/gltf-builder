"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseExtent = void 0;
var BIG_NUMBER = 1000000;
function initialiseExtent() {
    return {
        min: { x: BIG_NUMBER, y: BIG_NUMBER, z: BIG_NUMBER },
        max: { x: -BIG_NUMBER, y: -BIG_NUMBER, z: -BIG_NUMBER }
    };
}
exports.initialiseExtent = initialiseExtent;
