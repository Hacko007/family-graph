﻿
export class PersonBox extends Box {
    public _lines: Array<Line>;
    public _children: Array<PersonBox>;
    public _leftLimit: number = -1000000;
    public _rightLimit: number = 1000000;
    public _parents: Array<PersonBox>;

    private person: Person;
    private _baseFamilyWidth: number = BoxWidth;
    private _familyLeft: number = 0;
    private _isMale: boolean;
    private _classFemale: string = "female-box";
    private _classMale: string = "male-box";
    private _onClickDispatcher: EventDispatcher<PersonBox> = new EventDispatcher<PersonBox>();
    
    private _partnerBox: PersonBox;

    get onClick(): Event<PersonBox> {
        return this._onClickDispatcher as Event<PersonBox>;
    }

    private boxSelected(pb: PersonBox) {
        console.log("clicked", pb.person.id, pb.name);
        this._onClickDispatcher.dispatch(pb);
    }

    constructor(person: Person) {
        super();
        this.init();
        this.person = person;
        this.isMale = person.gender === Gender.Male;
        if (this.isMale) {
            this._boxClass = this._classMale;
        } else {
            this._boxClass = this._classFemale;
        }
    }
    private init() {
        this._children = new Array<PersonBox>();
        this._parents = new Array<PersonBox>();
        this._lines = new Array<Line>();
        this._onClickDispatcher = new EventDispatcher<PersonBox>();
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


    create(eventPb: PersonBox): SVGElement[] {
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
        text.textContent = this.name + " x:" + this.x ;
        var text2 = PathHelper.getNode('text',
            {
                x: this.x + 10,
                y: this.y + 70,
                class: 'persons-name'
            });
        text2.textContent = this._leftLimit + " : " + this._rightLimit;

        rect.addEventListener("click", () => { eventPb.boxSelected(this); });
        text.addEventListener("click", () => { eventPb.boxSelected(this); });
        return [rect, text,text2];
    }

    startFromThisPersion(): SVGElement[] {
        this.init();
        var result = new Array<SVGElement>();
        var add = (items: any[]) => { if (items) items.forEach(i => result.push(i)) };
        var addBoxes = (items: PersonBox[]) => { if (items) items.forEach(i => i.create(this).forEach(box => result.push(box))) }        
        var baseFamily = this.createBaseTree();
        var olds = this.drawParents();
        add(this.drawLines(baseFamily));
        add(this.drawLines(olds));
        addBoxes(olds);
        addBoxes(baseFamily);
        return result;
    }

    // return max boxes on one level
    populateParents(): number{
        let myParentThicknes = 0;
        
        var createParent = (p: Person) => {
            if (!p) return null;
            let parent = new PersonBox(p);
            parent.x = this.x;
            parent.y = this.y - (parent.height + (BoxHorizontalSpace * 2));
            this._parents.push(parent);
            myParentThicknes += parent.populateParents();
            return parent;
        }
        var d: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.dad) : null;
        var m: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.mam) : null;

