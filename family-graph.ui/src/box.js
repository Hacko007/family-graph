var Box = /** @class */ (function () {
    function Box() {
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
        // if (boxes == null || boxes.length == 0) return null;
        for (var i in boxes) {
            var box = boxes[i];
            var line = this.drawLine(this, box);
            lines.push(line);
        }
        return lines;
    };
    Box.prototype.drawLine = function (box1, box2) {
        var dx1 = box1.x + (box1.width / 2);
        var dy1 = box1.y + (box1.height / 2);
        var dx2 = box2.x + (box2.width / 2);
        var dy2 = box2.y + (box2.height / 2);
        var dy = ((dy1 + dy2) / 2);
        var path = "M " + dx1 + " " + dy1 +
            " L " + dx1 + " " + dy +
            " L " + dx2 + " " + dy +
            " L " + dx2 + " " + dy2 +
            " ";
        console.log(path);
        var v = this.getNode('path', {
            d: path,
            class: 'path'
        });
        return v;
    };
    ;
    Box.prototype.create = function () {
        var rect = this.getNode('rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: 30,
            ry: 10,
            fill: this._bgColor,
            stroke: 'black',
            strokeWidth: 7
        });
        return [rect];
    };
    Box.prototype.getNode = function (tag, attr) {
        var b = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (var p in attr)
            b.setAttributeNS(null, p, attr[p]);
        return (b);
    };
    return Box;
}());
//# sourceMappingURL=box.js.map