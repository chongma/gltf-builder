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

            let currentX = 0;
            let currentY = 0;

            for (let command of path.commands) {
                if (command.type === 'M') {
                    // moveTo: start new polyline
                    if (points.length > 0) pointsArray.push(points);
                    points = [to3D(command.x, command.y)];
                    currentX = command.x;
                    currentY = command.y;
                }
                else if (command.type === 'L') {
                    points.push(to3D(command.x, command.y));
                    currentX = command.x;
                    currentY = command.y;
                }
                else if (command.type === 'Q') {
                    // Quadratic Bézier curve
                    let x0 = currentX, y0 = currentY;
                    let x1 = command.x1, y1 = command.y1;
                    let x2 = command.x, y2 = command.y;

                    for (let i = 1; i <= curveSteps; i++) {
                        let t = i / curveSteps;
                        let x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
                        let y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
                        points.push(to3D(x, y));
                    }
                    currentX = x2;
                    currentY = y2;
                }
                else if (command.type === 'C') {
                    // Cubic Bézier curve
                    let x0 = currentX, y0 = currentY;
                    let x1 = command.x1, y1 = command.y1;
                    let x2 = command.x2, y2 = command.y2;
                    let x3 = command.x, y3 = command.y;

                    for (let i = 1; i <= curveSteps; i++) {
                        let t = i / curveSteps;
                        let mt = 1 - t;
                        let x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
                        let y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
                        points.push(to3D(x, y));
                    }
                    currentX = x3;
                    currentY = y3;
                }
                else if (command.type === 'Z') {
                    if (points.length > 0) {
                        points.push(points[0]); // close the loop
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