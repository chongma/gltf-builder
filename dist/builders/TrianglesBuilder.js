"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrianglesBuilder = void 0;
var checkExtents_1 = require("../commands/checkExtents");
var convertPointObjectToPoint_1 = require("../commands/convertPointObjectToPoint");
var initialiseExtent_1 = require("../commands/initialiseExtent");
var scalePoint_1 = require("../commands/scalePoint");
var TrianglesBuilder = /** @class */ (function () {
    function TrianglesBuilder(verticesCount, indexesCount, normalsCount, scale, mode, baseColorFactor) {
        if (scale === void 0) { scale = 1; }
        this.verticesCount = verticesCount;
        this.indexesCount = indexesCount;
        this.normalsCount = normalsCount;
        this.scale = scale;
        this.mode = mode;
        this.baseColorFactor = baseColorFactor;
        this.vertexCounter = -1;
        this.indexCounter = -1;
        this.normalCounter = -1;
        this.vertices = new Float32Array(verticesCount * 3);
        this.indexes = new Uint16Array(indexesCount);
        this.normals = new Float32Array(normalsCount * 3);
        this.extent = (0, initialiseExtent_1.initialiseExtent)();
    }
    TrianglesBuilder.prototype.addIndex = function (index) {
        this.indexCounter++;
        this.indexes[this.indexCounter] = index;
        return this.indexCounter;
    };
    TrianglesBuilder.prototype.addVertex = function (v) {
        this.vertexCounter++;
        var vertex = !Array.isArray(v) ? (0, convertPointObjectToPoint_1.convertPointObjectToPoint)(v) : v;
        var pointOffset = this.vertexCounter * 3;
        vertex = (0, scalePoint_1.scalePoint)(vertex, this.scale);
        (0, checkExtents_1.checkExtents)(vertex, this.extent);
        var x = vertex[0], y = vertex[1], z = vertex[2];
        this.vertices[pointOffset] = x;
        this.vertices[pointOffset + 1] = y;
        this.vertices[pointOffset + 2] = z;
        return this.vertexCounter;
    };
    TrianglesBuilder.prototype.addNormal = function (n) {
        this.normalCounter++;
        var normal = !Array.isArray(n) ? (0, convertPointObjectToPoint_1.convertPointObjectToPoint)(n) : n;
        var normalOffset = this.normalCounter * 3;
        var x = normal[0], y = normal[1], z = normal[2];
        this.normals[normalOffset] = x;
        this.normals[normalOffset + 1] = y;
        this.normals[normalOffset + 2] = z;
        return this.normalCounter;
    };
    TrianglesBuilder.prototype.addTriangle = function (vertex1, vertex2, vertex3) {
        var index1 = this.addVertex(vertex1);
        var index2 = this.addVertex(vertex2);
        var index3 = this.addVertex(vertex3);
        this.addIndex(index1);
        this.addIndex(index2);
        this.addIndex(index3);
    };
    TrianglesBuilder.prototype.build = function () {
        var _a = this, verticesCount = _a.verticesCount, indexesCount = _a.indexesCount, normalsCount = _a.normalsCount, vertices = _a.vertices, indexes = _a.indexes, normals = _a.normals, extent = _a.extent;
        return {
            verticesCount: verticesCount,
            indexesCount: indexesCount,
            normalsCount: normalsCount,
            vertices: vertices,
            indexes: indexes,
            normals: normals,
            extent: extent
        };
    };
    TrianglesBuilder.prototype.buildGltf = function (gltfBuilder) {
        gltfBuilder.createGltfTriangles(this.build(), this.mode, this.baseColorFactor);
    };
    return TrianglesBuilder;
}());
exports.TrianglesBuilder = TrianglesBuilder;
