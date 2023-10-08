import { checkExtents } from '../commands/checkExtents'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { Extent, LineType, Lines, Point } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class LinesBuilder {
    verticesCount: number
    indexesCount: number
    verticesArray: Float32Array
    indexesArray: Uint16Array
    extent: Extent
    scale: number
    mode: LineType
    indexCounter: number = -1
    vertexCounter: number = -1

    constructor(verticesCount: number, indexesCount: number, scale: number = 1, mode: LineType) {
        this.verticesCount = verticesCount
        this.indexesCount = indexesCount
        this.verticesArray = new Float32Array(verticesCount * 3)
        this.indexesArray = new Uint16Array(indexesCount)
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

    addLine(vertex1: Point, vertex2: Point): void {
        const index1 = this.addVertex(vertex1)
        const index2 = this.addVertex(vertex2)
        this.addIndex(index1)
        this.addIndex(index2)
    }

    build(): Lines {
        const vertices = Buffer.from(new Uint8Array(this.verticesArray.buffer))
        const indexes = Buffer.from(new Uint8Array(this.indexesArray.buffer))
        const { verticesCount, indexesCount, extent } = this
        return {
            verticesCount,
            indexesCount,
            vertices,
            indexes,
            extent
        }
    }

    buildGltf(gltfBuilder: GltfBuilder): void {
        gltfBuilder.createGltfLines(this.build(), this.mode)
    }
}