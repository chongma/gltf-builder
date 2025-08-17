import opentype, { Font } from 'opentype.js'
import { BaseColourFactor, Point } from '../types/gltf';
import { add3, cross, normalize, scale3 } from '../utilities/maths';
import { GltfBuilder } from './GltfBuilder';

export class TextBuilder {
    font: Font
    pointsArrayArray: Point[][][] = []

    constructor(private scale: number = 1, private baseColorFactor?: BaseColourFactor) {
        this.font = opentype.loadSync(`${__dirname}/../fonts/Roboto-Regular.ttf`);
    }

    addText(origin: Point, direction: Point, text: string, fontSize: number = 50, curveSteps: number = 10) {
        const forward = normalize(direction);
        const tmpUp: Point = Math.abs(forward[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
        const right = normalize(cross(tmpUp, forward));
        const up = cross(forward, right);

        const pointsArray: Point[][] = [];

        let xOffset = 0; // horizontal advance for letters

        for (const char of text) {
            const glyph = this.font.charToGlyph(char);
            const path = glyph.getPath(xOffset, 0, fontSize);

            let points: Point[] = [];

            const to3D = (x: number, y: number) => {
                return add3(origin, scale3(right, x), scale3(up, -y));
            }

            for (let command of path.commands) {
                if (command.type === 'M') {
                    // moveTo: start new polyline
                    if (points.length > 0) pointsArray.push(points);
                    points = [to3D(command.x, command.y)];
                }
                else if (command.type === 'L') {
                    points.push(to3D(command.x, command.y));
                }
                else if (command.type === 'Q') {
                    // quadratic curve → subdivide into straight segments
                    let prev = points[points.length - 1];
                    for (let t = 0.1; t <= 1.0; t += 1 / curveSteps) {
                        const x = (1 - t) * (1 - t) * prev[0] + 2 * (1 - t) * t * command.x1 + t * t * command.x;
                        const y = (1 - t) * (1 - t) * prev[1] + 2 * (1 - t) * t * command.y1 + t * t * command.y;
                        points.push(to3D(x, y));
                    }
                }
                else if (command.type === 'C') {
                    // cubic curve → subdivide into straight segments
                    let prev = points[points.length - 1];
                    for (let t = 0.1; t <= 1.0; t += 1 / curveSteps) {
                        const x = Math.pow(1 - t, 3) * prev[0] +
                            3 * Math.pow(1 - t, 2) * t * command.x1 +
                            3 * (1 - t) * t * t * command.x2 +
                            Math.pow(t, 3) * command.x;
                        const y = Math.pow(1 - t, 3) * prev[1] +
                            3 * Math.pow(1 - t, 2) * t * command.y1 +
                            3 * (1 - t) * t * t * command.y2 +
                            Math.pow(t, 3) * command.y;
                        points.push(to3D(x, y));
                    }
                }
                else if (command.type === 'Z') {
                    // close path
                    if (points.length > 0) {
                        points.push(points[0]);
                        pointsArray.push(points);
                        points = [];
                    }
                }
            }

            if (points.length > 0) pointsArray.push(points)
                
            xOffset += (glyph.advanceWidth ?? 1) * (fontSize / this.font.unitsPerEm)
        }
        this.pointsArrayArray.push(pointsArray)
    }

    buildGltf(gltfBuilder: GltfBuilder): void {
        gltfBuilder.createGltfTexts(this.pointsArrayArray, this.scale, this.baseColorFactor)
    }
}