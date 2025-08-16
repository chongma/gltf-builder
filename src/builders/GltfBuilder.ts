import { createRandomBaseColorFactor } from '../commands/createRandomBaseColorFactor';
import {
    Base64Type,
    BaseColourFactor,
    BufferViewTarget,
    Extent,
    Gltf,
    GltfAccessor,
    GltfBuffer,
    GltfBufferView,
    GltfMaterial,
    GltfMesh,
    GltfNode,
    LineType,
    Lines,
    Point,
    PointCloud,
    TriangleType,
    Triangles
} from '../types/gltf';
import { LinesBuilder } from './LinesBuilder';

export class GltfBuilder {
    buffers: Array<GltfBuffer> = []
    bufferViews: Array<GltfBufferView> = []
    accessors: Array<GltfAccessor> = []
    meshes: Array<GltfMesh> = []
    nodes: Array<GltfNode> = []
    materials: Array<GltfMaterial> = []
    sceneNodes: Array<number> = []

    typedArrayToBase64(array: Uint8Array | Uint16Array | Float32Array): Base64Type {
        const uint8Array = new Uint8Array(array.buffer);
        let base64String
        if (typeof Buffer !== "undefined") {
            base64String = Buffer.from(uint8Array).toString("base64")
        } else {
            let binary = "";
            uint8Array.forEach(byte => (binary += String.fromCharCode(byte)));
            base64String = btoa(binary);
        }
        return { base64String, byteLength: uint8Array.byteLength };
    }

    createBuffer({ base64String, byteLength }: Base64Type): number {
        const buffer = {
            uri: `data:application/octet-stream;base64,${base64String}`,
            byteLength: byteLength
        }
        return this.addBuffer(buffer)
    }

    addBuffer(buffer: GltfBuffer): number {
        this.buffers.push(buffer)
        return this.buffers.length - 1
    }

    createBufferView(bufferId: number, { byteLength }: Base64Type, target: BufferViewTarget): number {
        const bufferView = {
            buffer: bufferId,
            byteOffset: 0,
            byteLength,
            target
        }
        return this.addBufferView(bufferView)
    }

    addBufferView(bufferView: GltfBufferView): number {
        this.bufferViews.push(bufferView)
        return this.bufferViews.length - 1
    }

    createMaterial(baseColorFactor: BaseColourFactor): number {
        const material: GltfMaterial = {
            name: 'some_material',
            pbrMetallicRoughness: {
                baseColorFactor,
                // metallicFactor: Math.random(),
                // roughnessFactor: Math.random()
            }
        }
        // const material: GltfMaterial = {
        //     name: "gold",
        //     pbrMetallicRoughness: {
        //         baseColorFactor: [1.000, 0.766, 0.336, 1.0],
        //         metallicFactor: 1.0,
        //         roughnessFactor: 0.0
        //     }
        // }
        return this.addMaterial(material)
    }

    addMaterial(material: GltfMaterial): number {
        this.materials.push(material)
        return this.materials.length - 1
    }

    createAccessorVec3(bufferView: number, count: number, extent: Extent) {
        const accessor = {
            bufferView,
            byteOffset: 0,
            componentType: 5126,
            count,
            type: 'VEC3',
            max: [extent.max[0], extent.max[1], extent.max[2]],
            min: [extent.min[0], extent.min[1], extent.min[2]]
        }
        return this.addAccessor(accessor)
    }

    createAccessorScalar(bufferView: number, count: number) {
        const accessor = {
            bufferView,
            byteOffset: 0,
            componentType: 5123,
            count: count,
            type: 'SCALAR'
        }
        return this.addAccessor(accessor)
    }

    addAccessor(accessor: GltfAccessor): number {
        this.accessors.push(accessor)
        return this.accessors.length - 1
    }

    addMesh(mesh: GltfMesh): number {
        this.meshes.push(mesh)
        return this.meshes.length - 1
    }

    addNode(node: GltfNode): number {
        this.nodes.push(node)
        return this.nodes.length - 1
    }

    addSceneNode(i: number) {
        this.sceneNodes.push(i)
    }

