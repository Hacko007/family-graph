"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcher = exports.PersonBox = void 0;
const MinLeft = -1000000;
const MaxRight = 1000000;
class PersonBox extends Box {
    constructor(person) {
        super();
        this._leftLimit = MinLeft;
        this._rightLimit = MaxRight;
        this._baseFamilyWidth = BoxWidth;
        this._familyLeft = 0;
        this._classFemale = "female-box";
        this._classMale = "male-box";
        this._onClickDispatcher = new EventDispatcher();
        this.init();
        this.person = person;
        this.isMale = person.gender === Gender.Male;
        if (this.isMale) {
            this._boxClass = this._classMale;
        }
        else {
            this._boxClass = this._classFemale;
        }
    }
    get onClick() {
        return this._onClickDispatcher;
    }
    boxSelected(pb) {
        console.log("clicked", pb.person.id, pb.name);
        this._onClickDispatcher.dispatch(pb);
    }
    init() {
        this._children = new Array();
        this._parents = new Array();
        this._lines = new Array();
        this._partnerBox = null;
        this._leftLimit = MinLeft;
        this._rightLimit = MaxRight;
        this._onClickDispatcher = new EventDispatcher();
    }
    get name() { return this.person.fullName; }
    get isMale() { return this._isMale; }
    set isMale(value) { this._isMale = value; }
    get dad() {
        if (this._parents.length === 0)
            return null;
        for (let p of this._parents) {
            if (p.isMale)
                return p;
        }
        return null;
    }
    get mam() {
        if (this._parents.length === 0)
            return null;
        for (let p of this._parents) {
            if (!p.isMale)
                return p;
        }
        return null;
    }
    get hasBothParents() {
        return (this.mam && this.dad) ? true : false;
        ;
    }
    get hasOnlyOneParents() {
        return this._parents.length === 1;
    }
    get partner() { return this._partnerBox; }
    get familyLeft() { return this._familyLeft; }
    get familyWidth() { return this._baseFamilyWidth; }
    set familyWidth(value) { this._baseFamilyWidth = value; }
    updateLeft(x) { this._familyLeft = Math.min(this._familyLeft, x); }
    create(eventPb) {
        var rect = PathHelper.getNode('rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: 7,
            ry: 5,
            class: this._boxClass
        });
        var text = PathHelper.getNode('text', {
            x: this.x + 10,
            y: this.y + 40,
            class: 'persons-name'
        });
        text.textContent = this.name + " x:" + this.x;
        rect.addEventListener("click", () => { eventPb.boxSelected(this); });
        text.addEventListener("click", () => { eventPb.boxSelected(this); });
        var text2 = PathHelper.getNode('text', {
            x: this.x + 10,
            y: this.y + 70,
            class: 'persons-name'
        });
        text2.textContent = this._leftLimit + " : " + this._rightLimit;
        text2.addEventListener("click", () => { eventPb.boxSelected(this); });
        return [rect, text, text2];
    }
    startFromThisPersion() {
        this.init();
        var result = new Array();
        var add = (items) => { if (items)
            items.forEach(i => result.push(i)); };
        var addBoxes = (items) => { if (items)
            items.forEach(i => i.create(this).forEach(box => result.push(box))); };
        //Help grid
        for (let x = -1000; x < 3100; x += 50) {
            for (let y = 0; y < 3100; y += 200) {
                result.push(PathHelper.drawSimpleLine(x, y, -x, y));
                result.push(PathHelper.drawSimpleLine(x, -y, x, y));
            }
        }
        var baseFamily = this.createBaseTree();
        var olds = this.drawParents();
        add(this.drawLines(baseFamily));
        add(this.drawLines(olds));
        addBoxes(olds);
        addBoxes(baseFamily);
        return result;
    }
    // return max boxes on one level
    populateParents() {
        var createParent = (p) => {
            if (!p)
                return null;
            let parent = new PersonBox(p);
            parent.x = this.x;
            parent.y = this.y - (parent.height + (BoxVerticalSpace));
            this._parents.push(parent);
            parent.populateParents();
            return parent;
        };
        var d = this.person.parents !== undefined ? createParent(this.person.parents.dad) : null;
        var m = this.person.parents !== undefined ? createParent(this.person.parents.mam) : null;
        if (d && m) {
            d._partnerBox = m;
            m._partnerBox = d;
            d.expandPartner();
        }
    }
    drawParents() {
        this.populateParents();
        if (this.partner)
            this.partner.populateParents();
        let levels = new Map([[0, ((this.partner) ? this.partner.x : this.x) + this.width]]);
        // Position box
        var positonParents = (me) => {
            if (!me)
                return;
            if (me._parents.length === 0)
                return;
            if (me.partner) {
                if (me.isMale) {
                    this.setBounds(Number.NEGATIVE_INFINITY, me.x, me._parents);
                }
                else {
                    this.setBounds(me.x, Number.POSITIVE_INFINITY, me._parents);
                }
            }
            this.setX(me, 0, levels);
        };
        positonParents(this);
        positonParents(this.partner);
        console.log(this.name, this._parents, this.partner ? this.partner._parents : null);
        // Draw connecting lines 
        var result = new Array();
        var add = (parents) => {
            if (!parents || parents.length === 0)
                return;
            if (parents.length === 1) {
                let p = parents[0];
                result.push(p);
                add(p._parents);
                return;
            }
            let d = parents[0];
            let m = parents[1];
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
    setX(me, level, levels) {
        if (!me)
            return;
        if (me._parents.length === 1) {
            me._parents[0].x = me.x;
            levels.set(level, me.x + me.width);
        }
        else {
            if (me.partner) {
                if (me.isMale) {
                    this.setBounds(me._leftLimit, me.x, me._parents);
                }
                else {
                    this.setBounds(me.x, me._rightLimit, me._parents);
                }
            }
            if (me._parents.length === 0) {
                me.positionPartner();
                this.setLevel(level, me, levels);
                console.log(level, levels, levels.get(level), me.name, "no parents");
                return;
            }
            let leftSiblingEnd = levels.has(level) ? levels.get(level) : me.x;
            me.dad.x = Math.max(me.x, leftSiblingEnd);
            me.dad.positionPartner();
            this.setLevel(level, me, levels);
            console.log(level, levels, leftSiblingEnd, me.name);
        }
        me._parents.forEach(p => this.setX(p, level + 1, levels));
        me._lines.push(me.lineToParents(me._parents));
    }
    setLevel(lev, me, levels) {
        let x = Math.max(me.x, me.partner ? me.partner.x : MinLeft) + (BoxHorizontalSpace);
        if (levels.has(lev)) {
            let oldX = levels.get(lev);
            levels.set(lev, Math.max(x, oldX));
            if (lev === 4)
                console.log(oldX, x, me.name);
        }
        else {
            levels.set(lev, x);
            if (lev === 4)
                console.log(x, me.name);
        }
    }
    getParentBounds(p) {
        if (!p)
            return [0, 0];
        let [l, r] = [p.x, p.x + p.width];
        if (p._parents.length === 0)
            return [l, r];
        for (let a of p._parents) {
            let [dl, dr] = this.getParentBounds(a);
            l = Math.min(l, dl);
            r = Math.max(r, dr);
        }
        return [l, r];
    }
    setBounds(left, right, parents) {
        if (!parents || parents.length === 0)
            return;
        if (right < left)
            right = left;
        for (let p of parents) {
            p._leftLimit = left;
            p._rightLimit = right;
            if (p.x < left) {
                console.log(p.name, p.x, left, "left");
                p.x = left;
            }
            if (p.x > right) {
                console.log(p.name, p.x, right, "right");
                p.x = right;
            }
            this.setBounds(left, right, p._parents);
        }
    }
    drawLines(boxes) {
        if (!boxes)
            return null;
        var elements = new Array();
        var add = (item) => { if (item)
            elements.push(item); };
        // Connect all boxes
        for (var pbox of boxes) {
            for (var line of pbox._lines) {
                if (!line)
                    continue;
                if (line.lineType === LineType.Child) {
                    add(PathHelper.drawLineFrom(line.pointFrom, line.personTo));
                }
                else {
                    add(PathHelper.drawLine(line.personFrom, line.personTo));
                }
            }
        }
        return elements;
    }
    createBaseTree() {
        this._familyLeft = Math.max(this.x, this._leftLimit);
        var boxes = this.expandBaseTree();
        if (!boxes)
            return null;
        return boxes;
    }
    expandBaseTree() {
        var result = new Array();
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
    lineToParents(boxes) {
        if (!this.person || (!this.person.parents))
            return null;
        var find = (p, boxes) => {
            for (var box of boxes) {
                if (box.person && box.person === p) {
                    return box;
                }
            }
            return null;
        };
        var dadBox = find(this.person.parents.dad, boxes);
        var mamBox = find(this.person.parents.mam, boxes);
        var from = PathHelper.getCenter(dadBox, mamBox);
        return Line.lineToChild(from, this);
    }
    // Set position for partner
    positionPartner() {
        let space = BoxHorizontalSpace;
        let rghLimit = this._rightLimit - space - this.width;
        if (!this.partner) {
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
        }
        else {
            this.partner.x = this.x;
            this.x = this.partner.x + this.partner.width + space;
        }
        this.familyWidth = 2 * this.width + space;
    }
    // Set position to all children and there families
    positionChildren() {
        if (!this._children)
            return null;
        var space = BoxHorizontalSpace;
        var childrenWidth = 0;
        var c = Math.max(1, this.countNodes(this._children) - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        var leftLimit = this._leftLimit;
        var result = new Array();
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
    calculateFamilyWidth(pBox) {
        if (!pBox)
            return [0, 0];
        var left = pBox.x;
        var right = pBox.x + pBox.width;
        for (var child of pBox._children) {
            var [l, r] = this.calculateFamilyWidth(child);
            left = Math.min(left, l);
            right = Math.max(right, r);
        }
        return [left, right];
    }
    // Make space for partner
    expandPartner() {
        if (!this.person || !this.person.marriedPartner)
            return;
        if (!this._partnerBox) {
            this._partnerBox = new PersonBox(this.person.marriedPartner);
        }
        this._partnerBox._partnerBox = this;
        this.positionPartner();
    }
    // Make space for children
    expandChildren() {
        if (!this.person)
            return null;
        var children = this.person.marriageChildren;
        if (!children)
            return null;
        for (var child of children) {
            this._children.push(new PersonBox(child));
        }
        return this.positionChildren();
    }
    countNodes(siblingNodes) {
        if (!siblingNodes)
            return 0;
        var i = 0;
        for (var person of siblingNodes) {
            i++;
            if (person.person.marriedPartner)
                i++;
        }
        return i;
    }
    toString() {
        return this.name;
    }
}
exports.PersonBox = PersonBox;
class Line {
    static lineToChild(from, child) {
        var l = new Line();
        l.pointFrom = from;
        l.personTo = child;
        l.lineType = LineType.Child;
        return l;
    }
    ;
    static lineTo(from, to, lineType) {
        var l = new Line();
        l.personFrom = from;
        l.personTo = to;
        l.lineType = lineType;
        return l;
    }
    ;
}
var LineType;
(function (LineType) {
    LineType[LineType["Partners"] = 0] = "Partners";
    LineType[LineType["Parents"] = 1] = "Parents";
    LineType[LineType["Child"] = 2] = "Child";
})(LineType || (LineType = {}));
class EventDispatcher {
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
    register(handler) {
        this._handlers.push(handler);
    }
    /**
     * Desubscribe a handler from the dispatcher.
     * @param handler The handler to remove.
     */
    unregister(handler) {
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
    dispatch(event) {
        for (let handler of this._handlers) {
            handler(event);
        }
    }
}
exports.EventDispatcher = EventDispatcher;
//# sourceMappingURL=PersonBox.js.map