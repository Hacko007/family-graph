class Person {
    id?:number;
    firstName?: string;
    lastName?: string;
    maidenName?: string;
    birth?: Date;
    death?: Date;
    gender = Gender.Male;

    relations = new Array<Relation>();
    parents:Relation;

    constructor(id?: number, firstName?: string, lastName?: string, gender?:Gender,  maidenName?:string, birth?: Date, death?: Date) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.maidenName = maidenName;
        this.birth = birth;
        this.death = death;
    }

    get fullName(): string {
        return this.firstName + " " + this.lastName;
    }

    get marriedPartner(): Person {
        if (this.relations.length === 0)
            return null;
        for (var rel of this.relations) {
            if (rel.status === RelationStatus.Married) {
                if (rel.dad === this)
                    return rel.mam;
                else
                    return rel.dad;
            }
        }
        return null;
    }

    get marriageChildren(): Person[] {
        if (this.relations.length === 0)
            return null;
        for (var rel of this.relations) {
            if (rel.status === RelationStatus.Married) {
                return rel.children;
            }
        }
        return null;
    }
    
}

enum Gender {
    Male,
    Female
}