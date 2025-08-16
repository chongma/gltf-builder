import { Base64Type, BaseColourFactor, BufferViewTarget, Extent, Gltf, GltfAccessor, GltfBuffer, GltfBufferView, GltfMaterial, GltfMesh, GltfNode, LineType, Lines, Point, PointCloud, TriangleType, Triangles } from '../types/gltf';
export declare class GltfBuilder {
    buffers: Array<GltfBuffer>;
    bufferViews: Array<GltfBufferView>;
    accessors: Array<GltfAccessor>;
    meshes: Array<GltfMesh>;
    nodes: Array<GltfNode>;
    materials: Array<GltfMaterial>;
    sceneNodes: Array<number>;
    typedArrayToBase64(array: Uint8Array | Uint16Array | Float32Array): Base64Type;
    createBuffer({ base64String, byteLength }: Base64Type): number;
    addBuffer(buffer: GltfBuffer): number;
    createBufferView(bufferId: number, { byteLength }: Base64Type, target: BufferViewTarget): number;
    addBufferView(bufferView: GltfBufferView): number;
    createMaterial(baseColorFactor: BaseColourFactor): number;
    addMaterial(material: GltfMaterial): number;
    createAccessorVec3(bufferView: number, count: number, extent: Extent): number;
    createAccessorScalar(bufferView: number, count: number): number;
    addAccessor(accessor: GltfAccessor): number;
    addMesh(mesh: GltfMesh): number;
    addNode(node: GltfNode): number;
    addSceneNode(i: number): void;
    createGltfPoints(pointCloud: PointCloud, bcf?: BaseColourFactor): void;
    createGltfLines(lines: Lines, mode: LineType, bcf?: BaseColourFactor): void;
    createGltfTriangles(triangles: Triangles, mode: TriangleType, bcf?: BaseColourFactor): void;
    createGltfTexts(pointsArrayArray: Point[][][], scale: number, bcf?: BaseColourFactor): void;
    build(): Gltf;
}
