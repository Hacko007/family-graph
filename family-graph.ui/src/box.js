var BoxHorizontalSpace = 50;
var BoxVerticalSpace = 60;
var BoxWidth = 250;
var Box = /** @class */ (function () {
    function Box() {
        this._x = 0;
        this._y = 0;
        this._height = 100;
        this._width = BoxWidth;
        this._bgColor = "gray";
        this._boxClass = "unknown-box";
    }
    Object.defineProperty(Box.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "style", {
        get: function () {
            return this._style;
        },
        set: function (value) {
            this._style = value;
        },
        enumerable: true,
        configurable: true
    });
    Box.prototype.connectTo = function (boxes) {
        var lines = new Array();
        if (!boxes)
            return lines;
        for (var i in boxes) {
            var box = boxes[i];
            var line = PathHelper.drawLine(this, box);
            lines.push(line);
        }
        return lines;
    };
    Box.prototype.connectToPoint = function (point) {
        return PathHelper.drawLineFrom(point, this);
    };
    Box.prototype.create = function () {
        var rect = PathHelper.getNode('rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: 7,
            ry: 5,
            fill: this._bgColor,
            stroke: 'black',
            strokeWidth: 2
        });
        return [rect];
    };
    Box.makeSpaceHorizontally = function (boxes) {
        for (var i in boxes) {
            var box1 = boxes[i];
            for (var j in boxes) {
                if (i == j)
                    continue;
                var box2 = boxes[j];
                if (box1.overlapping(box2) || box2.overlapping(box1)) {
                    console.log(box1);
                    console.log(box2);
                    if (box2.x >= box1.x) {
                        box2.x = box1.x + box1.width + BoxHorizontalSpace;
                    }
                    else {
                        box1.x = box2.x + box2.width + BoxHorizontalSpace;
                    }
                    console.log(box1);
                    console.log(box2);
                }
            }
        }
    };
    Box.prototype.overlapping = function (b2) {
        return (this.x <= b2.x && b2.x <= (this.x + this.width + BoxHorizontalSpace)) &&
            (this.y <= b2.y && b2.y <= (this.y + this.height + BoxVerticalSpace));
    };
    return Box;
}());
//# sourceMappingURL=box.js.map