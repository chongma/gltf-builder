import { Point } from '../types/gltf';
export declare function normalize(v: Point): Point;
export declare function cross(a: Point, b: Point): Point;
export declare function add3(...vs: Point[]): Point;
export declare function scale3(v: Point, s: number): Point;
