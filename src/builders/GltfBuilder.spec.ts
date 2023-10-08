import { LineType } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'
import { LinesBuilder } from './LinesBuilder'
import { PointsBuilder } from './PointsBuilder'

describe('Gltf builder', () => {
    const vertices = [
        { x: 1, y: 2, z: 3 },
        { x: 2, y: 3, z: 4 },
        { x: 5, y: 6, z: 7 }
    ]
    const scale = 1
    it('Draw some points', () => {
        const gltfBuilder = new GltfBuilder()
        const verticesCount = vertices.length
        const pointsBuilder = new PointsBuilder(verticesCount, scale)
        pointsBuilder.addVertices(vertices)
        pointsBuilder.buildGltf(gltfBuilder)
        const gltf = gltfBuilder.build()
        console.log(JSON.stringify(gltf))
    })
    it('Draw some test lines', () => {
        const gltfBuilder = new GltfBuilder()
        const verticesCount = vertices.length
        const indexesCount = vertices.length
        const lineBuilder = new LinesBuilder(verticesCount, indexesCount, scale, LineType.LINE_STRIP)
        vertices.forEach(vertex => {
            const index = lineBuilder.addVertex(vertex)
            lineBuilder.addIndex(index)
        })
        lineBuilder.buildGltf(gltfBuilder)
        const gltf = gltfBuilder.build()
        console.log(JSON.stringify(gltf))
    })
    it('Draw some triangles', () => {

    })
})