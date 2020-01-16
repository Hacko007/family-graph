class PersonBox extends Box {
    private _name: string;
    private _isMale: boolean;
    private _classFemale: string = "female-box";
    private _classMale: string = "male-box";

    constructor(name:string, isMale:boolean) {
        super();
        this.name = name;
        this.isMale = isMale;
        if (isMale) {
            this._boxClass = this._classMale;
        } else {
            this._boxClass = this._classFemale;
        }
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }

    get isMale(): boolean{
        return this._isMale;
    }
    set isMale(value: boolean) {
        this._isMale = value;
    }

    create(): SVGElement[] {
        var rect: SVGElement = PathHelper.getNode('rect',
            {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rx: 30,
                ry: 10,
                class: this._boxClass
    });

        var text = PathHelper.getNode('text',
            {
                x: this.x + 20,
                y: this.y + 80,
                class: 'persons-name'
            });
        text.textContent = this.name;
        return [ rect, text ];
    }

}

class MaleBox extends PersonBox {
    constructor(name: string) {
        super(name, true);
    }
}

class FemaleBox extends PersonBox {
    constructor(name: string) {
        super(name, false);
    }
}