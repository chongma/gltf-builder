import { BaseColourFactor, Extent, Point, PointCloud, PointObject } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class PointsBuilder {
    private verticesCount;
    private scale;
    private baseColorFactor?;
    verticesArray: Float32Array;
    extent: Extent;
    vertexCounter: number;
    constructor(verticesCount: number, scale?: number, baseColorFactor?: BaseColourFactor | undefined);
    addVertex(v: Point | PointObject): number;
    addVertices(vertices: Point[] | PointObject[]): void;
    build(): PointCloud;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
