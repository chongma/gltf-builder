import { checkExtents } from '../commands/checkExtents'
import { convertPointObjectToPoint } from '../commands/convertPointObjectToPoint'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { BaseColourFactor, Extent, Point, PointCloud, PointObject } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class PointsBuilder {
    verticesArray: Float32Array
    extent: Extent
    vertexCounter: number = -1

    constructor(
        private verticesCount: number, 
        private scale: number = 1, 
        private baseColorFactor?: BaseColourFactor
    ) {
        this.verticesCount = verticesCount
        this.verticesArray = new Float32Array(verticesCount * 3)
        this.extent = initialiseExtent()
        this.scale = scale
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

    addVertices(vertices: Point[] | PointObject[]): void {
        vertices.map(vertex => this.addVertex(vertex))
    }

    build(): PointCloud {
        const vertices = Buffer.from(new Uint8Array(this.verticesArray.buffer))
        const { verticesCount, extent } = this
        return {
            verticesCount,
            vertices,
            extent
        }
    }

    buildGltf(gltfBuilder: GltfBuilder): void {
        gltfBuilder.createGltfPoints(this.build(), this.baseColorFactor)
    }
}