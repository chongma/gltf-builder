import { Point } from '../types/gltf';

export function scalePoint(point: Point, scale: number): Point {
    return { x: point.x / scale, y: point.y / scale, z: point.z / scale }
}