import { Event, EventDispatcher } from "./EventDispatcher";

class PersonBox extends Box {
    private person: Person;

    private _baseFamilyWidth: number = BoxWidth;
    private _familyLeft: number = 0;
    public _leftLimit: number = -1000000;
    private _isMale: boolean;
    private _classFemale: string = "female-box";
    private _classMale: string = "male-box";    
    private _onClickDispatcher: EventDispatcher<number>;
    public _children = new Array<PersonBox>();
    private _parents = new Array<PersonBox>();
    public _lines = new Array<Line>();

    get onClick(): Event<number> {
        return this._onClickDispatcher as Event<number>;
    }

    private boxSelected(id: number) {
        console.log(id + " clicked");
        //todo
        //this._onClickDispatcher.dispatch(id);        
    }

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

        rect.addEventListener("click", () => { this.boxSelected(this.person.id); });
        text.addEventListener("click", () => { this.boxSelected(this.person.id); });
        return [rect, text];
    }

    startFromThisPersion(): SVGElement[] {
        var result = new Array<SVGElement>();
        var add = (items: any[]) => { if (items) items.forEach(i => result.push(i)) };
        var addBoxes = (items: PersonBox[]) => {if (items) items.forEach(i => i.create().forEach(box => result.push(box)))}
        var olds = this.drawParents();
        var baseFamily = this.createBaseTree();        
        add(this.drawLines(baseFamily));
        add(this.drawLines(olds));
        addBoxes(olds);
        addBoxes(baseFamily);
        return result;
    }

    drawParents(): PersonBox[] {
        var result = new Array<PersonBox>();
        var add = (items: any[]) => { if (items) items.forEach(i => result.push(i)) };

        var createParent = (p: Person) => {
            if (!p) return null;
            var parent = new PersonBox(p);
            parent.x = this.x;
            parent.y = this.y - (parent.height + (BoxHorizontalSpace * 2));
            add(parent.drawParents());
            result.push(parent);
            this._parents.push(parent);
            return parent;
        }

        var d: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.dad) : null;
        var m: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.mam) : null;

        if (d && m) {
            d.x = d.x - (d.width + BoxVerticalSpace)
            m.x = m.x + BoxVerticalSpace * 2;
           // console.log(d);
           // console.log(m);
            d._lines.push( Line.lineTo(d, m, LineType.Partners));
        }
        this._lines.push(this.lineToParents([d, m]));
        return result;
    }

    drawLines(boxes: Array<PersonBox>): Array<SVGElement> {
        if (!boxes) return null;
        var elements = new Array<SVGElement>();
        var add = (item: any) => { if (item) elements.push(item); };

        // Connect all boxes
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
        return elements;
    }

    createBaseTree(): PersonBox[] {
        this._familyLeft = Math.max(this.x, this._leftLimit);
        var boxes = this.expandBaseTree();
        if (!boxes) return null;        
        return boxes;
    }

    expandBaseTree(): PersonBox[] {

        var result = new Array<PersonBox>();
        result.push(this);
        this._familyLeft = Math.max(this.x, this._leftLimit);

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
            partner.x = this.x;
            this.x = partner.x + partner.width + space;
        }
        this.familyWidth = 2 * this.width + space;
    }

    // Set position to all children and there families
    private positionChildren(): PersonBox[]
    {        
        if (!this._children) return null;

        var space = BoxHorizontalSpace * 2;
        var childrenWidth = 0;
        //console.log(this.person.firstName + "\tx:" + this.x + "\ty:" + this.y);
        var c = Math.max(1, this.countNodes(this._children)-1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        //console.log(this.name, this._leftLimit, x);
        //console.log(this.person.firstName + "\tc:" + c + "\tx:" + x + "\ty:" + y);
        var leftLimit = this._leftLimit;

        var result = new Array<PersonBox>();
        for (var child of this._children) {
            child.y = y;
            child.x = Math.max(x, leftLimit);
            child._leftLimit = leftLimit;

            var childsFamily = child.expandBaseTree();
            var [left, right] = this.calculateFamilyWidth(child);
            //console.log(child.name, child.x, x, left, right);
            x = right + space; /// child.x + child.familyWidth + space;
            leftLimit = x;
            childrenWidth = right;//+=  child.familyWidth + space;     
            child.familyWidth = right;
            childsFamily.forEach(f => result.push(f));
            //console.log("ch:" + child.person.firstName + "\t\tx,y,left,width:\t" + child.x + ",\t" + child.y + ",\t" + child.familyLeft + " \t" + child.familyWidth);            
        }
        
        this.familyWidth = Math.max(this.familyWidth, childrenWidth);
        //console.log(this.person.firstName + "\t\tx,y,left,width:\t" + this.x + ",\t" + this.y + ",\t" + this.familyLeft + " \t" + this.familyWidth);
        return result;
    }

    calculateFamilyWidth(pBox: PersonBox): [number, number] {
        if (!pBox) return [0,0];
        var left = pBox.x;
        var right = pBox.x + pBox.width;
        for (var child of pBox._children) {
            var [l,r] = this.calculateFamilyWidth(child);
            left = Math.min(left, l);
            right = Math.max(right, r);
        }
        return [left, right];
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

        for (var child of children) {
            this._children.push(new PersonBox(child));
        }
        return this.positionChildren();
    }


    countNodes(siblingNodes: PersonBox[]): number {
        if (!siblingNodes) return 0;
        var i = 0;
        for (var person of siblingNodes) {
            i++;
            if (person.person.marriedPartner) i++;
        }
        return i;
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
