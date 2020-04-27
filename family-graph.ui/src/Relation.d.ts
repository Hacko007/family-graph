declare class Relation {
    private _dad;
    private _mam;
    private _children;
    private _status;
    constructor(dad: Person, mam: Person, status?: RelationStatus);
    get dad(): Person;
    set dad(value: Person);
    get mam(): Person;
    set mam(value: Person);
    get status(): RelationStatus;
    set status(value: RelationStatus);
    get children(): Person[];
    set children(value: Person[]);
    addChildren(children: Person[]): void;
}
declare enum RelationStatus {
    Married = 0,
    Divorced = 1,
    Couple = 2,
    Unknown = 3
}
