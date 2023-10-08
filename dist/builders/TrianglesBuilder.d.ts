import { Extent, Point, TriangleType, Triangles } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class TrianglesBuilder {
    verticesCount: number;
    indexesCount: number;
    normalsCount: number;
    verticesArray: Float32Array;
    indexesArray: Uint16Array;
    normalsArray: Float32Array;
    extent: Extent;
    scale: number;
    mode: TriangleType;
    vertexCounter: number;
    indexCounter: number;
    normalCounter: number;
    constructor(verticesCount: number, indexesCount: number, normalsCount: number, scale: number | undefined, mode: TriangleType);
    addIndex(index: number): number;
    addVertex(vertex: Point): number;
    addNormal(normal: Point): number;
    addTriangle(vertex1: Point, vertex2: Point, vertex3: Point): void;
    build(): Triangles;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
