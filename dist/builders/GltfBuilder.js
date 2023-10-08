"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GltfBuilder = void 0;
var gltf_1 = require("../types/gltf");
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
    GltfBuilder.prototype.createBuffer = function (bufferRaw) {
        var buffer = {
            uri: "data:application/octet-stream;base64,".concat(bufferRaw.toString('base64')),
            byteLength: bufferRaw.byteLength
        };
        return this.addBuffer(buffer);
    };
    GltfBuilder.prototype.addBuffer = function (buffer) {
        this.buffers.push(buffer);
        return this.buffers.length - 1;
    };
    GltfBuilder.prototype.createBufferView = function (bufferId, buffer, target) {
        var bufferView = {
            buffer: bufferId,
            byteOffset: 0,
            byteLength: buffer.byteLength,
            target: target
        };
        return this.addBufferView(bufferView);
    };
    GltfBuilder.prototype.addBufferView = function (bufferView) {
        this.bufferViews.push(bufferView);
        return this.bufferViews.length - 1;
    };
    GltfBuilder.prototype.createMaterial = function () {
        var material = {
            name: 'some_material',
            pbrMetallicRoughness: {
                baseColorFactor: [Math.random(), Math.random(), Math.random(), Math.random()],
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
            max: [extent.max.x, extent.max.y, extent.max.z],
            min: [extent.min.x, extent.min.y, extent.min.z]
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
    GltfBuilder.prototype.createGltfPoints = function (pointCloud) {
        var count = pointCloud.verticesCount, extent = pointCloud.extent, pc_buffer = pointCloud.vertices;
        var buffer = this.createBuffer(pc_buffer);
        var bufferView = this.createBufferView(buffer, pc_buffer, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var accessor = this.createAccessorVec3(bufferView, count, extent);
        var mesh = this.addMesh({
            primitives: [{
                    attributes: { POSITION: accessor },
                    // indices: 0
                    mode: 0
                }]
        });
        var node = this.addNode({ mesh: mesh });
        this.addSceneNode(node);
    };
    GltfBuilder.prototype.createGltfLines = function (lines, mode) {
        var vertices = lines.vertices, verticesCount = lines.verticesCount, indexes = lines.indexes, indexesCount = lines.indexesCount, extent = lines.extent;
        var bufferVertices = this.createBuffer(vertices);
        var bufferIndexes = this.createBuffer(indexes);
        var bufferViewVertices = this.createBufferView(bufferVertices, vertices, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var bufferViewIndexes = this.createBufferView(bufferIndexes, indexes, gltf_1.BufferViewTarget.ELEMENT_ARRAY_BUFFER);
        var accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent);
        var accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount);
        var material = this.createMaterial();
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
    GltfBuilder.prototype.createGltfTriangles = function (triangles, mode) {
        var vertices = triangles.vertices, verticesCount = triangles.verticesCount, indexes = triangles.indexes, indexesCount = triangles.indexesCount, normals = triangles.normals, normalsCount = triangles.normalsCount, extent = triangles.extent;
        var bufferVertices = this.createBuffer(vertices);
        var bufferIndexes = this.createBuffer(indexes);
        var bufferNormals = this.createBuffer(normals);
        var bufferViewVertices = this.createBufferView(bufferVertices, vertices, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var bufferViewIndexes = this.createBufferView(bufferIndexes, indexes, gltf_1.BufferViewTarget.ELEMENT_ARRAY_BUFFER);
        var bufferViewNormals = this.createBufferView(bufferNormals, normals, gltf_1.BufferViewTarget.ARRAY_BUFFER);
        var accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent);
        var accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount);
        var accessorNormals = this.createAccessorVec3(bufferViewNormals, normalsCount, extent);
        var material = this.createMaterial();
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
