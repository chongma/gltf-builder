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
        if (fontSize === void 0) { fontSize = 50; }
        if (curveSteps === void 0) { curveSteps = 10; }
        var forward = (0, maths_1.normalize)(direction);
        var tmpUp = Math.abs(forward[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
        var right = (0, maths_1.normalize)((0, maths_1.cross)(tmpUp, forward));
        var up = (0, maths_1.cross)(forward, right);
        var path = this.font.getPath(text, 0, 0, fontSize);
        var pointsArray = [];
        var points = [];
        function to3D(x, y) {
            return (0, maths_1.add3)(origin, (0, maths_1.scale3)(right, x), (0, maths_1.scale3)(up, -y));
        }
        for (var _i = 0, _a = path.commands; _i < _a.length; _i++) {
            var command = _a[_i];
            if (command.type === 'M') {
                // moveTo: start new polyline
                if (points.length > 0)
                    pointsArray.push(points);
                points = [to3D(command.x, command.y)];
            }
            else if (command.type === 'L') {
                points.push(to3D(command.x, command.y));
            }
            else if (command.type === 'Q') {
                // quadratic curve → subdivide into straight segments
                var prev = points[points.length - 1];
                for (var t = 0.1; t <= 1.0; t += 1 / curveSteps) {
                    var x = (1 - t) * (1 - t) * prev[0] + 2 * (1 - t) * t * command.x1 + t * t * command.x;
                    var y = (1 - t) * (1 - t) * prev[1] + 2 * (1 - t) * t * command.y1 + t * t * command.y;
                    points.push(to3D(x, y));
                }
            }
            else if (command.type === 'C') {
                // cubic curve → subdivide into straight segments
                var prev = points[points.length - 1];
                for (var t = 0.1; t <= 1.0; t += 1 / curveSteps) {
                    var x = Math.pow(1 - t, 3) * prev[0] +
                        3 * Math.pow(1 - t, 2) * t * command.x1 +
                        3 * (1 - t) * t * t * command.x2 +
                        Math.pow(t, 3) * command.x;
                    var y = Math.pow(1 - t, 3) * prev[1] +
                        3 * Math.pow(1 - t, 2) * t * command.y1 +
                        3 * (1 - t) * t * t * command.y2 +
                        Math.pow(t, 3) * command.y;
                    points.push(to3D(x, y));
                }
            }
            else if (command.type === 'Z') {
                // close path
                if (points.length > 0) {
                    points.push(points[0]);
                    pointsArray.push(points);
                    points = [];
                }
            }
        }
        if (points.length > 0)
            pointsArray.push(points);
        this.pointsArrayArray.push(pointsArray);
    };
    TextBuilder.prototype.buildGltf = function (gltfBuilder) {
        gltfBuilder.createGltfTexts(this.pointsArrayArray, this.scale, this.baseColorFactor);
    };
    return TextBuilder;
}());
exports.TextBuilder = TextBuilder;
