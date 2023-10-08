"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointsBuilder = void 0;
var checkExtents_1 = require("../commands/checkExtents");
var initialiseExtent_1 = require("../commands/initialiseExtent");
var scalePoint_1 = require("../commands/scalePoint");
var PointsBuilder = /** @class */ (function () {
    function PointsBuilder(verticesCount, scale) {
        if (scale === void 0) { scale = 1; }
        this.vertexCounter = -1;
        this.verticesCount = verticesCount;
        this.verticesArray = new Float32Array(verticesCount * 3);
        this.extent = (0, initialiseExtent_1.initialiseExtent)();
        this.scale = scale;
    }
    PointsBuilder.prototype.addVertex = function (vertex) {
        this.vertexCounter++;
        vertex = (0, scalePoint_1.scalePoint)(vertex, this.scale);
        (0, checkExtents_1.checkExtents)(vertex, this.extent);
        var pointOffset = this.vertexCounter * 3;
        this.verticesArray[pointOffset] = vertex.x;
        this.verticesArray[pointOffset + 1] = vertex.y;
        this.verticesArray[pointOffset + 2] = vertex.z;
        return this.vertexCounter;
    };
    PointsBuilder.prototype.addVertices = function (vertices) {
        var _this = this;
        vertices.map(function (vertex) { return _this.addVertex(vertex); });
    };
    PointsBuilder.prototype.build = function () {
        var vertices = Buffer.from(new Uint8Array(this.verticesArray.buffer));
        var _a = this, verticesCount = _a.verticesCount, extent = _a.extent;
        return {
            verticesCount: verticesCount,
            vertices: vertices,
            extent: extent
        };
    };
    PointsBuilder.prototype.buildGltf = function (gltfBuilder) {
        gltfBuilder.createGltfPoints(this.build());
    };
    return PointsBuilder;
}());
exports.PointsBuilder = PointsBuilder;
