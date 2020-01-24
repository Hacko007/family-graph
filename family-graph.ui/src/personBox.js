var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PersonBox = /** @class */ (function (_super) {
    __extends(PersonBox, _super);
    function PersonBox(person) {
        var _this = _super.call(this) || this;
        _this._baseFamilyWidth = BoxWidth;
        _this._familyLeft = 0;
        _this._classFemale = "female-box";
        _this._classMale = "male-box";
        _this._lines = new Array();
        _this.person = person;
        _this.isMale = person.gender === Gender.Male;
        if (_this.isMale) {
            _this._boxClass = _this._classMale;
        }
        else {
            _this._boxClass = _this._classFemale;
        }
        return _this;
    }
    Object.defineProperty(PersonBox.prototype, "name", {
        get: function () {
            return this.person.fullName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonBox.prototype, "isMale", {
        get: function () {
            return this._isMale;
        },
        set: function (value) {
            this._isMale = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PersonBox.prototype, "familyLeft", {
        get: function () {
            return this._familyLeft;
        },
        enumerable: true,
        configurable: true
    });
    PersonBox.prototype.updateLeft = function (x) {
        this._familyLeft = Math.min(this._familyLeft, x);
    };
    Object.defineProperty(PersonBox.prototype, "familyWidth", {
        get: function () {
            return this._baseFamilyWidth;
        },
        set: function (value) {
            this._baseFamilyWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    PersonBox.prototype.createBaseTree = function () {
        var _this = this;
        this._familyLeft = this.x;
        var boxes = this.expandeBaseTree();
        if (!boxes)
            return null;
        var elements = new Array();
        // Connection
        for (var _i = 0, boxes_1 = boxes; _i < boxes_1.length; _i++) {
            var pbox = boxes_1[_i];
            for (var _a = 0, _b = pbox._lines; _a < _b.length; _a++) {
                var line = _b[_a];
                if (line.lineType === LineType.Child) {
                    this.add(elements, PathHelper.drawLineFrom(line.pointFrom, line.personTo));
                }
                else {
                    this.add(elements, PathHelper.drawLine(line.personFrom, line.personTo));
                }
            }
        }
        // Boxes
        for (var _c = 0, boxes_2 = boxes; _c < boxes_2.length; _c++) {
            var pbox = boxes_2[_c];
            pbox.create().forEach(function (p) { return _this.add(elements, p); });
        }
        return elements;
    };
    PersonBox.prototype.expandeBaseTree = function () {
        var lineToChild = function (from, child) {
            var l = new Line();
            l.pointFrom = from;
            l.personTo = child;
            l.lineType = LineType.Child;
            return l;
        };
        var lineToPartner = function (from, to, lineType) {
            var l = new Line();
            l.personFrom = from;
            l.personTo = to;
            l.lineType = LineType.Partners;
            return l;
        };
        var result = new Array();
        result.push(this);
        this._familyLeft = this.x;
        var partnerBox = this.expandPartner();
        if (partnerBox) {
            this._lines.push(lineToPartner(this, partnerBox, LineType.Partners));
            result.push(partnerBox);
        }
        var childrenBoxes = this.expandChildren();
        if (childrenBoxes) {
            var from = PathHelper.getCenter(this, partnerBox);
            for (var _i = 0, childrenBoxes_1 = childrenBoxes; _i < childrenBoxes_1.length; _i++) {
                var child = childrenBoxes_1[_i];
                this._lines.push(lineToChild(from, child));
                child.expandeBaseTree().forEach(function (ch) { return result.push(ch); });
            }
        }
        return result;
    };
    PersonBox.prototype.create = function () {
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
        return [rect, text];
    };
    PersonBox.prototype.positionPartner = function (partner) {
        if (!partner)
            return;
        var space = BoxHorizontalSpace * 2;
        partner.y = this.y;
        if (this.isMale) {
            partner.x = this.x + this.width + space;
        }
        else {
            this.x = partner.x + partner.width + space;
        }
        this.familyWidth = 2 * this.width + space;
    };
    PersonBox.prototype.positionChildren = function (children) {
        var space = BoxHorizontalSpace * 2;
        if (!children)
            return null;
        var childrenWidth = 0;
        var c = Math.max(1, children.length - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        var result = new Array();
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            child.x = x;
            child.y = y;
            //child.expandeBaseTree();
            x += child.familyWidth + space;
            childrenWidth += child.familyWidth + space;
            this.updateLeft(x);
        }
        this.familyWidth = Math.max(this.familyWidth, childrenWidth);
        console.log("fam Left:" + this.familyLeft);
        console.log("fam Width:" + this.familyWidth);
        return result;
    };
    // Create position for partner and children
    PersonBox.prototype.expandPartner = function () {
        if (!this.person)
            return null;
        var partner = this.person.marriedPartner;
        if (!partner)
            return null;
        var partnerBox = new PersonBox(partner);
        this.positionPartner(partnerBox);
        return partnerBox;
    };
    // Create position for partner and children
    PersonBox.prototype.expandChildren = function () {
        if (!this.person)
            return null;
        var children = this.person.marriageChildren;
        if (!children)
            return null;
        var chBoxs = new Array();
        for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
            var child = children_2[_i];
            chBoxs.push(new PersonBox(child));
        }
        return this.positionChildren(chBoxs);
        //return chBoxs;
    };
    PersonBox.prototype.add = function (list, item) {
        if (!item)
            return;
        list.push(item);
    };
    return PersonBox;
}(Box));
var Line = /** @class */ (function () {
    function Line() {
    }
    return Line;
}());
var LineType;
(function (LineType) {
    LineType[LineType["Partners"] = 0] = "Partners";
    LineType[LineType["Parents"] = 1] = "Parents";
    LineType[LineType["Child"] = 2] = "Child";
})(LineType || (LineType = {}));
//# sourceMappingURL=personBox.js.map