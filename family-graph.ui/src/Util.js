"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Position {
    static setLeftParents(child) {
        if (!child)
            return;
        let leftestParent = Find.findLeftestParent(child);
        if (!leftestParent)
            return;
        leftestParent.person.x = child.x;
        this.setPositionStartingFrom(leftestParent.person, child);
    }
    static setPositionStartingFrom(start, stop) {
        if (!start)
            return;
        this.positionPartner(start);
    }
    static positionPartner(person) {
        if (!person || !person.partner)
            return;
        person.partner.y = person.y;
        if (person.isMale) {
            person.partner.x = person.x + person.width + BoxHorizontalSpace;
        }
        else {
            person.partner.x = person.x;
            person.x = person.partner.x + person.partner.width + BoxHorizontalSpace;
        }
    }
    static positionParents(person) {
        if (!person || person._parents.length === 0)
            return;
        if (person.hasBothParents) {
            if (person.isMale) {
                person.dad.x = person.x - BoxHorizontalSpace - person.dad.width;
            }
            else {
                person.dad.x = person.x;
            }
            person.dad.y = person.y + BoxVerticalSpace;
            this.positionPartner(person.dad);
        }
        else {
            // one known parent
            person._parents[0].x = person.x;
            person._parents[0].y = person.y + BoxVerticalSpace;
        }
    }
}
class Find {
    static findRightestParent(child) {
        let f = this.findRightestParentDepth(new PersonDepth(child, 0));
        return (f) ? f : null;
    }
    static findRightestParentDepth(child) {
        if (!child)
            return null;
        if (!child.person)
            return null;
        let hasBothParents = child.person.dad && child.person.dad;
        let dad = this.findRightestParentDepth(new PersonDepth(child.person.dad, hasBothParents ? (child.depth - 1) : child.depth));
        let mam = this.findRightestParentDepth(new PersonDepth(child.person.mam, hasBothParents ? (child.depth + 1) : child.depth));
        let final = (mam && mam.depth > dad.depth) ? mam : dad;
        return (final && child.depth <= final.depth) ? final : child;
    }
    static findLeftestParent(child) {
        let f = this.findLeftestParentDepth(new PersonDepth(child, 0));
        return (f) ? f : null;
    }
    static findLeftestParentDepth(child) {
        if (!child)
            return null;
        if (!child.person)
            return null;
        let hasBothParents = child.person.dad && child.person.dad;
        let dad = this.findLeftestParentDepth(new PersonDepth(child.person.dad, hasBothParents ? (child.depth - 1) : child.depth));
        let mam = this.findLeftestParentDepth(new PersonDepth(child.person.mam, hasBothParents ? (child.depth + 1) : child.depth));
        let final = (dad && dad.depth <= mam.depth) ? dad : mam;
        return (final && child.depth > final.depth) ? final : child;
    }
}
class PersonDepth {
    constructor(p, d) {
        this.depth = 0;
        this.person = p;
        this.depth = d;
    }
}
//# sourceMappingURL=Util.js.map