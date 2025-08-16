import { checkExtents } from '../commands/checkExtents'
import { convertPointObjectToPoint } from '../commands/convertPointObjectToPoint'
import { initialiseExtent } from '../commands/initialiseExtent'
import { scalePoint } from '../commands/scalePoint'
import { BaseColourFactor, Extent, Point, PointCloud, PointObject } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'

export class PointsBuilder {
    vertices: Float32Array
    extent: Extent
    vertexCounter: number = -1

    constructor(
        private verticesCount: number,
        private scale: number = 1,
        private baseColorFactor?: BaseColourFactor
    ) {
        this.verticesCount = verticesCount
        this.vertices = new Float32Array(verticesCount * 3)
        this.extent = initialiseExtent()
        this.scale = scale
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

    addVertices(vertices: Point[] | PointObject[]): void {
        vertices.map(vertex => this.addVertex(vertex))
    }

    build(): PointCloud {
        const { verticesCount, extent, vertices } = this
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