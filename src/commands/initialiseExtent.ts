import { Extent } from '../types/gltf'

const BIG_NUMBER = 1000000

export function initialiseExtent(): Extent {
    return {
        min: [BIG_NUMBER, BIG_NUMBER, BIG_NUMBER],
        max: [-BIG_NUMBER, -BIG_NUMBER, -BIG_NUMBER]
    }
}