const MinLeft = -1000000;
const MaxRight = 1000000;

export class PersonBox extends Box {

    public debugging: boolean = false;

    public _lines: Array<Line>;
    public _children: Array<PersonBox>;
    public _leftLimit: number = MinLeft;
    public _rightLimit: number = MaxRight;
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
        this._partnerBox = null;
        this._leftLimit = MinLeft;
        this._rightLimit = MaxRight;
        this._onClickDispatcher = new EventDispatcher<PersonBox>();
    }

    get name(): string { return this.person.fullName; }

    get isMale(): boolean { return this._isMale; }

    set isMale(value: boolean) { this._isMale = value; }

    get dad(): PersonBox{
        if (this._parents.length === 0) return null;
        for (let p of this._parents) {
            if (p.isMale) return p;
        }
        return null;
    }

    get mam(): PersonBox {
        if (this._parents.length === 0) return null;
        for (let p of this._parents) {
            if (!p.isMale) return p;
        }
        return null;
    }
    get hasBothParents(): boolean {
        return (this.mam && this.dad) ? true : false;;
    }
    get hasOnlyOneParents(): boolean {
        return this._parents.length === 1;
    }
    get partner(): PersonBox { return this._partnerBox; }

    get familyLeft(): number { return this._familyLeft; }

    get familyWidth(): number { return this._baseFamilyWidth; }

    set familyWidth(value: number) { this._baseFamilyWidth = value; }

    updateLeft(x: number) { this._familyLeft = Math.min(this._familyLeft, x); }

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
                y: this.y + 30,
                class: 'persons-name'
            });
        text.textContent = this.name ;
        rect.addEventListener("click", () => { eventPb.boxSelected(this); });
        text.addEventListener("click", () => { eventPb.boxSelected(this); });

        if (!this.debugging)
            return [rect, text];

        //add debug info
        var text2 = PathHelper.getNode('text',
            {
                x: this.x + 10,
                y: this.y + 70,
                class: 'debug'
            });
        text2.textContent = "X: " + this.x;
        var text3 = PathHelper.getNode('text',
            {
                x: this.x + 10,
                y: this.y + 90,
                class: 'debug'
            });
        text3.textContent = "L: " + this._leftLimit + "  - R: " + this._rightLimit;

        return [rect, text,text2,text3];
    }

    startFromThisPersion(): SVGElement[] {
        this.init();
        var result = new Array<SVGElement>();
        const add = (items: any[]) => { if (items) items.forEach(i => result.push(i)) };
        const addBoxes = (items: PersonBox[]) => { if (items) items.forEach(i => i.create(this).forEach(box => result.push(box))) };
        if (this.debugging)
        {
            //Help grid
            for (let x = -1000; x < 3100; x += 50) {
                for (let y = 0; y < 3100; y += 200) {
                    result.push(PathHelper.drawSimpleLine(x, y, -x, y));
                    result.push(PathHelper.drawSimpleLine(x, -y, x, y));
                }
            }
        }


        const baseFamily = this.createBaseTree();
        const olds = (this.partner && this.partner.isMale) ? this.partner.drawParents() :  this.drawParents();
        add(this.drawLines(baseFamily));
        add(this.drawLines(olds));
        addBoxes(olds);
        addBoxes(baseFamily);
        
        return result;
    }

    // return max boxes on one level
    populateParents(){
        var createParent = (p: Person) => {
            if (!p) return null;
            let parent = new PersonBox(p);
            parent.x = this.x;
            parent.y = this.y - (parent.height + (BoxVerticalSpace ));
            this._parents.push(parent);
            parent.populateParents();
            return parent;
        }
        var d: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.dad) : null;
        var m: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.mam) : null;

        if (d && m) {
            d._partnerBox = m;
            m._partnerBox = d;
            d.expandPartner();
        }
    }

    drawParents(): PersonBox[] {
        this.populateParents();
        if (this.partner) this.partner.populateParents();

        let levels = new Map([[0, ((this.partner) ? this.partner.x : this.x) + this.width]]);
        // Position box
        const positionParents = (me: PersonBox)=> {
            if (!me) return;
            if (me._parents.length === 0) return;
            if (me.partner) {
                if (me.isMale) {
                    this.setBounds(Number.NEGATIVE_INFINITY, me.x + me.width , me._parents);
                } else {
                    this.setBounds(me.x, Number.POSITIVE_INFINITY, me._parents);
                }
            }
            this.setX(me, 0, levels);
        };
        positionParents(this);
        positionParents(this.partner);

        console.log(this.name, this._parents, this.partner ? this.partner._parents : null);

        // Draw connecting lines 
        var result = new Array<PersonBox>();
        var add = (parents: PersonBox[]) => {
            if (!parents || parents.length === 0) return;
            if (parents.length === 1) {
                const p = parents[0];
                result.push(p);
                add(p._parents);
                return;
            }

            const d = parents[0];
            const m = parents[1];
            
            d._lines.push(Line.lineTo(d, m, LineType.Partners));
            result.push(d);
            result.push(m);
            add(d._parents);
            add(m._parents);
        };

        add(this._parents);
        if (this.partner) {
            add(this.partner._parents);
            this._lines.push(this.partner.lineToParents(this.partner._parents));
        }

        return result;
    }

    setX(me: PersonBox, level: number, levels: Map<number, number>) {
        if (!me) return;
       
        if (me._parents.length === 1) {
            me._parents[0].x = me.x;
            levels.set(level ,  me.x + me.width);
        } else {
            if (me.partner) {
                if (me.isMale) {
                    this.setBounds(me._leftLimit, me.x + me.width , me._parents);
                } else {
                    this.setBounds(me.x, me._rightLimit, me._parents);
                }
            }

            if (me._parents.length === 0) {
                this.setLevel(level, me, levels);
                 console.log(level, levels, levels.get(level), me.name, "no parents");
                return;
            }

            let  leftSiblingEnd = levels.has(level) ? levels.get(level) :  me.x;            
            me.dad.x = Math.max(me.x, leftSiblingEnd );
            me.dad.positionPartner();
            this.setLevel(level , me, levels);
            console.log(level, levels, leftSiblingEnd, me.name);
        }
        
        me._parents.forEach(p => this.setX(p, level + 1, levels));
        
        me._lines.push(me.lineToParents(me._parents));
    }

    setLevel(lev: number, me: PersonBox, levels: Map<number, number>) {
        let x = Math.max(me.x, me.partner ? me.partner.x : MinLeft) + (BoxHorizontalSpace);
        if (levels.has(lev)) {
            let  oldX = levels.get(lev);
            levels.set(lev, Math.max(x, oldX));
            if (lev === 4) console.log(oldX, x, me.name);
        } else {
            levels.set(lev, x);
            if (lev === 4) console.log(x, me.name);
        }

        
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
        if (right < left) right = left;

        for (let p of parents) {
            p._leftLimit = left;
            p._rightLimit = right;
            if (p.x > left) {
                console.log(p.name,p.x,left ,"left");
                //p.x = left;
            }
            if (p.x < right) {
                console.log(p.name, p.x, right, "right");
                 //p.x = right;
            }
            p.positionPartner();
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
        if (this.partner) {
            this._lines.push(Line.lineTo(this, this.partner, LineType.Partners));
            result.push(this.partner);
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
    positionPartner() {
        let space = BoxHorizontalSpace ;
        let rghLimit = this._rightLimit - space - this.width;

        if (!this.partner) { // no partner
            this.x = Math.min(this.x, rghLimit);
            this.x = Math.max(this.x, this._leftLimit);
            return;
        }

        this.partner.y = this.y;
        rghLimit -= this.isMale ? this.partner.width : 0;
        
        this.x = Math.min(this.x, rghLimit);
        this.x = Math.max(this.x, this._leftLimit);
        
        if (this.isMale) {            
            this.partner.x = this.x + this.width + space;
        } else {
            this.partner.x = this.x;
            this.x = this.partner.x + this.partner.width + space;
        }
        this.familyWidth = 2 * this.width + space;
    }

    // Set position to all children and there families
    private positionChildren(): PersonBox[]
    {        
        if (!this._children) return null;

        var space = BoxHorizontalSpace ;
        var childrenWidth = 0;
        
        var c = Math.max(1, this.countNodes(this._children)-1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        
        var leftLimit = this._leftLimit;

        var result = new Array<PersonBox>();
        for (var child of this._children) {
            child.y = y;
            child.x = Math.max(x, leftLimit);
            child._leftLimit = leftLimit;

            var childsFamily = child.expandBaseTree();
            var [left, right] = this.calculateFamilyWidth(child);
            
            x = right + space; 
            leftLimit = x;
            childrenWidth = right;
            child.familyWidth = right;
            childsFamily.forEach(f => result.push(f));
        }
        
        this.familyWidth = Math.max(this.familyWidth, childrenWidth);        
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
        this.positionPartner();        
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


