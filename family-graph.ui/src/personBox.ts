class PersonBox extends Box {
    person:Person;
    
    private _isMale: boolean;
    private _classFemale: string = "female-box";
    private _classMale: string = "male-box";

    constructor(person:Person) {
        super();
        this.person = person;
        this.isMale = person.gender === Gender.Male;
        if (this.isMale) {
            this._boxClass = this._classMale;
        } else {
            this._boxClass = this._classFemale;
        }
    }

    get name(): string {
        return this.person.fullName;
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

    positionPartner(parnter: PersonBox) {
        var space = BoxHorizontalSpace * 2;
        parnter.y = this.y;
        if (this.isMale) {
            parnter.x = this.x + this.width + space;
        } else {
            this.x = parnter.x + parnter.width + space;
        }
    }

    positionChildren(children: PersonBox[]) {
        var space = BoxHorizontalSpace * 2;
        if (!children) return;
        var c = Math.max(1, children.length - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        for (var i in children) {
            var child = children[i];
            child.x = x;
            child.y = y;
            x += child.width + space;
        }
    }


}
