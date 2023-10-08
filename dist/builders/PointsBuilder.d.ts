import { Extent, Point, PointCloud } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class PointsBuilder {
    verticesCount: number;
    verticesArray: Float32Array;
    extent: Extent;
    scale: number;
    vertexCounter: number;
    constructor(verticesCount: number, scale?: number);
    addVertex(vertex: Point): number;
    addVertices(vertices: Point[]): void;
    build(): PointCloud;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
