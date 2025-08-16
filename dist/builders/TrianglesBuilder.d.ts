import { BaseColourFactor, Extent, Point, PointObject, TriangleType, Triangles } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class TrianglesBuilder {
    private verticesCount;
    private indexesCount;
    private normalsCount;
    private scale;
    private mode;
    private baseColorFactor?;
    vertices: Float32Array;
    indexes: Uint16Array;
    normals: Float32Array;
    extent: Extent;
    vertexCounter: number;
    indexCounter: number;
    normalCounter: number;
    constructor(verticesCount: number, indexesCount: number, normalsCount: number, scale: number, mode: TriangleType, baseColorFactor?: BaseColourFactor | undefined);
    addIndex(index: number): number;
    addVertex(v: Point | PointObject): number;
    addNormal(n: Point | PointObject): number;
    addTriangle(vertex1: Point, vertex2: Point, vertex3: Point): void;
    build(): Triangles;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
