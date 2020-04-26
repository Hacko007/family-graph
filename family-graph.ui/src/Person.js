class Person {
    constructor(id, firstName, lastName, gender, maidenName, birth, death) {
        this.gender = Gender.Male;
        this.relations = new Array();
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.maidenName = maidenName;
        this.birth = birth;
        this.death = death;
    }
    get fullName() {
        return this.firstName + " " + this.lastName;
    }
    get marriedPartner() {
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
    get marriageChildren() {
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
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 0] = "Male";
    Gender[Gender["Female"] = 1] = "Female";
})(Gender || (Gender = {}));
//# sourceMappingURL=Person.js.map