        if (d && m) {
            d.expandPartner();
            myParentThicknes++;
        }        
        return myParentThicknes;
    }

    drawParents(): PersonBox[] {
        let partnrerParentThicknes = 0;
        let myParentThicknes = this.populateParents();

        if (this._partnerBox) partnrerParentThicknes = this._partnerBox.populateParents();
       // Position box
        let myParentsWidth = myParentThicknes * (this.width );
        let partnerParentsWidth = partnrerParentThicknes * (this.width + BoxHorizontalSpace);
        this.positonParents(myParentsWidth, this._partnerBox.x, this);
        this.positonParents(partnerParentsWidth,this.x, this._partnerBox);
        console.log(this.name, myParentThicknes, partnrerParentThicknes, myParentsWidth, partnerParentsWidth, this._parents, this._partnerBox ? this._partnerBox._parents : null);
        
        // Draw connecting lines 
        var result = new Array<PersonBox>();
        var add = (parents: PersonBox[]) => {
            if (!parents || parents.length === 0) return;
            if (parents.length === 1) {
                let p = parents.pop();
                result.push(p);
                add(p._parents);
                return;
            }
            let m = parents.pop();
            let d = parents.pop();            
            d._lines.push( Line.lineTo(d, m, LineType.Partners));
            result.push(d);
            result.push(m);
            add(d._parents);
            add(m._parents);
        };
        
        add(this._parents);
        if (this._partnerBox) {
            add(this._partnerBox._parents);
            this._lines.push(this._partnerBox.lineToParents(this._partnerBox._parents));
        }

        return result;
    }
    // place parents in middel of width
    positonParents(width: number, partnerX :number, _me: PersonBox) {
        if (!_me) return;
        if (_me._parents.length === 0) return;

        if (_me.isMale) {
            let rightX = Math.min(partnerX,  _me.x  );
            this.setBounds(Number.NEGATIVE_INFINITY, rightX, _me._parents);
        } else {
            this.setBounds(_me.x, Number.POSITIVE_INFINITY, _me._parents);
        }
        
        this.setX(_me);        
        console.log(_me.name, _me.x, _me._parents[0]._leftLimit, _me._parents[0]._rightLimit, _me._parents[1]._leftLimit, _me._parents[1]._rightLimit)
    }

    setX(me: PersonBox) {
        if (!me || me._parents.length === 0) return;

        if (me._parents.length === 1) {
            me._parents[0].x = me.x;
        } else {
            if (me.isMale) {
                this.setBounds(me._leftLimit, Math.min(me.x + me.width, me._rightLimit), me._parents);
            } else {
                this.setBounds(Math.max(me.x, me._leftLimit), me._rightLimit, me._parents);
            }
            me._parents[0].x = me.x;
            me._parents[0].positionPartner(me._parents[1]);
        }
        me._parents.forEach(p => this.setX(p));

        let [dl, dr] = this.getParentBounds(me._parents[0]); //dad
        this.setBounds(dl, dr, me._parents[0]._parents);

        let [ml, mr] = this.getParentBounds(me._parents[1]); //mam
        let newLeft = Math.max(ml, dr + BoxHorizontalSpace);
        let newRight = newLeft + (mr - ml);
        this.setBounds(newLeft, newRight, me._parents[1]._parents);

        console.log(dl, dr, newLeft, newRight, me.name);

        me._lines.push(me.lineToParents(me._parents));
    }

    getParentBounds(p: PersonBox): [number, number] {
        if (!p) return [0, 0];
        let [l, r] = [p.x, p.x + p.width];
        if (p._parents.length === 0) return [l, r];

        for (let a of p._parents) {
            let [dl, dr] = this.getParentBounds(a);
            l = Math.min(l, dl);
            r = Math.max(r, dr);
        }
        return [l, r];
    }

    setBounds(left: number, right: number, parents: PersonBox[])  {
        if (!parents || parents.length === 0) return;
        for (let p of parents) {
            p._leftLimit = left;
            p._rightLimit = right;
            this.setBounds(left, right, p._parents);
        }
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

        this.expandPartner();
        if (this._partnerBox) {
            this._lines.push(Line.lineTo(this, this._partnerBox, LineType.Partners));
            result.push(this._partnerBox);
        }

        var childrenBoxes = this.expandChildren();
        if (childrenBoxes) {            
            for (var child of childrenBoxes) {
                this._lines.push(child.lineToParents(childrenBoxes.concat([this, this._partnerBox])));
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

        let rghLimit = this._rightLimit - this.width - space;
        rghLimit -= this.isMale ? this.width : 0;

        this.x = Math.min(this.x, rghLimit);
        this.x = Math.max(this.x, this._leftLimit);

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
    expandPartner() {
        if (!this.person || !this.person.marriedPartner) return ;

        if (!this._partnerBox) {
            this._partnerBox = new PersonBox(this.person.marriedPartner);
        }
        this._partnerBox._partnerBox = this;
        this.positionPartner(this._partnerBox);        
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

    toString(): string {
        return this.name;
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


/**
 * Event handler that can subscribe to a dispatcher.
 */
export type EventHandler<E> = (event: E) => void;
/**
 * Event that can be subscribed to.
 */
export interface Event<E> {
    /**
     * Register a new handler with the dispatcher. Any time the event is
     * dispatched, the handler will be notified.
     * @param handler The handler to register.
     */
    register(handler: EventHandler<E>): void;
    /**
     * Desubscribe a handler from the dispatcher.
     * @param handler The handler to remove.
     */
    unregister(handler: EventHandler<E>): void;
}



export class EventDispatcher<E> implements Event<E> {
    /**
     * The handlers that want to be notified when an event occurs.
     */
    private _handlers: EventHandler<E>[];

    /**
     * Create a new event dispatcher.
     */
    constructor() {
        this._handlers = [];
    }
    /**
    * Register a new handler with the dispatcher. Any time the event is
    * dispatched, the handler will be notified.
    * @param handler The handler to register.
    */
    public register(handler: EventHandler<E>): void {
        this._handlers.push(handler);
    }

    /**
     * Desubscribe a handler from the dispatcher.
     * @param handler The handler to remove.
     */
    public unregister(handler: EventHandler<E>): void {
        for (let i = 0; i < this._handlers.length; i++) {
            if (this._handlers[i] === handler) {
                this._handlers.splice(i, 1);
            }
        }
    }
    /**
     * Dispatch an event to all the subscribers.
     * @param event The data of the event that occured.
     */
    public dispatch(event: E): void {
        for (let handler of this._handlers) {
            handler(event);
        }
    }
}


