var PathHelper = /** @class */ (function () {
    function PathHelper() {
    }
    // Connect two boxes with line
    PathHelper.drawLine = function (box1, box2) {
        if (!box1 || !box2)
            return null;
        var dx1 = box1.x + (box1.width / 2);
        var dy1 = box1.y + (box1.height / 2);
        var dx2 = box2.x + (box2.width / 2);
        var dy2 = box2.y + (box2.height / 2);
        var dy = ((dy1 + dy2) / 2);
        var path = "M " + dx1 + " " + dy1 +
            " L " + dx1 + " " + dy +
            " L " + dx2 + " " + dy +
            " L " + dx2 + " " + dy2 +
            " ";
        var v = this.getNode('path', {
            d: path,
            class: 'path'
        });
        return v;
    };
    ;
    // draw line from point to box
    PathHelper.drawLineFrom = function (point, toBox) {
        if (!point || !toBox)
            return null;
        var dx2 = toBox.x + (toBox.width / 2);
        var dy2 = toBox.y + (toBox.height / 2);
        var dy = ((point.y + dy2) / 2);
        var path = "M " + point.x + " " + point.y +
            " L " + point.x + " " + dy +
            " L " + dx2 + " " + dy +
            " L " + dx2 + " " + dy2 +
            " ";
        var v = this.getNode('path', {
            d: path,
            class: 'path'
        });
        return v;
    };
    ;
    // Get center between two boxes, ie parents
    PathHelper.getCenter = function (box1, box2) {
        if (!box1 && !box2)
            return null;
        var x = 0;
        var y = 0;
        var dx1 = 0;
        var dy1 = 0;
        var dx2 = 0;
        var dy2 = 0;
        if (box1) {
            x = dx1 = box1.x + (box1.width / 2);
            y = dy1 = box1.y + (box1.height / 2);
        }
        if (box2) {
            x = dx2 = box2.x + (box2.width / 2);
            y = dy2 = box2.y + (box2.height / 2);
        }
        if (box1 && box2) {
            x = (dx1 + dx2) / 2;
            y = (dy1 + dy2) / 2;
        }
        var c = new DOMPoint(x, y, 0, 0);
        return c;
    };
    PathHelper.getNode = function (tag, attr) {
        var b = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (var p in attr)
            b.setAttributeNS(null, p, attr[p]);
        return b;
    };
    return PathHelper;
}());
//# sourceMappingURL=PathHelper.js.map