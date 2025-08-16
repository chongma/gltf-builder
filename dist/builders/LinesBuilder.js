"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinesBuilder = void 0;
var checkExtents_1 = require("../commands/checkExtents");
var convertPointObjectToPoint_1 = require("../commands/convertPointObjectToPoint");
var initialiseExtent_1 = require("../commands/initialiseExtent");
var scalePoint_1 = require("../commands/scalePoint");
var LinesBuilder = /** @class */ (function () {
    function LinesBuilder(verticesCount, indexesCount, scale, mode, baseColorFactor) {
        if (scale === void 0) { scale = 1; }
        this.verticesCount = verticesCount;
        this.indexesCount = indexesCount;
        this.scale = scale;
        this.mode = mode;
        this.baseColorFactor = baseColorFactor;
        this.indexCounter = -1;
        this.vertexCounter = -1;
        this.vertices = new Float32Array(verticesCount * 3);
        this.indexes = new Uint16Array(indexesCount);
        this.extent = (0, initialiseExtent_1.initialiseExtent)();
    }
    LinesBuilder.prototype.addIndex = function (index) {
        this.indexCounter++;
        this.indexes[this.indexCounter] = index;
        return this.indexCounter;
    };
    LinesBuilder.prototype.addVertex = function (v) {
        this.vertexCounter++;
        var vertex = !Array.isArray(v) ? (0, convertPointObjectToPoint_1.convertPointObjectToPoint)(v) : v;
        vertex = (0, scalePoint_1.scalePoint)(vertex, this.scale);
        (0, checkExtents_1.checkExtents)(vertex, this.extent);
        var pointOffset = this.vertexCounter * 3;
        var x = vertex[0], y = vertex[1], z = vertex[2];
        this.vertices[pointOffset] = x;
        this.vertices[pointOffset + 1] = y;
        this.vertices[pointOffset + 2] = z;
        return this.vertexCounter;
    };
    LinesBuilder.prototype.addLine = function (vertex1, vertex2) {
        var index1 = this.addVertex(vertex1);
        var index2 = this.addVertex(vertex2);
        this.addIndex(index1);
        this.addIndex(index2);
    };
    LinesBuilder.prototype.build = function () {
        var _a = this, verticesCount = _a.verticesCount, indexesCount = _a.indexesCount, extent = _a.extent, vertices = _a.vertices, indexes = _a.indexes;
        return {
            verticesCount: verticesCount,
            indexesCount: indexesCount,
            vertices: vertices,
            indexes: indexes,
            extent: extent
        };
    };
    LinesBuilder.prototype.buildGltf = function (gltfBuilder) {
        gltfBuilder.createGltfLines(this.build(), this.mode, this.baseColorFactor);
    };
    return LinesBuilder;
}());
exports.LinesBuilder = LinesBuilder;
