"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PersonBox extends Box {
    constructor(person) {
        super();
        this._leftLimit = -1000000;
        this._rightLimit = 1000000;
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
        this._onClickDispatcher = new EventDispatcher();
    }
    get name() {
        return this.person.fullName;
    }
    get isMale() {
        return this._isMale;
    }
    set isMale(value) {
        this._isMale = value;
    }
    get familyLeft() {
        return this._familyLeft;
    }
    updateLeft(x) {
        this._familyLeft = Math.min(this._familyLeft, x);
    }
    get familyWidth() {
        return this._baseFamilyWidth;
    }
    set familyWidth(value) {
        this._baseFamilyWidth = value;
    }
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
        text.textContent = this.name;
        rect.addEventListener("click", () => { eventPb.boxSelected(this); });
        text.addEventListener("click", () => { eventPb.boxSelected(this); });
        return [rect, text];
    }
    startFromThisPersion() {
        this.init();
        var result = new Array();
        var add = (items) => { if (items)
            items.forEach(i => result.push(i)); };
        var addBoxes = (items) => { if (items)
            items.forEach(i => i.create(this).forEach(box => result.push(box))); };
        var olds = this.drawParents();
        var baseFamily = this.createBaseTree();
        add(this.drawLines(baseFamily));
        add(this.drawLines(olds));
        addBoxes(olds);
        addBoxes(baseFamily);
        return result;
    }
    // return max boxes on one level
    populateParents() {
        let myParentThicknes = 0;
        let partnrerParentThicknes = 0;
        var createParent = (p) => {
            if (!p)
                return null;
            let parent = new PersonBox(p);
            parent.x = this.x;
            parent.y = this.y - (parent.height + (BoxHorizontalSpace * 2));
            this._parents.push(parent);
            let [a, b] = parent.populateParents();
            myParentThicknes += a + b;
            return parent;
        };
        var d = this.person.parents !== undefined ? createParent(this.person.parents.dad) : null;
        var m = this.person.parents !== undefined ? createParent(this.person.parents.mam) : null;
        if (d && m) {
            d.expandPartner();
            myParentThicknes++;
        }
        // draw partners parents
        if (!this._partnerBox && this.person.marriedPartner) {
            this.expandPartner();
            let [c, d] = this._partnerBox.populateParents();
            partnrerParentThicknes = c + d;
        }
        return [myParentThicknes, partnrerParentThicknes];
    }
    drawParents() {
        let [myParentThicknes, partnrerParentThicknes] = this.populateParents();
        // Position box
        let myParentsWidth = myParentThicknes * (this.width + BoxHorizontalSpace);
        let partnerParentsWidth = partnrerParentThicknes * (this.width + BoxHorizontalSpace);
        this.positonParents(myParentsWidth, this);
        this.positonParents(partnerParentsWidth, this._partnerBox);
        console.log(myParentsWidth, partnerParentsWidth, this._parents, this._partnerBox._parents);
        // Draw connecting lines 
        var result = new Array();
        var add = (parents) => {
            if (!parents || parents.length === 0)
                return;
            if (parents.length === 1) {
                let p = parents.pop();
                result.push(p);
                add(p._parents);
                return;
            }
            let m = parents.pop();
            let d = parents.pop();
            d._lines.push(Line.lineTo(d, m, LineType.Partners));
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
        //var d: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.dad) : null;
        //var m: PersonBox = this.person.parents !== undefined ? createParent(this.person.parents.mam) : null;
        //if (d && m) {
        //    d.expandPartner();                    
        //    d._lines.push( Line.lineTo(d, m, LineType.Partners));
        //}
        //this._lines.push(this.lineToParents([d, m]));
        //// draw partners parents
        //if (!this._partnerBox && this.person.marriedPartner) {
        //    this.expandPartner();
        //    let partnerParents = this._partnerBox.drawParents();
        //    this._lines.push(this._partnerBox.lineToParents(partnerParents));
        //    //add(partnerParents);
        //}
        return result;
    }
    // place parents in middel of width
    positonParents(width, _me) {
        if (!_me)
            return;
        if (_me._parents.length === 0)
            return;
        if (_me._parents.length === 1) {
            _me._parents[0].x = _me.x;
            this.positonParents(width, _me._parents[0]);
            _me._lines.push(_me.lineToParents(_me._parents));
            return;
        }
        let dx = 0;
        // dad
        if (_me.isMale) {
            dx = _me.x - width + _me.width + BoxHorizontalSpace;
        }
        else {
            dx = _me.x - BoxHorizontalSpace;
        }
        let midDx = dx + (width / 2) - _me.width - BoxHorizontalSpace;
        _me._parents[0].x = midDx;
        console.log(_me._parents[0].name, _me.x, dx, midDx, width);
        // mam
        _me._parents[0].positionPartner(_me._parents[1]);
        _me._lines.push(_me.lineToParents(_me._parents));
        this.positonParents(width, _me._parents[0]);
        this.positonParents(width, _me._parents[1]);
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
    positionPartner(partner) {
        if (!partner)
            return;
        var space = BoxHorizontalSpace * 2;
        partner.y = this.y;
        let rghLimit = this._rightLimit - this.width - space;
        rghLimit -= this.isMale ? this.width : 0;
        this.x = Math.min(this.x, rghLimit);
        this.x = Math.max(this.x, this._leftLimit);
        if (this.isMale) {
            partner.x = this.x + this.width + space;
        }
        else {
            partner.x = this.x;
            this.x = partner.x + partner.width + space;
        }
        this.familyWidth = 2 * this.width + space;
    }
    // Set position to all children and there families
    positionChildren() {
        if (!this._children)
            return null;
        var space = BoxHorizontalSpace * 2;
        var childrenWidth = 0;
        //console.log(this.person.firstName + "\tx:" + this.x + "\ty:" + this.y);
        var c = Math.max(1, this.countNodes(this._children) - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        //console.log(this.name, this._leftLimit, x);
        //console.log(this.person.firstName + "\tc:" + c + "\tx:" + x + "\ty:" + y);
        var leftLimit = this._leftLimit;
        var result = new Array();
        for (var child of this._children) {
            child.y = y;
            child.x = Math.max(x, leftLimit);
            child._leftLimit = leftLimit;
            var childsFamily = child.expandBaseTree();
            var [left, right] = this.calculateFamilyWidth(child);
            //console.log(child.name, child.x, x, left, right);
            x = right + space; /// child.x + child.familyWidth + space;
            leftLimit = x;
            childrenWidth = right; //+=  child.familyWidth + space;     
            child.familyWidth = right;
            childsFamily.forEach(f => result.push(f));
            //console.log("ch:" + child.person.firstName + "\t\tx,y,left,width:\t" + child.x + ",\t" + child.y + ",\t" + child.familyLeft + " \t" + child.familyWidth);            
        }
        this.familyWidth = Math.max(this.familyWidth, childrenWidth);
        //console.log(this.person.firstName + "\t\tx,y,left,width:\t" + this.x + ",\t" + this.y + ",\t" + this.familyLeft + " \t" + this.familyWidth);
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
        if (!this.person)
            return;
        var partner = this.person.marriedPartner;
        if (!partner)
            return;
        this._partnerBox = new PersonBox(partner);
        this._partnerBox._partnerBox = this;
        this.positionPartner(this._partnerBox);
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