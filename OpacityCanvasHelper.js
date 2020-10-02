class OpacityCanvasHelper {
    constructor(canvas) {
        canvas.helper = this;
        this.screenWidth = canvas.width;
        this.screenHeight = canvas.height;
        this.margin = {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        };
        this.width = 1.15;
        this.heigth = 1.15;
    }
    toScreenX(x) {
        return this.margin.left + 
            (this.screenWidth - this.margin.left - this.margin.right) * x / this.width;
    }
    toScreenY(y) {
        let res = this.screenHeight - this.margin.top - this.margin.bottom;
        res *= y / this.heigth;
        res = this.screenHeight - this.margin.bottom - res;
        return res;
    }
    fromScreenX(x) {
        let res = x - this.margin.left;
        return res / (this.screenWidth - this.margin.left - this.margin.right);
    }
    fromScreenY(y) {
        let res = this.screenHeight - y - this.margin.bottom;
        return res / (this.screenHeight - this.margin.bottom - this.margin.top);
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
        let x2 = res.x + res.width;
        let y2 = res.y + res.height;
        res.x = this.toScreenX(rect.x);
        res.y = this.toScreenX(rect.y);
        res.width = x2 - res.x;
        res.height = y2 - res.y;
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
    setMarginTop(rightMargin) {
        this.margin.right = rightMargin;
    }
    outlineRect(point) {
        let x = this.toScreenX(point.x) - this.outlineRectSize / 2;
        let y = this.toScreenY(point.y) - this.outlineRectSize / 2;
        let rect = new GraphicsRect(x, y, this.outlineRectSize, this.outlineRectSize);
        rect.color = point.color;
        return rect;
    }
    isCursorOnPoint(cursorX, cursorY, point) {
        let rect = this.outlineRect(point);
        return rect.contains(new Point(cursorX, cursorY));
    }
}