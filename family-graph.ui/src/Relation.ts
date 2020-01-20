class Relation {
    
    private _dad: Person;
    private _mam: Person;
    private _children = new Array<Person>();
    private _status = RelationStatus.Married;


    constructor(dad: Person, mam: Person, status?:RelationStatus) {
        this.dad = dad;
        this.mam = mam;
        if (status) {
            this.status = status;
        }
        this.dad.relations.push(this);
        this.mam.relations.push(this);
    }

   

    get dad(): Person {
        return this._dad;
    }

    set dad(value: Person) {
        this._dad = value;
    }
    get mam(): Person {
        return this._mam;
    }

    set mam (value: Person) {
        this._mam = value;
    }
    get status(): RelationStatus {
        return this._status;
    }

    set status(value: RelationStatus) {
        this._status = value;
    }

    get children(): Person[] {
        return this._children;
    }

    set children(value: Person[]) {
        this._children = value;
    }

    addChildren(children: Person[]) {
        if (!children) return;

        for (var i in children) {
            let child = children[i];
            child.parents = this;
            this._children.push(child);
        }
    }

}



enum RelationStatus {
    Married,
    Divorced,
    Couple,
    Unknown
}