/// <reference types="node" />
import { BufferViewTarget, Extent, Gltf, GltfAccessor, GltfBuffer, GltfBufferView, GltfMaterial, GltfMesh, GltfNode, LineType, Lines, PointCloud, TriangleType, Triangles } from '../types/gltf';
export declare class GltfBuilder {
    buffers: Array<GltfBuffer>;
    bufferViews: Array<GltfBufferView>;
    accessors: Array<GltfAccessor>;
    meshes: Array<GltfMesh>;
    nodes: Array<GltfNode>;
    materials: Array<GltfMaterial>;
    sceneNodes: Array<number>;
    createBuffer(bufferRaw: Buffer): number;
    addBuffer(buffer: GltfBuffer): number;
    createBufferView(bufferId: number, buffer: Buffer, target: BufferViewTarget): number;
    addBufferView(bufferView: GltfBufferView): number;
    createMaterial(): number;
    addMaterial(material: GltfMaterial): number;
    createAccessorVec3(bufferView: number, count: number, extent: Extent): number;
    createAccessorScalar(bufferView: number, count: number): number;
    addAccessor(accessor: GltfAccessor): number;
    addMesh(mesh: GltfMesh): number;
    addNode(node: GltfNode): number;
    addSceneNode(i: number): void;
    createGltfPoints(pointCloud: PointCloud): void;
    createGltfLines(lines: Lines, mode: LineType): void;
    createGltfTriangles(triangles: Triangles, mode: TriangleType): void;
    build(): Gltf;
}
