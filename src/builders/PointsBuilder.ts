import { checkExtents } from '../commands/checkExtents'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { Extent, Point, PointCloud } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class PointsBuilder {
    verticesCount: number
    verticesArray: Float32Array
    extent: Extent
    scale: number
    vertexCounter: number = -1

    constructor(verticesCount: number, scale: number = 1) {
        this.verticesCount = verticesCount
        this.verticesArray = new Float32Array(verticesCount * 3)
        this.extent = initialiseExtent()
        this.scale = scale
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

    addVertices(vertices: Point[]): void {
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
        gltfBuilder.createGltfPoints(this.build())
    }
}