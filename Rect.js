class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
    leftBottom() {
        return new Point(this.x, this.y);
    }
    leftTop() {
        return new Point(this.x, this.y + this.height);
    }
    rightBottom() {
        return new Point(this.x + this.width, this.y);
    }
    rightTop() {
        return new Point(this.x + this.width, this.y + this.height);
    }
    left() {
        return this.x;
    }
    right() {
        return this.x + this.width;
    }
    top() {
        return this.y + this.height;
    }
    bottom() {
        return this.y;
    }
    intersects(otherRect) {
        return this.contains(otherRect.leftBottom()) && 
            this.contains(otherRect.rightBottom()) &&
            this.contains(otherRect.leftTop()) &&
            this.contains(otherRect.rightTop());
    }
    contains(point) {
        if(point.x < this.x || point.x > this.x + this.width)
            return false;
        if(point.y < this.y || point.y > this.y + this.height)
            return false;
        return true;
    }
}


class GraphicsRect extends Rect {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.color = {
            r: 0,
            g: 0,
            b: 0
        };
    }
    copy() {
        let cp = super.copy();
        cp.color = {
            r: this.color.r,
            g: this.color.g,
            b: this.color.b
        };
        return cp;
    }
}

class FilledRect extends GraphicsRect {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
}

class StrokeRect extends GraphicsRect {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
}