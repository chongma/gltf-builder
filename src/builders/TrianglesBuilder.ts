import { checkExtents } from '../commands/checkExtents'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { Extent, Point, TriangleType, Triangles } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class TrianglesBuilder {
    verticesCount: number
    indexesCount: number
    normalsCount: number
    verticesArray: Float32Array
    indexesArray: Uint16Array
    normalsArray: Float32Array
    extent: Extent
    scale: number
    mode: TriangleType
    vertexCounter: number = -1
    indexCounter: number = -1
    normalCounter: number = -1

    constructor(verticesCount: number, indexesCount: number, normalsCount: number, scale: number = 1, mode: TriangleType) {
        this.verticesCount = verticesCount
        this.indexesCount = indexesCount
        this.normalsCount = normalsCount
        this.verticesArray = new Float32Array(verticesCount * 3)
        this.indexesArray = new Uint16Array(indexesCount)
        this.normalsArray = new Float32Array(normalsCount * 3)
        this.extent = initialiseExtent()
        this.scale = scale
        this.mode = mode
    }

    addIndex(index: number): number {
        this.indexCounter++
        this.indexesArray[this.indexCounter] = index
        return this.indexCounter
    }

    addVertex(vertex: Point): number {
        this.vertexCounter++
        vertex = scalePoint(vertex, this.scale);
        checkExtents(vertex, this.extent)
        const pointOffset = this.vertexCounter * 3
        this.verticesArray[pointOffset] = vertex.x
        this.verticesArray[pointOffset + 1] = vertex.y
        this.verticesArray[pointOffset + 2] = vertex.z
        return this.vertexCounter
    }

    addNormal(normal: Point): number {
        this.normalCounter++
        const normalOffset = this.normalCounter * 3
        this.verticesArray[normalOffset] = normal.x
        this.verticesArray[normalOffset + 1] = normal.y
        this.verticesArray[normalOffset + 2] = normal.z
        return this.normalCounter
    }

    addTriangle(vertex1: Point, vertex2: Point, vertex3: Point): void {
        const index1 = this.addVertex(vertex1)
        const index2 = this.addVertex(vertex2)
        const index3 = this.addVertex(vertex3)
        this.addIndex(index1)
        this.addIndex(index2)
        this.addIndex(index3)
    }

    build(): Triangles {
        const vertices = Buffer.from(new Uint8Array(this.verticesArray.buffer))
        const indexes = Buffer.from(new Uint8Array(this.indexesArray.buffer))
        const normals = Buffer.from(new Uint8Array(this.normalsArray.buffer))
        const { verticesCount, indexesCount, normalsCount, extent } = this
        return {
            verticesCount,
            indexesCount,
            normalsCount,
            vertices,
            indexes,
            normals,
            extent
        }
    }

    buildGltf(gltfBuilder: GltfBuilder): void {
        gltfBuilder.createGltfTriangles(this.build(), this.mode)
    }
}