import { checkExtents } from '../commands/checkExtents'
import { convertPointObjectToPoint } from '../commands/convertPointObjectToPoint'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { Extent, Point, PointObject, TriangleType, Triangles } from '../types/gltf'
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

    addVertex(v: Point | PointObject): number {
        this.vertexCounter++
        let vertex = !Array.isArray(v) ? convertPointObjectToPoint(v) : v
        const pointOffset = this.vertexCounter * 3
        vertex = scalePoint(vertex, this.scale);
        checkExtents(vertex, this.extent)
        this.verticesArray[pointOffset] = vertex[0]
        this.verticesArray[pointOffset + 1] = vertex[1]
        this.verticesArray[pointOffset + 2] = vertex[2]
        return this.vertexCounter
    }

    addNormal(n: Point | PointObject): number {
        this.normalCounter++
        let normal = !Array.isArray(n) ? convertPointObjectToPoint(n) : n
        const normalOffset = this.normalCounter * 3
        this.normalsArray[normalOffset] = normal[0]
        this.normalsArray[normalOffset + 1] = normal[1]
        this.normalsArray[normalOffset + 2] = normal[2]
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