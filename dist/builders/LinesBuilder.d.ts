import { BaseColourFactor, Extent, LineType, Lines, Point, PointObject } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class LinesBuilder {
    private verticesCount;
    private indexesCount;
    private scale;
    private mode;
    private baseColorFactor?;
    vertices: Float32Array;
    indexes: Uint16Array;
    extent: Extent;
    indexCounter: number;
    vertexCounter: number;
    constructor(verticesCount: number, indexesCount: number, scale: number, mode: LineType, baseColorFactor?: BaseColourFactor | undefined);
    addIndex(index: number): number;
    addVertex(v: Point | PointObject): number;
    addLine(vertex1: Point, vertex2: Point): void;
    build(): Lines;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
