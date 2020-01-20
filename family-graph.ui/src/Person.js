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
    return Person;
}());
var Gender;
(function (Gender) {
    Gender[Gender["Male"] = 0] = "Male";
    Gender[Gender["Female"] = 1] = "Female";
})(Gender || (Gender = {}));
//# sourceMappingURL=Person.js.map