declare class PathHelper {
    static drawLine(box1: Box, box2: Box): SVGElement;
    static drawLineFrom(point: DOMPoint, toBox: Box): SVGElement;
    static getCenter(box1?: Box, box2?: Box): DOMPoint;
    static getNode(tag: string, attr: any): SVGElement;
}
