class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Point(this.x, this.y);
    }
}

class GraphicsPoint extends Point {
    static width = 10;
    static height = 10;

    constructor(x, y) {
        super(x, y);
        this.color  = null;
        this.selected = false;
    }
    outlineRect() {
        let rect;
        let color = {
            r: 0,
            g: 0,
            b: 0
        };
        if(this.selected) {
            rect = new FilledRect(
                this.x - GraphicsPoint.width/2,
                this.y - GraphicsPoint.height/2,
                GraphicsPoint.width,
                GraphicsPoint.height
            );
        }
        else {
            rect = new StrokeRect(
                this.x - GraphicsPoint.width/2,
                this.y - GraphicsPoint.height/2,
                GraphicsPoint.width,
                GraphicsPoint.height
            );
        }
        rect.color = color;
        return rect;
    }
    isHovered(x, y) {
        return this.outlineRect().contains(point);
    }
    copy() {
        let c = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        c.color = {
            r: this.color.r,
            g: this.color.g,
            b: this.color.b,
        };
        return c;
    }
}

class MovablePoint extends GraphicsPoint {
    constructor(x, y) {
        super(x, y);
    }
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}

class PointWithLimits extends MovablePoint {
    constructor(x, y) {
        super(x, y);
        this.minX = null;
        this.maxX = null;
        this.minY = null;
        this.maxY = null;
    }
    setMinX(minX) {
        this.minX = minX;
        if(this.maxX != null && minX >= this.maxX)
            this.maxX = minX;
        if(this.x < minX)
            this.x = minX;
    }
    setMaxX(maxX) {
        this.maxX = maxX;
        if(this.minX != null && maxX <= this.minX)
            this.minX = maxX;
        if(this.x > maxX)
            this.x = maxX;
    }
    setMinY(minY) {
        this.minY = minY;
        if(this.maxY != null && minY >= this.maxY)
            this.maxY = minY;
        if(this.y < minY)
            this.y = minY;
    }
    setMaxY(maxY) {
        this.maxY = maxY;
        if(this.minY != null && maxY <= this.minY)
            this.minY = maxY;
        if(this.y > maxY)
            this.y = maxY;
    }
    setFixedX(x) {
        this.x = x;
        this.minX = x;
        this.maxX = x;
    }
    moveTo(x, y) {
        let fitVal = (val, range) => {
            if(range[0] != null && range[1] != null) {
                if(val >= range[0] && val <= range[1])
                    return val;
                else if(val < this.minX)
                    return range[0];
                else if(val > range[1])
                    return range[1];
            }
            else if(range[0] != null) {
                if(val > range[0])
                    return val;
                else
                    return range[0];
            }
            else if(range[1] != null) {
                if(val < range[1])
                    return val;
                else
                    return range[1];
            }
            else
                return val;
        };
        this.x = fitVal(x, [this.minX, this.maxX]);
        this.y = fitVal(y, [this.minY, this.maxY]);
    }
}