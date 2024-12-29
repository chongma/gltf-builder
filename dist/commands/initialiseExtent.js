"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseExtent = void 0;
var BIG_NUMBER = 1000000;
function initialiseExtent() {
    return {
        min: [BIG_NUMBER, BIG_NUMBER, BIG_NUMBER],
        max: [-BIG_NUMBER, -BIG_NUMBER, -BIG_NUMBER]
    };
}
exports.initialiseExtent = initialiseExtent;
