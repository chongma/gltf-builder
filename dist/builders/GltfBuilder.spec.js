"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gltf_1 = require("../types/gltf");
var GltfBuilder_1 = require("./GltfBuilder");
var LinesBuilder_1 = require("./LinesBuilder");
var PointsBuilder_1 = require("./PointsBuilder");
describe('Gltf builder', function () {
    var vertices = [
        { x: 1, y: 2, z: 3 },
        { x: 2, y: 3, z: 4 },
        { x: 5, y: 6, z: 7 }
    ];
    var scale = 1;
    it('Draw some points', function () {
        var gltfBuilder = new GltfBuilder_1.GltfBuilder();
        var verticesCount = vertices.length;
        var pointsBuilder = new PointsBuilder_1.PointsBuilder(verticesCount, scale);
        pointsBuilder.addVertices(vertices);
        pointsBuilder.buildGltf(gltfBuilder);
        var gltf = gltfBuilder.build();
        console.log(JSON.stringify(gltf));
    });
    it('Draw some test lines', function () {
        var gltfBuilder = new GltfBuilder_1.GltfBuilder();
        var verticesCount = vertices.length;
        var indexesCount = vertices.length;
        var lineBuilder = new LinesBuilder_1.LinesBuilder(verticesCount, indexesCount, scale, gltf_1.LineType.LINE_STRIP);
        vertices.forEach(function (vertex) {
            var index = lineBuilder.addVertex(vertex);
            lineBuilder.addIndex(index);
        });
        lineBuilder.buildGltf(gltfBuilder);
        var gltf = gltfBuilder.build();
        console.log(JSON.stringify(gltf));
    });
    it('Draw some triangles', function () {
    });
});
