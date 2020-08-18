import PersonBox = require("./PersonBox");
import PersonBox1 = PersonBox.PersonBox;


class Position {
    static setLeftParents(child: PersonBox1) {
        if (!child) return;
        let leftestParent = Find.findLeftestParent(child);
        if (!leftestParent) return;
        leftestParent.x = child.x;
        this.setPositionStartingFrom(leftestParent, child);
    }

    private static setPositionStartingFrom(start: PersonBox.PersonBox, stop: PersonBox.PersonBox) {
        if (!start) return;
        this.positionPartner( start);
    }

    private static positionPartner(person: PersonBox.PersonBox) {
        if (!person || !person.partner) return;

        person.partner.y = person.y;
        
        if (person.isMale) {
            person.partner.x = person.x + person.width + BoxHorizontalSpace;
        } else {
            person.partner.x = person.x;
            person.x = person.partner.x + person.partner.width + BoxHorizontalSpace;
        }
    }

    private static positionParents(person: PersonBox.PersonBox) {
        if (!person || person._parents.length === 0) return;

        if (person.hasBothParents) {
            if (person.isMale) {
                person.dad.x = person.x - BoxHorizontalSpace - person.dad.width;
            } else {
                person.dad.x = person.x;
            }
            person.dad.y = person.y + BoxVerticalSpace;
            this.positionPartner(person.dad);
        } else {
            // one known parent
            person._parents[0].x = person.x;
            person._parents[0].y = person.y + BoxVerticalSpace;
        }

    }

}

class Find {



    static findRightestParent(child: PersonBox1): PersonBox1 {
        let f = this.findRightestParentInternal(new PersonDepth(child, 0));
        return (f) ? f.person : null;
    }

    private static findRightestParentInternal(child: PersonDepth): PersonDepth {
        if (!child) return null;
        if (!child.person) return null;
        let hasBothParents = child.person.dad && child.person.dad;
        let dad = this.findRightestParentInternal(new PersonDepth(child.person.dad, hasBothParents ? (child.depth - 1) : child.depth));
        let mam = this.findRightestParentInternal(new PersonDepth(child.person.mam, hasBothParents ? (child.depth + 1) : child.depth));
        let final = (mam && mam.depth > dad.depth) ? mam : dad;
        return (final && child.depth <= final.depth) ? final : child;
    }


    static findLeftestParent(child: PersonBox1): PersonBox1 {
        let f = this.findLeftestParentInternal(new PersonDepth(child, 0));
        return (f) ? f.person: null;
    }

    private static findLeftestParentInternal(child: PersonDepth): PersonDepth {
        if (!child) return null;
        if (!child.person) return null;
        let hasBothParents = child.person.dad && child.person.dad;
        let dad = this.findLeftestParentInternal(new PersonDepth(child.person.dad, hasBothParents ? (child.depth - 1) : child.depth));
        let mam = this.findLeftestParentInternal(new PersonDepth(child.person.mam, hasBothParents ? (child.depth + 1) : child.depth));
        let final = (dad && dad.depth <= mam.depth) ? dad : mam;
        return (final && child.depth > final.depth) ? final : child;
    }
}


class PersonDepth {
    public person: PersonBox1;
    public depth: number = 0;

    constructor(p: PersonBox1, d: number) {
        this.person = p;
        this.depth = d;
    }
}