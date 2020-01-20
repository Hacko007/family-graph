var Relation = /** @class */ (function () {
    function Relation(dad, mam, status) {
        this._children = new Array();
        this._status = RelationStatus.Married;
        this.dad = dad;
        this.mam = mam;
        if (status) {
            this.status = status;
        }
        this.dad.relations.push(this);
        this.mam.relations.push(this);
    }
    Object.defineProperty(Relation.prototype, "dad", {
        get: function () {
            return this._dad;
        },
        set: function (value) {
            this._dad = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Relation.prototype, "mam", {
        get: function () {
            return this._mam;
        },
        set: function (value) {
            this._mam = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Relation.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (value) {
            this._status = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Relation.prototype, "children", {
        get: function () {
            return this._children;
        },
        set: function (value) {
            this._children = value;
        },
        enumerable: true,
        configurable: true
    });
    Relation.prototype.addChildren = function (children) {
        if (!children)
            return;
        for (var i in children) {
            var child = children[i];
            child.parents = this;
            this._children.push(child);
        }
    };
    return Relation;
}());
var RelationStatus;
(function (RelationStatus) {
    RelationStatus[RelationStatus["Married"] = 0] = "Married";
    RelationStatus[RelationStatus["Divorced"] = 1] = "Divorced";
    RelationStatus[RelationStatus["Couple"] = 2] = "Couple";
    RelationStatus[RelationStatus["Unknown"] = 3] = "Unknown";
})(RelationStatus || (RelationStatus = {}));
//# sourceMappingURL=Relation.js.map