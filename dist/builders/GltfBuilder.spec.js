"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gltf_1 = require("../types/gltf");
var GltfBuilder_1 = require("./GltfBuilder");
var LinesBuilder_1 = require("./LinesBuilder");
var PointsBuilder_1 = require("./PointsBuilder");
var TrianglesBuilder_1 = require("./TrianglesBuilder");
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
        var simple3DObject = {
            vertices: [
                // Vertex positions (x, y, z)
                [0, 0, 0],
                [1, 0, 0],
                [0.5, Math.sqrt(3) / 2, 0],
                [0.5, Math.sqrt(3) / 6, Math.sqrt(2 / 3)], // Vertex 3: Top vertex
            ],
            normals: [
                // Normals (x, y, z) - one per vertex
                [0, 0, -1],
                [0, 0, -1],
                [0, 0, -1],
                [0, 0, 1], // Normal at Vertex 3
            ],
            indices: [
                // Triangles (each group of 3 indices forms a triangle)
                0, 1, 2,
                0, 1, 3,
                1, 2, 3,
                2, 0, 3, // Side triangle 3
            ],
        };
        var gltfBuilder = new GltfBuilder_1.GltfBuilder();
        var verticesCount = simple3DObject.vertices.length;
        var indicesCount = simple3DObject.indices.length;
        var normalsCount = simple3DObject.normals.length;
        var trianglesBuilder = new TrianglesBuilder_1.TrianglesBuilder(verticesCount, indicesCount, normalsCount, scale, gltf_1.TriangleType.TRIANGLES);
        simple3DObject.vertices.forEach(function (vertex) { return trianglesBuilder.addVertex(vertex); });
        simple3DObject.normals.forEach(function (normal) { return trianglesBuilder.addNormal(normal); });
        simple3DObject.indices.forEach(function (index) { return trianglesBuilder.addIndex(index); });
        trianglesBuilder.buildGltf(gltfBuilder);
        var gltf = gltfBuilder.build();
        console.log(JSON.stringify(gltf));
    });
});
