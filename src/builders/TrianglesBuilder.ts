import { checkExtents } from '../commands/checkExtents'
import { convertPointObjectToPoint } from '../commands/convertPointObjectToPoint'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { BaseColourFactor, Extent, Point, PointObject, TriangleType, Triangles } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class TrianglesBuilder {
    vertices: Float32Array
    indexes: Uint16Array
    normals: Float32Array
    extent: Extent
    vertexCounter: number = -1
    indexCounter: number = -1
    normalCounter: number = -1

    constructor(
        private verticesCount: number,
        private indexesCount: number,
        private normalsCount: number,
        private scale: number = 1,
        private mode: TriangleType,
        private baseColorFactor?: BaseColourFactor
    ) {
        this.vertices = new Float32Array(verticesCount * 3)
        this.indexes = new Uint16Array(indexesCount)
        this.normals = new Float32Array(normalsCount * 3)
        this.extent = initialiseExtent()
    }

    addIndex(index: number): number {
        this.indexCounter++
        this.indexes[this.indexCounter] = index
        return this.indexCounter
    }

    addVertex(v: Point | PointObject): number {
        this.vertexCounter++
        let vertex = !Array.isArray(v) ? convertPointObjectToPoint(v) : v
        const pointOffset = this.vertexCounter * 3
        vertex = scalePoint(vertex, this.scale);
        checkExtents(vertex, this.extent)
        const [x, y, z] = vertex
        this.vertices[pointOffset] = x
        this.vertices[pointOffset + 1] = y
        this.vertices[pointOffset + 2] = z
        return this.vertexCounter
    }

    addNormal(n: Point | PointObject): number {
        this.normalCounter++
        let normal = !Array.isArray(n) ? convertPointObjectToPoint(n) : n
        const normalOffset = this.normalCounter * 3
        const [x, y, z] = normal
        this.normals[normalOffset] = x
        this.normals[normalOffset + 1] = y
        this.normals[normalOffset + 2] = z
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
        const { verticesCount, indexesCount, normalsCount, vertices, indexes, normals, extent } = this
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
        gltfBuilder.createGltfTriangles(this.build(), this.mode, this.baseColorFactor)
    }
}