"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GltfBuilder = void 0;
var createRandomBaseColorFactor_1 = require("../commands/createRandomBaseColorFactor");
var gltf_1 = require("../types/gltf");
var LinesBuilder_1 = require("./LinesBuilder");
var GltfBuilder = /** @class */ (function () {
    function GltfBuilder() {
        this.buffers = [];
        this.bufferViews = [];
        this.accessors = [];
        this.meshes = [];
        this.nodes = [];
        this.materials = [];
        this.sceneNodes = [];
    }
    GltfBuilder.prototype.typedArrayToBase64 = function (array) {
        var uint8Array = new Uint8Array(array.buffer);
        var base64String;
        if (typeof Buffer !== "undefined") {
            base64String = Buffer.from(uint8Array).toString("base64");
        }
        else {
            var binary_1 = "";
            uint8Array.forEach(function (byte) { return (binary_1 += String.fromCharCode(byte)); });
            base64String = btoa(binary_1);
        }
        return { base64String: base64String, byteLength: uint8Array.byteLength };
    };
    GltfBuilder.prototype.createBuffer = function (_a) {
        var base64String = _a.base64String, byteLength = _a.byteLength;
        var buffer = {
            uri: "data:application/octet-stream;base64,".concat(base64String),
            byteLength: byteLength
        };
        return this.addBuffer(buffer);
    };
    GltfBuilder.prototype.addBuffer = function (buffer) {
        this.buffers.push(buffer);
        return this.buffers.length - 1;
    };
    GltfBuilder.prototype.createBufferView = function (bufferId, _a, target) {
        var byteLength = _a.byteLength;
        var bufferView = {
            buffer: bufferId,
            byteOffset: 0,
            byteLength: byteLength,
            target: target
        };
        return this.addBufferView(bufferView);
    };
    GltfBuilder.prototype.addBufferView = function (bufferView) {
        this.bufferViews.push(bufferView);
        return this.bufferViews.length - 1;
    };
    GltfBuilder.prototype.createMaterial = function (baseColorFactor) {
        var material = {
            name: 'some_material',
            pbrMetallicRoughness: {
                baseColorFactor: baseColorFactor,
                // metallicFactor: Math.random(),
                // roughnessFactor: Math.random()
            }
        };
        // const material: GltfMaterial = {
        //     name: "gold",
        //     pbrMetallicRoughness: {
        //         baseColorFactor: [1.000, 0.766, 0.336, 1.0],
        //         metallicFactor: 1.0,
        //         roughnessFactor: 0.0
        //     }
        // }
        return this.addMaterial(material);
    };
    GltfBuilder.prototype.addMaterial = function (material) {
        this.materials.push(material);
        return this.materials.length - 1;
    };
    GltfBuilder.prototype.createAccessorVec3 = function (bufferView, count, extent) {
        var accessor = {
            bufferView: bufferView,
            byteOffset: 0,
            componentType: 5126,
            count: count,
            type: 'VEC3',
            max: [extent.max[0], extent.max[1], extent.max[2]],
            min: [extent.min[0], extent.min[1], extent.min[2]]
        };
        return this.addAccessor(accessor);
    };
    GltfBuilder.prototype.createAccessorScalar = function (bufferView, count) {
        var accessor = {
            bufferView: bufferView,
            byteOffset: 0,
            componentType: 5123,
            count: count,
            type: 'SCALAR'
        };
        return this.addAccessor(accessor);
    };
    GltfBuilder.prototype.addAccessor = function (accessor) {
        this.accessors.push(accessor);
        return this.accessors.length - 1;
    };
    GltfBuilder.prototype.addMesh = function (mesh) {
        this.meshes.push(mesh);
        return this.meshes.length - 1;
    };
    GltfBuilder.prototype.addNode = function (node) {
        this.nodes.push(node);
        return this.nodes.length - 1;
    };
    GltfBuilder.prototype.addSceneNode = function (i) {
        this.sceneNodes.push(i);
    };
    GltfBuilder.prototype.createGltfPoints = function (pointCloud, bcf) {
        var count = pointCloud.verticesCount, extent = pointCloud.extent, vertices = pointCloud.vertices;
        var base64TypeVertices = this.typedArrayToBase64(vertices);
        var buffer = this.createBuffer(base64TypeVertices);
        var bufferView = this.createBufferView(buffer, base64TypeVertices, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var accessor = this.createAccessorVec3(bufferView, count, extent);
        var baseColorFactor = bcf || (0, createRandomBaseColorFactor_1.createRandomBaseColorFactor)();
        var material = this.createMaterial(baseColorFactor);
        var mesh = this.addMesh({
            primitives: [{
                    attributes: { POSITION: accessor },
                    // indices: 0
                    material: material,
                    mode: 0
                }]
        });
        var node = this.addNode({ mesh: mesh });
        this.addSceneNode(node);
    };
    GltfBuilder.prototype.createGltfLines = function (lines, mode, bcf) {
        var vertices = lines.vertices, verticesCount = lines.verticesCount, indexes = lines.indexes, indexesCount = lines.indexesCount, extent = lines.extent;
        var base64TypeVertices = this.typedArrayToBase64(vertices);
        var base64TypeIndexes = this.typedArrayToBase64(indexes);
        var bufferVertices = this.createBuffer(base64TypeVertices);
        var bufferIndexes = this.createBuffer(base64TypeIndexes);
        var bufferViewVertices = this.createBufferView(bufferVertices, base64TypeVertices, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var bufferViewIndexes = this.createBufferView(bufferIndexes, base64TypeIndexes, gltf_1.BufferViewTarget.ELEMENT_ARRAY_BUFFER);
        var accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent);
        var accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount);
        var baseColorFactor = bcf || (0, createRandomBaseColorFactor_1.createRandomBaseColorFactor)();
        var material = this.createMaterial(baseColorFactor);
        var mesh = this.addMesh({
            primitives: [{
                    attributes: { POSITION: accessorVertices },
                    indices: accessorIndexes,
                    material: material,
                    mode: mode
                }]
        });
        var node = this.addNode({ mesh: mesh });
        this.addSceneNode(node);
    };
    GltfBuilder.prototype.createGltfTriangles = function (triangles, mode, bcf) {
        var vertices = triangles.vertices, verticesCount = triangles.verticesCount, indexes = triangles.indexes, indexesCount = triangles.indexesCount, normals = triangles.normals, normalsCount = triangles.normalsCount, extent = triangles.extent;
        var base64TypeVertices = this.typedArrayToBase64(vertices);
        var base64TypeIndexes = this.typedArrayToBase64(indexes);
        var base64TypeNormals = this.typedArrayToBase64(normals);
        var bufferVertices = this.createBuffer(base64TypeVertices);
        var bufferIndexes = this.createBuffer(base64TypeIndexes);
        var bufferNormals = this.createBuffer(base64TypeNormals);
        var bufferViewVertices = this.createBufferView(bufferVertices, base64TypeVertices, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var bufferViewIndexes = this.createBufferView(bufferIndexes, base64TypeIndexes, gltf_1.BufferViewTarget.ELEMENT_ARRAY_BUFFER);
        var bufferViewNormals = this.createBufferView(bufferNormals, base64TypeNormals, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent);
        var accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount);
        var accessorNormals = this.createAccessorVec3(bufferViewNormals, normalsCount, extent);
        var baseColorFactor = bcf || (0, createRandomBaseColorFactor_1.createRandomBaseColorFactor)();
        var material = this.createMaterial(baseColorFactor);
        var mesh = this.addMesh({
            primitives: [{
                    attributes: { POSITION: accessorVertices, NORMAL: accessorNormals },
                    indices: accessorIndexes,
                    material: material,
                    mode: mode
                }]
        });
        var node = this.addNode({ mesh: mesh });
        this.addSceneNode(node);
    };
    GltfBuilder.prototype.createGltfTexts = function (pointsArrayArray, scale, bcf) {
        var _this = this;
        pointsArrayArray.forEach(function (pointsArray) {
            pointsArray.forEach(function (points) {
                var lineBuilder = new LinesBuilder_1.LinesBuilder(points.length, points.length, scale, gltf_1.LineType.LINE_STRIP, bcf);
                points.forEach(function (point) {
                    var index = lineBuilder.addVertex(point);
                    lineBuilder.addIndex(index);
                });
                lineBuilder.buildGltf(_this);
            });
        });
    };
    GltfBuilder.prototype.build = function () {
        return {
            scene: 0,
            scenes: [{ nodes: this.sceneNodes }],
            nodes: this.nodes,
            meshes: this.meshes,
            buffers: this.buffers,
            bufferViews: this.bufferViews,
            accessors: this.accessors,
            materials: this.materials,
            asset: {
                version: '2.0'
            }
        };
    };
    return GltfBuilder;
}());
exports.GltfBuilder = GltfBuilder;
