/// <reference types="node" />
export declare const scale = 10000;
export type Point = [number, number, number];
export interface PointObject {
    x: number;
    y: number;
    z: number;
}
export interface Extent {
    max: Point;
    mid?: Point;
    min: Point;
}
export interface PointCloud {
    vertices: Buffer;
    verticesCount: number;
    extent: Extent;
}
export interface Lines {
    vertices: Buffer;
    indexes: Buffer;
    verticesCount: number;
    indexesCount: number;
    extent: Extent;
}
export interface Triangles {
    vertices: Buffer;
    indexes: Buffer;
    normals: Buffer;
    verticesCount: number;
    indexesCount: number;
    normalsCount: number;
    extent: Extent;
}
export interface Line {
    start: Point;
    end: Point;
}
export interface GltfMesh {
    primitives: Array<{
        attributes: {
            POSITION: number;
            NORMAL?: number;
        };
        indices?: number;
        mode: number;
        material?: number;
    }>;
}
export interface GltfBuffer {
    uri: string;
    byteLength: number;
}
export interface GltfBufferView {
    buffer: number;
    byteOffset: number;
    byteLength: number;
    target: number;
}
export interface GltfAccessor {
    bufferView: number;
    byteOffset: number;
    componentType: number;
    count: number;
    type: string;
    max?: Array<number>;
    min?: Array<number>;
}
export interface GltfNode {
    mesh: number;
}
export interface GltfScene {
    nodes: Array<number>;
}
export interface GltfAsset {
    version: string;
}
export interface GltfMaterial {
    name: string;
    pbrMetallicRoughness: {
        baseColorFactor?: Array<number>;
        metallicFactor?: number;
        roughnessFactor?: number;
        baseColorTexture?: {
            index: number;
            texCoord: number;
        };
    };
}
export interface Gltf {
    scene: number;
    scenes: Array<GltfScene>;
    nodes: Array<GltfNode>;
    meshes: Array<GltfMesh>;
    buffers: Array<GltfBuffer>;
    bufferViews: Array<GltfBufferView>;
    accessors: Array<GltfAccessor>;
    materials: Array<GltfMaterial>;
    asset: GltfAsset;
}
export declare enum LineType {
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3
}
export declare enum TriangleType {
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6
}
export declare enum BufferViewTarget {
    ARRAY_BUFFER = 34962,
    ELEMENT_ARRAY_BUFFER = 34963
}
