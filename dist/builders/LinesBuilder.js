"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinesBuilder = void 0;
var checkExtents_1 = require("../commands/checkExtents");
var convertPointObjectToPoint_1 = require("../commands/convertPointObjectToPoint");
var initialiseExtent_1 = require("../commands/initialiseExtent");
var scalePoint_1 = require("../commands/scalePoint");
var LinesBuilder = /** @class */ (function () {
    function LinesBuilder(verticesCount, indexesCount, scale, mode) {
        if (scale === void 0) { scale = 1; }
        this.indexCounter = -1;
        this.vertexCounter = -1;
        this.verticesCount = verticesCount;
        this.indexesCount = indexesCount;
        this.verticesArray = new Float32Array(verticesCount * 3);
        this.indexesArray = new Uint16Array(indexesCount);
        this.extent = (0, initialiseExtent_1.initialiseExtent)();
        this.scale = scale;
        this.mode = mode;
    }
    LinesBuilder.prototype.addIndex = function (index) {
        this.indexCounter++;
        this.indexesArray[this.indexCounter] = index;
        return this.indexCounter;
    };
    LinesBuilder.prototype.addVertex = function (v) {
        this.vertexCounter++;
        var vertex = !Array.isArray(v) ? (0, convertPointObjectToPoint_1.convertPointObjectToPoint)(v) : v;
        vertex = (0, scalePoint_1.scalePoint)(vertex, this.scale);
        (0, checkExtents_1.checkExtents)(vertex, this.extent);
        var pointOffset = this.vertexCounter * 3;
        this.verticesArray[pointOffset] = vertex[0];
        this.verticesArray[pointOffset + 1] = vertex[1];
        this.verticesArray[pointOffset + 2] = vertex[2];
        return this.vertexCounter;
    };
    LinesBuilder.prototype.addLine = function (vertex1, vertex2) {
        var index1 = this.addVertex(vertex1);
        var index2 = this.addVertex(vertex2);
        this.addIndex(index1);
        this.addIndex(index2);
    };
    LinesBuilder.prototype.build = function () {
        var vertices = Buffer.from(new Uint8Array(this.verticesArray.buffer));
        var indexes = Buffer.from(new Uint8Array(this.indexesArray.buffer));
        var _a = this, verticesCount = _a.verticesCount, indexesCount = _a.indexesCount, extent = _a.extent;
        return {
            verticesCount: verticesCount,
            indexesCount: indexesCount,
            vertices: vertices,
            indexes: indexes,
            extent: extent
        };
    };
    LinesBuilder.prototype.buildGltf = function (gltfBuilder) {
        gltfBuilder.createGltfLines(this.build(), this.mode);
    };
    return LinesBuilder;
}());
exports.LinesBuilder = LinesBuilder;
