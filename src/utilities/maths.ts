import { Point } from '../types/gltf';

export function normalize(v: Point): Point {
    const len = Math.hypot(...v);
    return v.map(x => x / len) as Point;
}

export function cross(a: Point, b: Point): Point {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

export function add3(...vs: Point[]) {
    return vs.reduce<Point>((acc, v) => [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]], [0, 0, 0]);
}

export function scale3(v: Point, s: number): Point {
    return [v[0] * s, v[1] * s, v[2] * s];
}