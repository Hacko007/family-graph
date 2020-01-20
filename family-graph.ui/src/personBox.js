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
        _this._classFemale = "female-box";
        _this._classMale = "male-box";
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
    PersonBox.prototype.create = function () {
        var rect = PathHelper.getNode('rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: 30,
            ry: 10,
            class: this._boxClass
        });
        var text = PathHelper.getNode('text', {
            x: this.x + 20,
            y: this.y + 80,
            class: 'persons-name'
        });
        text.textContent = this.name;
        return [rect, text];
    };
    PersonBox.prototype.positionPartner = function (parnter) {
        var space = BoxHorizontalSpace * 2;
        parnter.y = this.y;
        if (this.isMale) {
            parnter.x = this.x + this.width + space;
        }
        else {
            this.x = parnter.x + parnter.width + space;
        }
    };
    PersonBox.prototype.positionChildren = function (children) {
        var space = BoxHorizontalSpace * 2;
        if (!children)
            return;
        var c = Math.max(1, children.length - 1);
        var x = this.x - ((c * (this.width + space)) / 2);
        var y = this.y + this.height + space;
        for (var i in children) {
            var child = children[i];
            child.x = x;
            child.y = y;
            x += child.width + space;
        }
    };
    return PersonBox;
}(Box));
//# sourceMappingURL=personBox.js.map