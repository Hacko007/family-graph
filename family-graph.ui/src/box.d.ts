declare const BoxHorizontalSpace: number;
declare const BoxVerticalSpace: number;
declare const BoxWidth: number;
declare class Box {
    private _x;
    private _y;
    private _height;
    private _width;
    private _style;
    _bgColor: string;
    _boxClass: string;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get height(): number;
    set height(value: number);
    get width(): number;
    set width(value: number);
    get style(): string;
    set style(value: string);
    connectTo(boxes: Box[]): any;
    connectToPoint(point: DOMPoint): SVGElement;
    create(): SVGElement[];
    static makeSpaceHorizontally(boxes: Box[]): void;
    overlapping(b2: Box): boolean;
}
