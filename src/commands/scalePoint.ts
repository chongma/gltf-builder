import { Point } from '../types/gltf';

export function scalePoint(point: Point, scale: number): Point {
    const [x, y, z] = point
    return [x / scale, y / scale, z / scale]
}