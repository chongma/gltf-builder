[![npm version](https://badge.fury.io/js/@chongma%2Fgltf-builder.svg)](https://www.npmjs.com/package/@chongma/gltf-builder)

# Gltf builder

The spec file `GltfBuilder.spec.ts` contains examples of usage.

## Writing points
Use a points builder to build the points structure.  Then build it using the GltfBuilder
```js
const gltfBuilder = new GltfBuilder()
const verticesCount = vertices.length
const pointsBuilder = new PointsBuilder(verticesCount, scale)
pointsBuilder.addVertices(vertices)
pointsBuilder.buildGltf(gltfBuilder)
const gltf = gltfBuilder.build()
console.log(JSON.stringify(gltf))
```
## Writing lines
Use a line builder to build the line structure.  Then build it using the GltfBuilder
```js
const gltfBuilder = new GltfBuilder()
const verticesCount = vertices.length
const indexesCount = vertices.length
const lineBuilder = new LinesBuilder(verticesCount, indexesCount, scale, LineType.LINE_STRIP)
vertices.forEach(vertex => {
    const index = lineBuilder.addVertex(vertex)
    lineBuilder.addIndex(index)
})
lineBuilder.buildGltf(gltfBuilder)
const gltf = gltfBuilder.build()
console.log(JSON.stringify(gltf))
```

## Writing triangles


## Writing Gltf to file
The Gltf can be written to file by stringifying the JSON object
```js
const gltfBuilder = new GltfBuilder()
// add contents
const gltf = gltfBuilder.build()
fs.writeFileSync(path, JSON.stringify(gltf));
```
