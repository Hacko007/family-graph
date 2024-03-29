﻿const BoxHorizontalSpace: number = 50;
const BoxVerticalSpace: number = 60;
const BoxWidth: number = 250;

class Box {
    private _x: number = 0;
    private _y: number = 0;
    private _height: number = 100;
    private _width: number = BoxWidth;

    private _class: string;
    _bgColor: string = "gray";
    _boxClass: string = "unknown-box";
    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get class(): string{
        return this._class;
    }

    set class(value: string) {
        this._class = value;
    }

    connectTo(boxes: Box[]): any {
        var lines = new Array();

        if (!boxes) return lines;

        for (var i in boxes) {
            let box = boxes[i];
            let line = PathHelper.drawLine(this, box);
            lines.push(line);
        }
        return lines;
    }

    connectToPoint(point: DOMPoint): SVGElement {
        return PathHelper.drawLineFrom(point, this);
    }

    create(eventPb:any): SVGElement[] {
        var rect: SVGElement = PathHelper.getNode('rect',
            {
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


    static makeSpaceHorizontally(boxes: Box[]) {
        for (var i in boxes) {
            let box1 = boxes[i];
            for (var j in boxes) {
                if (i == j) continue;

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

    overlapping(b2: Box) {
        return (this.x <= b2.x && b2.x <= (this.x + this.width + BoxHorizontalSpace)) &&
            (this.y <= b2.y && b2.y <= (this.y + this.height + BoxVerticalSpace))
            ;
    }
}