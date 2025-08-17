"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextBuilder = void 0;
var opentype_js_1 = __importDefault(require("opentype.js"));
var maths_1 = require("../utilities/maths");
var TextBuilder = /** @class */ (function () {
    function TextBuilder(scale, baseColorFactor) {
        if (scale === void 0) { scale = 1; }
        this.scale = scale;
        this.baseColorFactor = baseColorFactor;
        this.pointsArrayArray = [];
        this.font = opentype_js_1.default.loadSync("".concat(__dirname, "/../fonts/Roboto-Regular.ttf"));
    }
    TextBuilder.prototype.addText = function (origin, direction, text, fontSize, curveSteps) {
        var _a;
        if (fontSize === void 0) { fontSize = 50; }
        if (curveSteps === void 0) { curveSteps = 10; }
        var forward = (0, maths_1.normalize)(direction);
        var tmpUp = Math.abs(forward[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
        var right = (0, maths_1.normalize)((0, maths_1.cross)(tmpUp, forward));
        var up = (0, maths_1.cross)(forward, right);
        var pointsArray = [];
        var xOffset = 0; // horizontal advance for letters
        for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
            var char = text_1[_i];
            var glyph = this.font.charToGlyph(char);
            var path = glyph.getPath(xOffset, 0, fontSize);
            var points = [];
            var to3D = function (x, y) {
                return (0, maths_1.add3)(origin, (0, maths_1.scale3)(right, x), (0, maths_1.scale3)(up, -y));
            };
            var currentX = 0;
            var currentY = 0;
            for (var _b = 0, _c = path.commands; _b < _c.length; _b++) {
                var command = _c[_b];
                if (command.type === 'M') {
                    // moveTo: start new polyline
                    if (points.length > 0)
                        pointsArray.push(points);
                    points = [to3D(command.x, command.y)];
                    currentX = command.x;
                    currentY = command.y;
                }
                else if (command.type === 'L') {
                    points.push(to3D(command.x, command.y));
                    currentX = command.x;
                    currentY = command.y;
                }
                else if (command.type === 'Q') {
                    // Quadratic Bézier curve
                    var x0 = currentX, y0 = currentY;
                    var x1 = command.x1, y1 = command.y1;
                    var x2 = command.x, y2 = command.y;
                    for (var i = 1; i <= curveSteps; i++) {
                        var t = i / curveSteps;
                        var x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * x1 + t * t * x2;
                        var y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y2;
                        points.push(to3D(x, y));
                    }
                    currentX = x2;
                    currentY = y2;
                }
                else if (command.type === 'C') {
                    // Cubic Bézier curve
                    var x0 = currentX, y0 = currentY;
                    var x1 = command.x1, y1 = command.y1;
                    var x2 = command.x2, y2 = command.y2;
                    var x3 = command.x, y3 = command.y;
                    for (var i = 1; i <= curveSteps; i++) {
                        var t = i / curveSteps;
                        var mt = 1 - t;
                        var x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
                        var y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
                        points.push(to3D(x, y));
                    }
                    currentX = x3;
                    currentY = y3;
                }
                else if (command.type === 'Z') {
                    if (points.length > 0) {
                        points.push(points[0]); // close the loop
                        pointsArray.push(points);
                        points = [];
                    }
                }
            }
            if (points.length > 0)
                pointsArray.push(points);
            xOffset += ((_a = glyph.advanceWidth) !== null && _a !== void 0 ? _a : 1) * (fontSize / this.font.unitsPerEm);
        }
        this.pointsArrayArray.push(pointsArray);
    };
    TextBuilder.prototype.buildGltf = function (gltfBuilder) {
        gltfBuilder.createGltfTexts(this.pointsArrayArray, this.scale, this.baseColorFactor);
    };
    return TextBuilder;
}());
exports.TextBuilder = TextBuilder;
