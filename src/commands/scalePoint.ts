import { Point } from '../types/gltf';

export function scalePoint(point: Point, scale: number): Point {
    return [point[0] / scale, point[1] / scale, point[2] / scale]
}