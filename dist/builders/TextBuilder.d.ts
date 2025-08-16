import { Font } from 'opentype.js';
import { BaseColourFactor, Point } from '../types/gltf';
import { GltfBuilder } from './GltfBuilder';
export declare class TextBuilder {
    private scale;
    private baseColorFactor?;
    font: Font;
    pointsArrayArray: Point[][][];
    constructor(scale?: number, baseColorFactor?: BaseColourFactor | undefined);
    addText(origin: Point, direction: Point, text: string, fontSize?: number, curveSteps?: number): void;
    buildGltf(gltfBuilder: GltfBuilder): void;
}
