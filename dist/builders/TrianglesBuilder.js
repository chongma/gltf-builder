"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrianglesBuilder = void 0;
var checkExtents_1 = require("../commands/checkExtents");
var initialiseExtent_1 = require("../commands/initialiseExtent");
var scalePoint_1 = require("../commands/scalePoint");
var TrianglesBuilder = /** @class */ (function () {
    function TrianglesBuilder(verticesCount, indexesCount, normalsCount, scale, mode) {
        if (scale === void 0) { scale = 1; }
        this.vertexCounter = -1;
        this.indexCounter = -1;
        this.normalCounter = -1;
        this.verticesCount = verticesCount;
        this.indexesCount = indexesCount;
        this.normalsCount = normalsCount;
        this.verticesArray = new Float32Array(verticesCount * 3);
        this.indexesArray = new Uint16Array(indexesCount);
        this.normalsArray = new Float32Array(normalsCount * 3);
        this.extent = (0, initialiseExtent_1.initialiseExtent)();
        this.scale = scale;
        this.mode = mode;
    }
    TrianglesBuilder.prototype.addIndex = function (index) {
        this.indexCounter++;
        this.indexesArray[this.indexCounter] = index;
        return this.indexCounter;
    };
    TrianglesBuilder.prototype.addVertex = function (vertex) {
        this.vertexCounter++;
        vertex = (0, scalePoint_1.scalePoint)(vertex, this.scale);
        (0, checkExtents_1.checkExtents)(vertex, this.extent);
        var pointOffset = this.vertexCounter * 3;
        this.verticesArray[pointOffset] = vertex.x;
        this.verticesArray[pointOffset + 1] = vertex.y;
        this.verticesArray[pointOffset + 2] = vertex.z;
        return this.vertexCounter;
    };
    TrianglesBuilder.prototype.addNormal = function (normal) {
        this.normalCounter++;
        var normalOffset = this.normalCounter * 3;
        this.verticesArray[normalOffset] = normal.x;
        this.verticesArray[normalOffset + 1] = normal.y;
        this.verticesArray[normalOffset + 2] = normal.z;
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
        var vertices = Buffer.from(new Uint8Array(this.verticesArray.buffer));
        var indexes = Buffer.from(new Uint8Array(this.indexesArray.buffer));
        var normals = Buffer.from(new Uint8Array(this.normalsArray.buffer));
        var _a = this, verticesCount = _a.verticesCount, indexesCount = _a.indexesCount, normalsCount = _a.normalsCount, extent = _a.extent;
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
        gltfBuilder.createGltfTriangles(this.build(), this.mode);
    };
    return TrianglesBuilder;
}());
exports.TrianglesBuilder = TrianglesBuilder;
