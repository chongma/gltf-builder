import { Extent, LineType, Lines, Point, PointObject } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class LinesBuilder {
    verticesCount: number;
    indexesCount: number;
    verticesArray: Float32Array;
    indexesArray: Uint16Array;
    extent: Extent;
    scale: number;
    mode: LineType;
    indexCounter: number;
    vertexCounter: number;
    constructor(verticesCount: number, indexesCount: number, scale: number | undefined, mode: LineType);
    addIndex(index: number): number;
    addVertex(v: Point | PointObject): number;
    addLine(vertex1: Point, vertex2: Point): void;
    build(): Lines;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
