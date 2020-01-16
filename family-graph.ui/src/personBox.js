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
    function PersonBox(name, isMale) {
        var _this = _super.call(this) || this;
        _this._classFemale = "female-box";
        _this._classMale = "male-box";
        _this.width = 400;
        _this.height = 250;
        _this.name = name;
        _this.isMale = isMale;
        if (isMale) {
            _this._boxClass = _this._classMale;
        }
        else {
            _this._boxClass = _this._classFemale;
        }
        return _this;
    }
    Object.defineProperty(PersonBox.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
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
        var rect = _super.prototype.getNode.call(this, 'rect', {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rx: 30,
            ry: 10,
            class: this._boxClass
        });
        var text = this.getNode('text', {
            x: this.x + 20,
            y: this.y + 80,
            class: 'persons-name'
        });
        text.textContent = this.name;
        return [rect, text];
    };
    return PersonBox;
}(Box));
var MaleBox = /** @class */ (function (_super) {
    __extends(MaleBox, _super);
    function MaleBox(name) {
        return _super.call(this, name, true) || this;
    }
    return MaleBox;
}(PersonBox));
var FemaleBox = /** @class */ (function (_super) {
    __extends(FemaleBox, _super);
    function FemaleBox(name) {
        return _super.call(this, name, false) || this;
    }
    return FemaleBox;
}(PersonBox));
//# sourceMappingURL=personBox.js.map