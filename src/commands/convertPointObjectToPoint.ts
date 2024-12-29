import { Point, PointObject } from "../types/gltf";

export function convertPointObjectToPoint(pointObject: PointObject): Point {
    return [pointObject.x, pointObject.y, pointObject.z]
}