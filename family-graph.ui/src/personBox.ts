class PersonBox extends Box {
    person: Person;

    private _baseFamilyWidth: number = BoxWidth;
    private _familyLeft: number = 0;
    private _isMale: boolean;
    private _classFemale: string = "female-box";
    private _classMale: string = "male-box";
    _lines = new Array<Line>();

    constructor(person: Person) {
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

    updateLeft(x: number) {
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
        return [rect, text];
    }

    createBaseTree(): SVGElement[] {
        this._familyLeft = this.x;

        var boxes = this.expandBaseTree();
        if (!boxes) return null;
        var elements = new Array<SVGElement>();
        var add = (item: any) => { if (item) elements.push(item); };

        // Connection
        for (var pbox of boxes) {
            for (var line of pbox._lines) {
                if (!line) continue;
                if (line.lineType === LineType.Child) {
                    add(PathHelper.drawLineFrom(line.pointFrom, line.personTo));
                } else {
                    add(PathHelper.drawLine(line.personFrom, line.personTo));
                }
            }
        }
        // Boxes
        for (var pbox of boxes) {
            pbox.create().forEach(p => add(p));
        }
        return elements;
    }

    expandBaseTree(): PersonBox[] {

        var result = new Array<PersonBox>();
        result.push(this);
        this._familyLeft = this.x;

        var partnerBox = this.expandPartner();
        if (partnerBox) {
            this._lines.push(Line.lineTo(this, partnerBox, LineType.Partners));
            result.push(partnerBox);
        }

        var childrenBoxes = this.expandChildren();
        if (childrenBoxes) {
            for (var child of childrenBoxes) {
                this._lines.push(child.lineToParents(childrenBoxes.concat([this, partnerBox])));
                result.push(child);
            }
        }
        return result;
    }

    // connect this person to parents from boxes
    lineToParents(boxes: Array<PersonBox>): Line {
        if (!this.person || (!this.person.parents)) return null;
        var find = (p: Person, boxes: PersonBox[]) => {
            for (var box of boxes) {
                if (box.person && box.person === p) {
                    return box;
                }
            }
            return null;
        }
        var dadBox = find(this.person.parents.dad, boxes);
        var mamBox = find(this.person.parents.mam, boxes);
        var from = PathHelper.getCenter(dadBox, mamBox);
        return Line.lineToChild(from, this);
    }

    // Set position for partner
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

    // Set position to all children and there families
    positionChildren(children: PersonBox[]): PersonBox[] {
        var space = BoxHorizontalSpace * 2;
        if (!children) return null;
        var childrenWidth = 0;
        var c = Math.max(1, children.length - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;

        var result = new Array<PersonBox>();
        for (var child of children) {
            child.x = x;
            child.y = y;
            var childsFamily = child.expandBaseTree();
            x += child.familyWidth + space;
            childrenWidth += child.familyWidth + space;
            this.updateLeft(x);
            childsFamily.forEach(f => result.push(f));
        }
        this.familyWidth = Math.max(this.familyWidth, childrenWidth);
        console.log("fam Left:" + this.familyLeft);
        console.log("fam Width:" + this.familyWidth);
        return result;
    }


    // Make space for partner
    expandPartner(): PersonBox {
        if (!this.person) return null;
        var partner = this.person.marriedPartner;
        if (!partner) return null;
        var partnerBox = new PersonBox(partner);
        this.positionPartner(partnerBox);
        return partnerBox;
    }

    // Make space for children
    expandChildren(): PersonBox[] {
        if (!this.person) return null;
        var children = this.person.marriageChildren;
        if (!children) return null;
        var chBoxs = new Array<PersonBox>();
        for (var child of children) {
            chBoxs.push(new PersonBox(child));
        }
        return this.positionChildren(chBoxs);
    }

   
}

class Line {
    lineType: LineType;
    personFrom: PersonBox;
    personTo: PersonBox;
    pointFrom: DOMPoint;

    static lineToChild(from: DOMPoint, child: PersonBox): Line {
        var l = new Line();
        l.pointFrom = from;
        l.personTo = child;
        l.lineType = LineType.Child;
        return l;
    };

    static lineTo(from: PersonBox, to: PersonBox, lineType: LineType): Line {
        var l = new Line();
        l.personFrom = from;
        l.personTo = to;
        l.lineType = lineType;
        return l;
    };
}

enum LineType {
    Partners,
    Parents,
    Child
}