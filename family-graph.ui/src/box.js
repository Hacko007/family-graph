const BoxHorizontalSpace = 50;
const BoxVerticalSpace = 60;
const BoxWidth = 250;
class Box {
    constructor() {
        this._x = 0;
        this._y = 0;
        this._height = 100;
        this._width = BoxWidth;
        this._bgColor = "gray";
        this._boxClass = "unknown-box";
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get style() {
        return this._style;
    }
    set style(value) {
        this._style = value;
    }
    connectTo(boxes) {
        var lines = new Array();
        if (!boxes)
            return lines;
        for (var i in boxes) {
            let box = boxes[i];
            let line = PathHelper.drawLine(this, box);
            lines.push(line);
        }
        return lines;
    }
    connectToPoint(point) {
        return PathHelper.drawLineFrom(point, this);
    }
    create(eventPb) {
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
    }
    static makeSpaceHorizontally(boxes) {
        for (var i in boxes) {
            let box1 = boxes[i];
            for (var j in boxes) {
                if (i == j)
                    continue;
                let box2 = boxes[j];
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
    }
    overlapping(b2) {
        return (this.x <= b2.x && b2.x <= (this.x + this.width + BoxHorizontalSpace)) &&
            (this.y <= b2.y && b2.y <= (this.y + this.height + BoxVerticalSpace));
    }
}
//# sourceMappingURL=Box.js.map