    createGltfPoints(pointCloud: PointCloud, bcf?: BaseColourFactor): void {
        const { verticesCount: count, extent, vertices } = pointCloud
        const base64TypeVertices: Base64Type = this.typedArrayToBase64(vertices)
        const buffer = this.createBuffer(base64TypeVertices)
        const bufferView = this.createBufferView(buffer, base64TypeVertices, BufferViewTarget.ARRAY_BUFFER)
        const accessor = this.createAccessorVec3(bufferView, count, extent)
        const baseColorFactor = bcf || createRandomBaseColorFactor()
        const material = this.createMaterial(baseColorFactor)
        const mesh = this.addMesh({
            primitives: [{
                attributes: { POSITION: accessor },
                // indices: 0
                material,
                mode: 0
            }]
        })
        const node = this.addNode({ mesh })
        this.addSceneNode(node)
    }

    createGltfLines(lines: Lines, mode: LineType, bcf?: BaseColourFactor): void {
        const { vertices, verticesCount, indexes, indexesCount, extent } = lines
        const base64TypeVertices: Base64Type = this.typedArrayToBase64(vertices)
        const base64TypeIndexes: Base64Type = this.typedArrayToBase64(indexes)
        const bufferVertices = this.createBuffer(base64TypeVertices)
        const bufferIndexes = this.createBuffer(base64TypeIndexes)
        const bufferViewVertices = this.createBufferView(bufferVertices, base64TypeVertices, BufferViewTarget.ARRAY_BUFFER)
        const bufferViewIndexes = this.createBufferView(bufferIndexes, base64TypeIndexes, BufferViewTarget.ELEMENT_ARRAY_BUFFER)
        const accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent)
        const accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount)
        const baseColorFactor = bcf || createRandomBaseColorFactor()
        const material = this.createMaterial(baseColorFactor)
        const mesh = this.addMesh({
            primitives: [{
                attributes: { POSITION: accessorVertices },
                indices: accessorIndexes,
                material,
                mode
            }]
        })
        const node = this.addNode({ mesh })
        this.addSceneNode(node)
    }

    createGltfTriangles(triangles: Triangles, mode: TriangleType, bcf?: BaseColourFactor): void {
        const { vertices, verticesCount, indexes, indexesCount, normals, normalsCount, extent } = triangles
        const base64TypeVertices: Base64Type = this.typedArrayToBase64(vertices)
        const base64TypeIndexes: Base64Type = this.typedArrayToBase64(indexes)
        const base64TypeNormals: Base64Type = this.typedArrayToBase64(normals)
        const bufferVertices = this.createBuffer(base64TypeVertices)
        const bufferIndexes = this.createBuffer(base64TypeIndexes)
        const bufferNormals = this.createBuffer(base64TypeNormals)
        const bufferViewVertices = this.createBufferView(bufferVertices, base64TypeVertices, BufferViewTarget.ARRAY_BUFFER)
        const bufferViewIndexes = this.createBufferView(bufferIndexes, base64TypeIndexes, BufferViewTarget.ELEMENT_ARRAY_BUFFER)
        const bufferViewNormals = this.createBufferView(bufferNormals, base64TypeNormals, BufferViewTarget.ARRAY_BUFFER)
        const accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent)
        const accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount)
        const accessorNormals = this.createAccessorVec3(bufferViewNormals, normalsCount, extent)
        const baseColorFactor = bcf || createRandomBaseColorFactor()
        const material = this.createMaterial(baseColorFactor)
        const mesh = this.addMesh({
            primitives: [{
                attributes: { POSITION: accessorVertices, NORMAL: accessorNormals },
                indices: accessorIndexes,
                material,
                mode
            }]
        })
        const node = this.addNode({ mesh })
        this.addSceneNode(node)
    }

    createGltfTexts(pointsArrayArray: Point[][][], scale: number, bcf?: BaseColourFactor) {
        pointsArrayArray.forEach(pointsArray => {
            pointsArray.forEach(points => {
                const lineBuilder = new LinesBuilder(points.length, points.length, scale, LineType.LINE_STRIP, bcf)
                points.forEach(point => {
                    const index = lineBuilder.addVertex(point)
                    lineBuilder.addIndex(index)
                })
                lineBuilder.buildGltf(this)
            })
        })
    }

    build(): Gltf {
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
        }
    }

}