import {
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
    PointCloud,
    TriangleType,
    Triangles
} from '../types/gltf';

export class GltfBuilder {
    buffers: Array<GltfBuffer> = []
    bufferViews: Array<GltfBufferView> = []
    accessors: Array<GltfAccessor> = []
    meshes: Array<GltfMesh> = []
    nodes: Array<GltfNode> = []
    materials: Array<GltfMaterial> = []
    sceneNodes: Array<number> = []

    createBuffer(bufferRaw: Buffer): number {
        const buffer = {
            uri: `data:application/octet-stream;base64,${bufferRaw.toString('base64')}`,
            byteLength: bufferRaw.byteLength
        }
        return this.addBuffer(buffer)
    }

    addBuffer(buffer: GltfBuffer): number {
        this.buffers.push(buffer)
        return this.buffers.length - 1
    }

    createBufferView(bufferId: number, buffer: Buffer, target: BufferViewTarget): number {
        const bufferView = {
            buffer: bufferId,
            byteOffset: 0,
            byteLength: buffer.byteLength,
            target
        }
        return this.addBufferView(bufferView)
    }

    addBufferView(bufferView: GltfBufferView): number {
        this.bufferViews.push(bufferView)
        return this.bufferViews.length - 1
    }

    createMaterial(): number {
        const material: GltfMaterial = {
            name: 'some_material',
            pbrMetallicRoughness: {
                baseColorFactor: [Math.random(), Math.random(), Math.random(), Math.random()],
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

    createGltfPoints(pointCloud: PointCloud): void {
        const { verticesCount: count, extent, vertices: pc_buffer } = pointCloud
        const buffer = this.createBuffer(pc_buffer)
        const bufferView = this.createBufferView(buffer, pc_buffer, BufferViewTarget.ARRAY_BUFFER)
        const accessor = this.createAccessorVec3(bufferView, count, extent)
        const material = this.createMaterial()
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

    createGltfLines(lines: Lines, mode: LineType): void {
        const { vertices, verticesCount, indexes, indexesCount, extent } = lines
        const bufferVertices = this.createBuffer(vertices)
        const bufferIndexes = this.createBuffer(indexes)
        const bufferViewVertices = this.createBufferView(bufferVertices, vertices, BufferViewTarget.ARRAY_BUFFER)
        const bufferViewIndexes = this.createBufferView(bufferIndexes, indexes, BufferViewTarget.ELEMENT_ARRAY_BUFFER)
        const accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent)
        const accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount)
        const material = this.createMaterial()
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

    createGltfTriangles(triangles: Triangles, mode: TriangleType): void {
        const { vertices, verticesCount, indexes, indexesCount, normals, normalsCount, extent } = triangles
        const bufferVertices = this.createBuffer(vertices)
        const bufferIndexes = this.createBuffer(indexes)
        const bufferNormals = this.createBuffer(normals)
        const bufferViewVertices = this.createBufferView(bufferVertices, vertices, BufferViewTarget.ARRAY_BUFFER)
        const bufferViewIndexes = this.createBufferView(bufferIndexes, indexes, BufferViewTarget.ELEMENT_ARRAY_BUFFER)
        const bufferViewNormals = this.createBufferView(bufferNormals, normals, BufferViewTarget.ARRAY_BUFFER)
        const accessorVertices = this.createAccessorVec3(bufferViewVertices, verticesCount, extent)
        const accessorIndexes = this.createAccessorScalar(bufferViewIndexes, indexesCount)
        const accessorNormals = this.createAccessorVec3(bufferViewNormals, normalsCount, extent)
        const material = this.createMaterial()
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