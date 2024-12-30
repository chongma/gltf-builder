import { BaseColourFactor } from "../types/gltf";

export function createRandomBaseColorFactor(): BaseColourFactor {
    return [Math.random(), Math.random(), Math.random(), Math.random()]
}