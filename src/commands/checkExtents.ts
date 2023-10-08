import { Extent, Point } from '../types/gltf'

export function checkExtents(point: Point, extent: Extent) {
    if (point.x < extent.min.x) {
        extent.min.x = point.x
    }
    if (point.y < extent.min.y) {
        extent.min.y = point.y
    }
    if (point.z < extent.min.z) {
        extent.min.z = point.z
    }
    if (point.x > extent.max.x) {
        extent.max.x = point.x
    }
    if (point.y > extent.max.y) {
        extent.max.y = point.y
    }
    if (point.z > extent.max.z) {
        extent.max.z = point.z
    }
}