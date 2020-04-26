"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PersonBox extends Box {
    constructor(person) {
        super();
        this._baseFamilyWidth = BoxWidth;
        this._familyLeft = 0;
        this._classFemale = "female-box";
        this._classMale = "male-box";
        this._lines = new Array();
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
    boxSelected(id) {
        console.log(id + " clicked");
        //todo
        //this._onClickDispatcher.dispatch(id);        
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
    create() {
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
        rect.addEventListener("click", () => { this.boxSelected(this.person.id); });
        text.addEventListener("click", () => { this.boxSelected(this.person.id); });
        return [rect, text];
    }
    startFromThisPersion() {
        var result = this.createBaseTree();
        var olds = this.drawParents();
        olds.forEach(i => i.create().forEach(box => result.push(box)));
        return result;
    }
    drawParents() {
        var result = new Array();
        var add = (items) => { if (items)
            items.forEach(i => result.push(i)); };
        var createParent = (p) => {
            if (!p)
                return null;
            var parent = new PersonBox(p);
            parent.x = this.x;
            parent.y = this.y - (parent.height + (BoxHorizontalSpace * 2));
            add(parent.drawParents());
            result.push(parent);
            return parent;
        };
        var d = this.person.parents !== undefined ? createParent(this.person.parents.dad) : null;
        var m = this.person.parents !== undefined ? createParent(this.person.parents.mam) : null;
        if (d && m) {
            d.x = d.x - (d.width + BoxVerticalSpace);
            m.x = m.x + BoxVerticalSpace * 2;
            console.log(d);
            console.log(m);
        }
        return result;
    }
    createBaseTree() {
        this._familyLeft = this.x;
        var boxes = this.expandBaseTree();
        if (!boxes)
            return null;
        var elements = new Array();
        var add = (item) => { if (item)
            elements.push(item); };
        // Connection
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
        // Boxes
        for (var pbox of boxes) {
            pbox.create().forEach(p => add(p));
        }
        return elements;
    }
    expandBaseTree() {
        var result = new Array();
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
    positionChildren(children) {
        if (!children)
            return null;
        var space = BoxHorizontalSpace * 2;
        var childrenWidth = 0;
        //console.log(this.person.firstName + "\tx:" + this.x + "\ty:" + this.y);
        var c = Math.max(1, this.countNodes(children) - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        //console.log(this.person.firstName + "\tc:" + c + "\tx:" + x + "\ty:" + y);
        var result = new Array();
        for (var child of children) {
            child.x = x;
            child.y = y;
            var childsFamily = child.expandBaseTree();
            x += child.familyWidth + space;
            childrenWidth += child.familyWidth + space;
            childsFamily.forEach(f => result.push(f));
            //console.log("ch:" + child.person.firstName + "\t\tx,y,left,width:\t" + child.x + ",\t" + child.y + ",\t" + child.familyLeft + " \t" + child.familyWidth);            
        }
        this.familyWidth = Math.max(this.familyWidth, childrenWidth);
        //console.log(this.person.firstName + "\t\tx,y,left,width:\t" + this.x + ",\t" + this.y + ",\t" + this.familyLeft + " \t" + this.familyWidth);
        return result;
    }
    // Make space for partner
    expandPartner() {
        if (!this.person)
            return null;
        var partner = this.person.marriedPartner;
        if (!partner)
            return null;
        var partnerBox = new PersonBox(partner);
        this.positionPartner(partnerBox);
        return partnerBox;
    }
    // Make space for children
    expandChildren() {
        if (!this.person)
            return null;
        var children = this.person.marriageChildren;
        if (!children)
            return null;
        var chBoxs = new Array();
        for (var child of children) {
            chBoxs.push(new PersonBox(child));
        }
        return this.positionChildren(chBoxs);
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
}
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
//# sourceMappingURL=personBox.js.map