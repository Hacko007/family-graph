var Person = /** @class */ (function () {
    function Person(id, firstName, lastName, gender, maidenName, birth, death) {
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
    Object.defineProperty(Person.prototype, "fullName", {
        get: function () {
            return this.firstName + " " + this.lastName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "marriedPartner", {
        get: function () {
            if (this.relations.length === 0)
                return null;
            for (var _i = 0, _a = this.relations; _i < _a.length; _i++) {
                var rel = _a[_i];
                if (rel.status === RelationStatus.Married) {
                    if (rel.dad === this)
                        return rel.mam;
                    else
                        return rel.dad;
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Person.prototype, "marriageChildren", {
        get: function () {
            if (this.relations.length === 0)
                return null;
            for (var _i = 0, _a = this.relations; _i < _a.length; _i++) {
                var rel = _a[_i];
                if (rel.status === RelationStatus.Married) {
                    return rel.children;
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return Person;
}());
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 0] = "Male";
    Gender[Gender["Female"] = 1] = "Female";
})(Gender || (Gender = {}));
//# sourceMappingURL=Person.js.map