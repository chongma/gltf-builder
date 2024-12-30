import { createRandomBaseColorFactor } from '../commands/createRandomBaseColorFactor'
import { LineType, Point, TriangleType } from '../types/gltf'
import { GltfBuilder } from './GltfBuilder'
import { LinesBuilder } from './LinesBuilder'
import { PointsBuilder } from './PointsBuilder'
import { TrianglesBuilder } from './TrianglesBuilder'

const baseColorFactor = createRandomBaseColorFactor()

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
        const lineBuilder = new LinesBuilder(verticesCount, indexesCount, undefined, LineType.LINE_STRIP, baseColorFactor)
        vertices.forEach(vertex => {
            const index = lineBuilder.addVertex(vertex)
            lineBuilder.addIndex(index)
        })
        lineBuilder.buildGltf(gltfBuilder)
        const gltf = gltfBuilder.build()
        expect(gltf.materials[0].pbrMetallicRoughness.baseColorFactor).toBe(baseColorFactor)
        console.log(JSON.stringify(gltf))
    })
    it('Draw some triangles', () => {
        const simple3DObject = {
            vertices: [
              // Vertex positions (x, y, z)
              [0, 0, 0],  // Vertex 0: Bottom corner
              [1, 0, 0],  // Vertex 1: Bottom right
              [0.5, Math.sqrt(3) / 2, 0], // Vertex 2: Bottom left
              [0.5, Math.sqrt(3) / 6, Math.sqrt(2 / 3)], // Vertex 3: Top vertex
            ] as Point[],
            normals: [
              // Normals (x, y, z) - one per vertex
              [0, 0, -1],  // Normal at Vertex 0
              [0, 0, -1],  // Normal at Vertex 1
              [0, 0, -1],  // Normal at Vertex 2
              [0, 0, 1],   // Normal at Vertex 3
            ] as Point[],
            indices: [
              // Triangles (each group of 3 indices forms a triangle)
              0, 1, 2,  // Base triangle
              0, 1, 3,  // Side triangle 1
              1, 2, 3,  // Side triangle 2
              2, 0, 3,  // Side triangle 3
            ],
          };
        const gltfBuilder = new GltfBuilder()
        const verticesCount = simple3DObject.vertices.length
        const indicesCount = simple3DObject.indices.length
        const normalsCount = simple3DObject.normals.length
        const trianglesBuilder = new TrianglesBuilder(verticesCount, indicesCount, normalsCount, scale, TriangleType.TRIANGLES)
        simple3DObject.vertices.forEach(vertex => trianglesBuilder.addVertex(vertex))
        simple3DObject.normals.forEach(normal => trianglesBuilder.addNormal(normal))
        simple3DObject.indices.forEach(index => trianglesBuilder.addIndex(index))
        trianglesBuilder.buildGltf(gltfBuilder)
        const gltf = gltfBuilder.build()
        console.log(JSON.stringify(gltf))
    })
})