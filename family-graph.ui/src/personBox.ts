class PersonBox extends Box {
    person:Person;

    private _baseFamilyWidth: number = BoxWidth;
    private _familyLeft: number = 0;
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
    
    get isMale(): boolean {
        return this._isMale;
    }
    set isMale(value: boolean) {
        this._isMale = value;
    }

    get familyLeft(): number {
        return this._familyLeft;
    }
    updateLeft(x:number) {
        this._familyLeft = Math.min(this._familyLeft, x);
    }
    get familyWidth(): number {
        return this._baseFamilyWidth;
    }
    set familyWidth(value: number) {
        this._baseFamilyWidth = value;
    }



    create(): SVGElement[] {
        var rect: SVGElement = PathHelper.getNode('rect',
            {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                rx: 7,
                ry: 5,
                class: this._boxClass
        });

        var text = PathHelper.getNode('text',
            {
                x: this.x + 10,
                y: this.y + 40,
                class: 'persons-name'
            });
        text.textContent = this.name;
        return [ rect, text ];
    }

    positionPartner(partner: PersonBox) {
        if (!partner) return;

        var space = BoxHorizontalSpace * 2;
        partner.y = this.y;
        if (this.isMale) {
            partner.x = this.x + this.width + space;
        } else {
            this.x = partner.x + partner.width + space;
        }
        this.familyWidth = 2 * this.width + space;
    }

    positionChildren(children: PersonBox[]) {
        var space = BoxHorizontalSpace * 2;
        if (!children) return;
        var childrenWidth = 0;
        var c = Math.max(1, children.length - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        
        for (var child of children) {
            child.createBaseTree();
            child.x = x;
            child.y = y;
            x += child.familyWidth + space;
            childrenWidth += child.familyWidth + space;
            this.updateLeft(x);
        }
        this.familyWidth = Math.max(this.familyWidth, childrenWidth);
        console.log("fam Left:" + this.familyLeft);
        console.log("fam Width:" + this.familyWidth);
    }


    createBaseTree(): SVGElement[] {
        this._familyLeft = this.x;

        var partnerBox = this.expandPartner();
        var childrenBoxes = this.expandChildren();
        var elements = new Array<SVGElement>();

        // Connection
        this.add(elements, PathHelper.drawLine(this, partnerBox));
        var connect = PathHelper.getCenter(this, partnerBox);
        if (childrenBoxes)
            for (var chBox of childrenBoxes) {
                this.add(elements, PathHelper.drawLineFrom(connect, chBox));
            }
        // Boxes
        this.create().forEach(e=> this.add(elements, e));
        if (partnerBox)
            partnerBox.create().forEach(p => this.add(elements, p));

        if (childrenBoxes)
            for (var ch of childrenBoxes) {
                ch.create().forEach(e=> this.add(elements, e));
            }
        return elements;
    }

    // Create position for partner and children
    expandPartner():PersonBox{
        if (!this.person) return null;
        var partner = this.person.marriedPartner;
        if (!partner) return null;
        var partnerBox = new PersonBox(partner);
        this.positionPartner(partnerBox);
        return partnerBox;
    }

    // Create position for partner and children
    expandChildren(): PersonBox[] {
        if (!this.person ) return null;
        var children = this.person.marriageChildren;
        if (!children) return null;
        var chBoxs = new Array<PersonBox>();
        for (var child of children) {
            chBoxs.push(new PersonBox(child));
        }
        this.positionChildren(chBoxs);
        return chBoxs;
    }

    add(list: Array<SVGElement>, item: any) {
        if (!item) return;
        list.push(item);
    }
}
