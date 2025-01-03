import { checkExtents } from '../commands/checkExtents'
import { convertPointObjectToPoint } from '../commands/convertPointObjectToPoint'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { BaseColourFactor, Extent, LineType, Lines, Point, PointObject } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class LinesBuilder {
    verticesArray: Float32Array
    indexesArray: Uint16Array
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
        this.verticesArray = new Float32Array(verticesCount * 3)
        this.indexesArray = new Uint16Array(indexesCount)
        this.extent = initialiseExtent()
    }

    addIndex(index: number): number {
        this.indexCounter++
        this.indexesArray[this.indexCounter] = index
        return this.indexCounter
    }

    addVertex(v: Point | PointObject): number {
        this.vertexCounter++
        let vertex = !Array.isArray(v) ? convertPointObjectToPoint(v) : v
        vertex = scalePoint(vertex, this.scale);
        checkExtents(vertex, this.extent)
        const pointOffset = this.vertexCounter * 3
        this.verticesArray[pointOffset] = vertex[0]
        this.verticesArray[pointOffset + 1] = vertex[1]
        this.verticesArray[pointOffset + 2] = vertex[2]
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
        gltfBuilder.createGltfLines(this.build(), this.mode, this.baseColorFactor)
    }
}