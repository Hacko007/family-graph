class Relation {
    constructor(dad, mam, status) {
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
    get dad() {
        return this._dad;
    }
    set dad(value) {
        this._dad = value;
    }
    get mam() {
        return this._mam;
    }
    set mam(value) {
        this._mam = value;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    get children() {
        return this._children;
    }
    set children(value) {
        this._children = value;
    }
    addChildren(children) {
        if (!children)
            return;
        for (var i in children) {
            let child = children[i];
            child.parents = this;
            this._children.push(child);
        }
    }
}
var RelationStatus;
(function (RelationStatus) {
    RelationStatus[RelationStatus["Married"] = 0] = "Married";
    RelationStatus[RelationStatus["Divorced"] = 1] = "Divorced";
    RelationStatus[RelationStatus["Couple"] = 2] = "Couple";
    RelationStatus[RelationStatus["Unknown"] = 3] = "Unknown";
})(RelationStatus || (RelationStatus = {}));
//# sourceMappingURL=Relation.js.map