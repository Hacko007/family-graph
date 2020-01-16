class Box {
    private _x: number;
    private _y: number;
    private _height: number;
    private _width: number;
    private _style: string;
    _bgColor: string = "gray";
    _boxClass: string =  "unknown-box";
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

    get style(): string {
        return this._style;
    }

    set style(value: string) {
        this._style = value;
    }

    connectTo(boxes: Box[]): any {
        var lines = new Array();

    
       // if (boxes == null || boxes.length == 0) return null;

        for (var i in boxes) {
            let box = boxes[i];
            let line = this.drawLine(this, box);
            lines.push(line);
        }
        return lines;
    }


    private drawLine(box1: Box, box2: Box): SVGElement {

        let dx1 = box1.x + (box1.width / 2);
        let dy1 = box1.y + (box1.height/ 2);

        let dx2 = box2.x + (box2.width / 2);
        let dy2 = box2.y + (box2.height / 2);
        
        let dy = ((dy1 + dy2) / 2);
        
        let path = "M " + dx1 + " " + dy1 +
            " L " + dx1 + " " + dy +
            " L " + dx2 + " " + dy +
            " L " + dx2 + " " + dy2 +
            " ";
        
        console.log(path);
        var v = this.getNode('path',
            {
                d: path,
                class:'path'
            });
        return v;

    };

    create(): SVGElement[] {
        var rect : SVGElement = this.getNode('rect',
            {
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
        return  [rect];
    }

    protected  getNode(tag: string, attr: any): SVGElement {
        let b: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (var p in attr)
            b.setAttributeNS(null, p, attr[p]);
        return (b) as any;
    }
}