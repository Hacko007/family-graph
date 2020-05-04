class PathHelper {

    // Connect two boxes with line
    static drawLine(box1: Box, box2: Box): SVGElement {
        if (!box1 || !box2) return null;
        let dx1 = box1.x + (box1.width / 2);
        let dy1 = box1.y + (box1.height / 2);

        let dx2 = box2.x + (box2.width / 2);
        let dy2 = box2.y + (box2.height / 2);

        let dy = ((dy1 + dy2) / 2);

        let path = "M " + dx1 + " " + dy1 +
            " L " + dx1 + " " + dy +
            " L " + dx2 + " " + dy +
            " L " + dx2 + " " + dy2 +
            " ";

        var v = this.getNode('path',
            {
                d: path,
                class: 'path'
            });
        return v;

    };

    static drawSimpleLine(x1, y1, x2, y2: number): SVGElement {        

        let path = "M " + x1 + " " + y1 + " L " + x2 + " " + y2 + " ";

        var v = this.getNode('path',
            {
                d: path,
                class: 'grid'
            });
        return v;

    };
    // draw line from point to box
    static drawLineFrom(point : DOMPoint , toBox: Box): SVGElement {

        if (!point || !toBox) return null;

        let dx2 = toBox.x + (toBox.width / 2);
        let dy2 = toBox.y + (toBox.height / 2);

        let dy = ((point.y + dy2) / 2);

        let path = "M " + point.x + " " + point.y +
            " L " + point.x + " " + dy +
            " L " + dx2 + " " + dy +
            " L " + dx2 + " " + dy2 +
            " ";
        var v = this.getNode('path',
            {
                d: path,
                class: 'path'
            });
        return v;
    };

    // Get center between two boxes, ie parents
    static getCenter(box1?: Box, box2?: Box): DOMPoint {
        if (!box1 && !box2) return null;
        let x = 0;
        let y = 0;
        let dx1 = 0;
        let dy1 = 0;
        let dx2 = 0;
        let dy2 = 0;
        if (box1) {
            x = dx1 = box1.x + (box1.width / 2);
            y = dy1 = box1.y + (box1.height / 2);
        }
        if (box2) {
            x = dx2 = box2.x + (box2.width / 2);
            y = dy2 = box2.y + (box2.height / 2);
        }
        if (box1 && box2) {
            x = (dx1 + dx2) / 2;
            y = (dy1 + dy2) / 2;
        }
        var c: DOMPoint = new DOMPoint(x,y,0,0);
        return c;
    }

    static getNode(tag: string, attr: any): SVGElement {
        let b: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (var p in attr)
            b.setAttributeNS(null, p, attr[p]);
        return b;
    }
}