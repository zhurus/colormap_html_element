class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}

class GraphicsPoint extends Point {
    constructor(x, y) {
        super(x, y);
        this.selected = false;
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