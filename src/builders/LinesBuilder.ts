import { checkExtents } from '../commands/checkExtents'
import { convertPointObjectToPoint } from '../commands/convertPointObjectToPoint'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { BaseColourFactor, Extent, LineType, Lines, Point, PointObject } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class LinesBuilder {
    vertices: Float32Array
    indexes: Uint16Array
    extent: Extent
    indexCounter: number = -1
    vertexCounter: number = -1

    constructor(
        private verticesCount: number,
        private indexesCount: number,
        private scale: number = 1,
        private mode: LineType,
        private baseColorFactor?: BaseColourFactor
    ) {
        this.vertices = new Float32Array(verticesCount * 3)
        this.indexes = new Uint16Array(indexesCount)
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
        vertex = scalePoint(vertex, this.scale);
        checkExtents(vertex, this.extent)
        const pointOffset = this.vertexCounter * 3
        const [x, y, z] = vertex
        this.vertices[pointOffset] = x
        this.vertices[pointOffset + 1] = y
        this.vertices[pointOffset + 2] = z
        return this.vertexCounter
    }

    addLine(vertex1: Point, vertex2: Point): void {
        const index1 = this.addVertex(vertex1)
        const index2 = this.addVertex(vertex2)
        this.addIndex(index1)
        this.addIndex(index2)
    }

    build(): Lines {
        const { verticesCount, indexesCount, extent, vertices, indexes } = this
        return {
            verticesCount,
            indexesCount,
            vertices,
            indexes,
            extent
        }
    }

    buildGltf(gltfBuilder: GltfBuilder): void {
        gltfBuilder.createGltfLines(this.build(), this.mode, this.baseColorFactor)
    }
}