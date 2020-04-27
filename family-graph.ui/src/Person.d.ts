declare class Person {
    id?: number;
    firstName?: string;
    lastName?: string;
    maidenName?: string;
    birth?: Date;
    death?: Date;
    gender: Gender;
    relations: Relation[];
    parents: Relation;
    constructor(id?: number, firstName?: string, lastName?: string, gender?: Gender, maidenName?: string, birth?: Date, death?: Date);
    get fullName(): string;
    get marriedPartner(): Person;
    get marriageChildren(): Person[];
}
declare enum Gender {
    Male = 0,
    Female = 1
}
