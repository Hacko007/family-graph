class Box {
    private _x: number;
    private _y: number;
    private _height: number;
    private _width: number;
    private _style: string;

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

    createRect(): any {
        var v = this.getNode('rect',
            {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rx: 30,
                ry: 10,
                fill: 'pink',
                stroke: 'purple',
                strokeWidth: 7
            });
        return v;
    }

    private getNode(tag: string, attr: any): any {
        let b = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (var p in attr)
            b.setAttributeNS(null, p, attr[p]);
        return b;
    }
}