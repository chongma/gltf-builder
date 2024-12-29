import { Extent, Point, PointCloud, PointObject } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class PointsBuilder {
    verticesCount: number;
    verticesArray: Float32Array;
    extent: Extent;
    scale: number;
    vertexCounter: number;
    constructor(verticesCount: number, scale?: number);
    addVertex(v: Point | PointObject): number;
    addVertices(vertices: Point[] | PointObject[]): void;
    build(): PointCloud;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
