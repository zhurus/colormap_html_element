class Line {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
    }
    copy() {
        let p1 = this.point1.copy();
        let p2 = this.point2.copy();
        let res = Object.create(Object.getPrototypeOf(this));
        res.point1 = p1;
        res.point2 = p2;
        return res;
    }
}

class GraphicsLine extends Line {
    constructor(point1, point2) {
        super(point1, point2);
        this.color = {
            r: 0,
            g: 0,
            b: 0
        };
        this.thickness = 1;
    }
    copy() {
        let c = super.copy();
        c.color = {
            r: this.color.r,
            g: this.color.g,
            b: this.color.b
        };
        c.thickness = this.thickness;
        return c;
    }
}