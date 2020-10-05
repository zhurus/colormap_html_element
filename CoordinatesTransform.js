class CoordinatesTransform {
    constructor() {
        this.screenWidth = null;
        this.screenHeight = null;
        this.margin = {
            top: 30,
            bottom: 25,
            left: 40,
            right: 20
        };

        this.width = 1;
        this.height = 1;
        this.inverseY = true;
    }
    adaptToCanvas(canvas) {
        this.screenHeight = canvas.height;
        this.screenWidth = canvas.width;
    }
    toScreenX(x) {
        return this.margin.left + 
            (this.screenWidth - this.margin.left - this.margin.right) * x / this.width;
    }
    toScreenY(y) {
        let res = this.screenHeight - this.margin.top - this.margin.bottom;
        res *= y / this.height;
        if(this.inverseY)
            res = this.screenHeight - this.margin.bottom - res;
        else
            res += this.margin.top;
        return res;
    }
    toScreenSizeX(sizeX) {
        return sizeX * (this.screenWidth - this.margin.left - this.margin.right) / this.width;
    }
    toScreenSizeY(sizeY) {
        return sizeY * (this.screenHeight - this.margin.top - this.margin.bottom) / this.height;
    }
    fromScreenX(x) {
        let res = x - this.margin.left;
        return res / (this.screenWidth - this.margin.left - this.margin.right);
    }
    fromScreenY(y) {
        let res;
        if(this.inverseY)
            res = this.screenHeight - y - this.margin.bottom;
        else 
            res = y - this.margin.top;
        return res / (this.screenHeight - this.margin.bottom - this.margin.top);
    }
    fromScreenSizeX(sizeX) {
        return sizeX / (this.screenWidth - this.margin.left - this.margin.right) * this.width;
    }
    fromScreenSizeY(sizeY) {
        return sizeY / (this.screenHeight - this.margin.top - this.margin.bottom) * this.height;
    }
    fromScreenRect(rect) {
        let res = rect.copy();
        res.x = this.fromScreenX(rect.x);
        res.width = this.fromScreenSizeX(rect.width);
        res.height = this.fromScreenSizeY(rect.height);
        if(this.inverseY)
            res.y = this.fromScreenY(rect.y + rect.height);
        else
            res.y = this.fromScreenY(rect.y);
        return res;
    }
    toScreenPoint(point) {
        let copy = point.copy();
        copy.x = this.toScreenX(point.x);
        copy.y = this.toScreenY(point.y);
        return copy;
    }
    toScreenLine(line) {
        let cp = line.copy();
        cp.point1 = this.toScreenPoint(line.point1);
        cp.point2 = this.toScreenPoint(line.point2);
        return cp;
    }
    toScreenRect(rect) {
        let res = rect.copy();
        res.width = this.toScreenSizeX(rect.width);
        res.height = this.toScreenSizeY(rect.height);
        res.x = this.toScreenX(rect.x);
        if(this.inverseY)
            res.y = this.toScreenY(rect.y + rect.height);
        else
            res.y = this.toScreenX(rect.y);
        return res; 
    }
    setMarginTop(topMargin) {
        this.margin.top = topMargin;
    }
    setMarginBottom(bottomMargin) {
        this.margin.bottom = bottomMargin;
    }
    setMarginLeft(leftMargin) {
        this.margin.left = leftMargin;
    }
    setMarginRight(rightMargin) {
        this.margin.right = rightMargin;
    }
}