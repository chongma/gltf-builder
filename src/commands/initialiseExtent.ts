import { Extent } from '../types/gltf'

const BIG_NUMBER = 1000000

export function initialiseExtent(): Extent {
    return {
        min: { x: BIG_NUMBER, y: BIG_NUMBER, z: BIG_NUMBER },
        max: { x: -BIG_NUMBER, y: -BIG_NUMBER, z: -BIG_NUMBER }
    }
}